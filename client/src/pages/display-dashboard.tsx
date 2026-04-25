import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PARTIES, PARTY_COLORS, type Party } from "@shared/schema";
import { TAMIL_NADU_DISTRICTS, generateConstituencies, generateAreas } from "@/lib/tamilnadu-map-data";
import { ChevronLeft, MapPin, BarChart3, Building2, Layers, X, Users } from "lucide-react";
import { TamilNaduMap } from "@/components/tamilnadu-map";
import { PartySymbol } from "@/components/party-symbols";
import { PollingStatsCard } from "@/components/polling-stats-card";

interface AnalyticsData {
  totalVotes: number;
  totalConstituencies: number;
  roundsCompleted: number;
  totalRounds: number;
  partyVotes: Record<Party, number>;
  roundWiseData: Array<{ round: number; votes: Record<Party, number>; totalVotes: number }>;
  boothWiseData: Array<{ areaId: string; areaName: string; votes: Record<Party, number>; totalVotes: number; eligibleVoters: number; pollingPercentage: number; cumulativeEligibleVoters: number }>;
}

type ViewMode = "overview" | "districts" | "constituency";

interface ViewState {
  mode: ViewMode;
  districtId?: string;
  districtName?: string;
  constituencyId?: string;
  constituencyName?: string;
}

const PARTY_GRADIENT_COLORS: Record<Party, { from: string; to: string; glow: string }> = {
  DMK: { from: "#FF1744", to: "#D50000", glow: "rgba(255, 23, 68, 0.6)" },
  AIADMK: { from: "#00E676", to: "#00C853", glow: "rgba(0, 230, 118, 0.6)" },
  TVK: { from: "#FFEA00", to: "#FFD600", glow: "rgba(255, 234, 0, 0.6)" },
  "Naam Tamilar": { from: "#FF6D00", to: "#E65100", glow: "rgba(255, 109, 0, 0.6)" },
  Others: { from: "#B388FF", to: "#7C4DFF", glow: "rgba(179, 136, 255, 0.6)" },
};

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = null;
    
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue.current + (value - startValue.current) * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString("en-IN")}</span>;
}

function ParticleBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
          }}
          animate={{
            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function GlowingOrb({ color, size, top, left, delay }: { color: string; size: number; top: string; left: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-30 pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        top,
        left,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function LiveIndicator() {
  return (
    <motion.div
      className="flex items-center gap-3 px-6 py-3 bg-red-600/20 backdrop-blur-xl rounded-full border border-red-500/50"
      animate={{ boxShadow: ["0 0 20px rgba(239,68,68,0.3)", "0 0 40px rgba(239,68,68,0.6)", "0 0 20px rgba(239,68,68,0.3)"] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <motion.div
        className="w-4 h-4 bg-red-500 rounded-full"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <span className="text-red-400 font-bold text-xl tracking-widest">LIVE</span>
    </motion.div>
  );
}

function TouchButton({ 
  children, 
  onClick, 
  variant = "default",
  size = "default",
  className = ""
}: { 
  children: React.ReactNode; 
  onClick: () => void;
  variant?: "default" | "primary" | "back";
  size?: "default" | "large";
  className?: string;
}) {
  const baseStyles = "relative overflow-visible rounded-2xl font-bold transition-all active:scale-95 touch-manipulation select-none";
  const sizeStyles = size === "large" ? "px-8 py-4 text-xl" : "px-6 py-3 text-lg";
  const variantStyles = {
    default: "bg-white/10 border border-white/20 text-white backdrop-blur-xl",
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/50",
    back: "bg-white/5 border border-white/10 text-white/80",
  };

  return (
    <motion.button
      className={`${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-testid={`button-touch-${variant}`}
    >
      {children}
    </motion.button>
  );
}

function DistrictThumbnail({ 
  district, 
  onSelect,
  index
}: { 
  district: { id: string; name: string }; 
  onSelect: (id: string, name: string) => void;
  index: number;
}) {
  const constituencies = generateConstituencies(district.id);
  
  return (
    <motion.button
      className="relative overflow-visible rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-4 text-left touch-manipulation select-none"
      onClick={() => onSelect(district.id, district.name)}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.4, type: "spring" }}
      whileHover={{ scale: 1.03, borderColor: "rgba(34, 211, 238, 0.5)" }}
      whileTap={{ scale: 0.98 }}
      data-testid={`button-district-${district.id}`}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-bold text-lg truncate">{district.name}</span>
        </div>
        <div className="text-white/60 text-sm">
          {constituencies.length} Constituencies
        </div>
      </div>
    </motion.button>
  );
}

function ConstituencyThumbnail({ 
  constituency, 
  onSelect,
  index
}: { 
  constituency: { id: string; name: string; reserved?: string }; 
  onSelect: (id: string, name: string) => void;
  index: number;
}) {
  return (
    <motion.button
      className="relative overflow-visible rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-4 text-left touch-manipulation select-none"
      onClick={() => onSelect(constituency.id, constituency.name)}
      initial={{ opacity: 0, x: 30, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, type: "spring" }}
      whileHover={{ scale: 1.03, borderColor: "rgba(34, 211, 238, 0.5)" }}
      whileTap={{ scale: 0.98 }}
      data-testid={`button-constituency-${constituency.id}`}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold truncate">{constituency.name}</span>
        </div>
        {constituency.reserved && (
          <span className="inline-block px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
            {constituency.reserved}
          </span>
        )}
      </div>
    </motion.button>
  );
}

function PartyBar3D({ party, votes, totalVotes, rank }: { party: Party; votes: number; totalVotes: number; rank: number }) {
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  const colors = PARTY_GRADIENT_COLORS[party];
  
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.5, type: "spring" }}
    >
      <div className="flex items-center gap-3 mb-1">
        <motion.div
          className="flex-shrink-0"
          style={{ 
            filter: `drop-shadow(0 0 10px ${colors.glow})`,
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <PartySymbol party={party} size={28} />
        </motion.div>
        <span className="text-white font-bold text-lg">{party}</span>
        <span className="ml-auto text-white/80 text-xl font-mono">
          <AnimatedNumber value={votes} duration={1000} />
        </span>
      </div>
      
      <div className="relative h-8 bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-lg"
          style={{
            background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
            boxShadow: `0 0 20px ${colors.glow}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: rank * 0.1 + 0.2, duration: 1, type: "spring" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, delay: rank * 0.1 }}
          />
        </motion.div>
        
        <motion.div
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: rank * 0.1 + 0.5 }}
        >
          {percentage.toFixed(1)}%
        </motion.div>
      </div>
    </motion.div>
  );
}

function RoundWisePanel({ roundData }: { roundData: AnalyticsData["roundWiseData"] }) {
  if (!roundData || roundData.length === 0) {
    return (
      <div className="text-center text-white/60 py-8">
        No round data available yet
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
      {roundData.map((round, index) => {
        const totalVotes = round.totalVotes || Object.values(round.votes).reduce((a, b) => a + b, 0);
        const leadingParty = Object.entries(round.votes).sort(([,a], [,b]) => b - a)[0];
        const colors = leadingParty ? PARTY_GRADIENT_COLORS[leadingParty[0] as Party] : null;
        
        return (
          <motion.div
            key={round.round}
            className="relative rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{
                    background: colors ? `linear-gradient(135deg, ${colors.from}40, ${colors.to}40)` : "rgba(255,255,255,0.1)",
                    border: colors ? `2px solid ${colors.from}` : "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {round.round}
                </div>
                <div>
                  <div className="text-white font-bold">Round {round.round}</div>
                  <div className="text-white/60 text-sm">{totalVotes.toLocaleString("en-IN")} votes</div>
                </div>
              </div>
              {leadingParty && (
                <div 
                  className="px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors?.from}30, ${colors?.to}30)`,
                    color: colors?.from,
                    border: `1px solid ${colors?.from}50`,
                  }}
                >
                  <PartySymbol party={leadingParty[0] as Party} size={18} />
                  {leadingParty[0]}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-2 mt-3">
              {PARTIES.map(party => {
                const votes = round.votes[party] || 0;
                const pColors = PARTY_GRADIENT_COLORS[party];
                return (
                  <div key={party} className="flex flex-col items-center">
                    <PartySymbol party={party} size={20} />
                    <div className="text-white/80 text-sm font-mono mt-1">
                      {votes.toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function BoothWisePanel({ boothData }: { boothData: AnalyticsData["boothWiseData"] }) {
  if (!boothData || boothData.length === 0) {
    return (
      <div className="text-center text-white/60 py-8">
        No booth data available yet
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
      {boothData.slice(0, 10).map((booth, index) => {
        const leadingParty = Object.entries(booth.votes).sort(([,a], [,b]) => b - a)[0];
        const colors = leadingParty ? PARTY_GRADIENT_COLORS[leadingParty[0] as Party] : null;
        
        return (
          <motion.div
            key={booth.areaId}
            className="relative rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-white font-bold">{booth.areaName}</div>
                  <div className="text-white/60 text-sm flex flex-wrap gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      Votes: {booth.totalVotes?.toLocaleString("en-IN") || "0"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Eligible: {booth.eligibleVoters?.toLocaleString("en-IN") || "N/A"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-cyan-400">
                      Cumulative: {booth.cumulativeEligibleVoters?.toLocaleString("en-IN") || "N/A"}
                    </span>
                    <span className={`font-semibold ${
                      (booth.pollingPercentage || 0) >= 70 ? "text-green-400" :
                      (booth.pollingPercentage || 0) >= 50 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {booth.pollingPercentage?.toFixed(1) || "0"}% polled
                    </span>
                  </div>
                </div>
              </div>
              {leadingParty && (
                <div 
                  className="px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors?.from}30, ${colors?.to}30)`,
                    color: colors?.from,
                    border: `1px solid ${colors?.from}50`,
                  }}
                >
                  <PartySymbol party={leadingParty[0] as Party} size={16} />
                  {leadingParty[0]}: {leadingParty[1].toLocaleString("en-IN")}
                </div>
              )}
            </div>
            
            <div className="flex gap-1 mt-2">
              {PARTIES.map(party => {
                const votes = booth.votes[party] || 0;
                const percentage = booth.totalVotes > 0 ? (votes / booth.totalVotes) * 100 : 0;
                const pColors = PARTY_GRADIENT_COLORS[party];
                return (
                  <motion.div
                    key={party}
                    className="h-2 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${pColors.from}, ${pColors.to})`,
                      width: `${percentage}%`,
                      minWidth: percentage > 0 ? "4px" : "0",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  />
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function DistrictConstituencyPopup({
  isOpen,
  districtId,
  districtName,
  onClose,
  onSelectConstituency,
}: {
  isOpen: boolean;
  districtId: string;
  districtName: string;
  onClose: () => void;
  onSelectConstituency: (id: string, name: string) => void;
}) {
  const constituencies = generateConstituencies(districtId);
  const analyticsUrl = `/api/display/analytics?districtId=${districtId}`;
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: [analyticsUrl],
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const partyVotes = analytics?.partyVotes || { DMK: 0, AIADMK: 0, TVK: 0, "Naam Tamilar": 0, Others: 0 };
  const totalVotes = analytics?.totalVotes || 0;
  const sortedParties = Object.entries(partyVotes).sort(([, a], [, b]) => b - a) as [Party, number][];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        
        <motion.div
          className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/20 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
                animate={{ boxShadow: ["0 0 20px rgba(34, 211, 238, 0.3)", "0 0 40px rgba(34, 211, 238, 0.6)", "0 0 20px rgba(34, 211, 238, 0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black text-white">{districtName}</h2>
                <p className="text-white/60">{constituencies.length} Constituencies</p>
              </div>
            </div>
            <motion.button
              className="p-3 rounded-full bg-white/10 border border-white/20 text-white"
              onClick={onClose}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.9 }}
              data-testid="button-close-popup"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="relative z-10 p-6 overflow-y-auto max-h-[calc(85vh-120px)] custom-scrollbar">
            {totalVotes > 0 && (
              <motion.div
                className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-white/60 text-sm">DISTRICT SUMMARY</span>
                  <span className="text-white font-bold text-lg">{totalVotes.toLocaleString("en-IN")} votes</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sortedParties.map(([party, votes]) => {
                    const colors = PARTY_GRADIENT_COLORS[party];
                    const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : "0";
                    return (
                      <motion.div
                        key={party}
                        className="px-4 py-2 rounded-xl border flex items-center gap-2"
                        style={{
                          background: `linear-gradient(135deg, ${colors.from}20, ${colors.to}20)`,
                          borderColor: `${colors.from}50`,
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <PartySymbol party={party as Party} size={24} />
                        <div>
                          <div className="text-xs" style={{ color: colors.from }}>{party}</div>
                          <div className="text-white font-bold">{percentage}%</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              SELECT CONSTITUENCY
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {constituencies.map((constituency, index) => (
                <motion.button
                  key={constituency.id}
                  className="relative overflow-visible rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 p-4 text-left"
                  onClick={() => {
                    onSelectConstituency(constituency.id, constituency.name);
                    onClose();
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.03, borderColor: "rgba(16, 185, 129, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`button-popup-constituency-${constituency.id}`}
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0"
                    whileHover={{ opacity: 1 }}
                  />
                  <div className="relative z-10">
                    <span className="text-white font-semibold text-sm">{constituency.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function OverviewDisplay({ 
  analytics, 
  partyVotes, 
  totalVotes,
  onDistrictClick,
}: { 
  analytics: AnalyticsData | undefined;
  partyVotes: Record<Party, number>;
  totalVotes: number;
  onDistrictClick: (districtId: string, districtName: string) => void;
}) {
  const sortedParties = Object.entries(partyVotes)
    .sort(([, a], [, b]) => b - a) as [Party, number][];
  
  const leader = sortedParties[0];
  const leaderColors = leader ? PARTY_GRADIENT_COLORS[leader[0]] : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <motion.div
        className="xl:col-span-1 relative rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 p-4 min-h-[500px]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-cyan-400" />
          TAMIL NADU MAP
        </h2>
        <p className="text-white/60 text-sm mb-4">Click on any district to view constituencies</p>
        <div className="h-[420px]">
          <TamilNaduMap 
            onDistrictClick={onDistrictClick}
            showGlowEffects={true}
          />
        </div>
      </motion.div>

      <motion.div
        className="xl:col-span-1 relative rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {leaderColors && (
          <div 
            className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
            style={{ background: `linear-gradient(135deg, ${leaderColors.from}, ${leaderColors.to})` }}
          />
        )}
        
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            PARTY-WISE RESULTS
          </h2>
          
          <div className="space-y-4">
            {sortedParties.map(([party, votes], index) => (
              <PartyBar3D
                key={party}
                party={party}
                votes={votes}
                totalVotes={totalVotes}
                rank={index}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <div className="xl:col-span-1 grid grid-rows-2 gap-6">
        <motion.div
          className="rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold">R</div>
            ROUND-WISE STATUS
          </h2>
          <RoundWisePanel roundData={analytics?.roundWiseData || []} />
        </motion.div>

        <motion.div
          className="rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <Layers className="w-6 h-6 text-purple-400" />
            BOOTH-WISE STATUS
          </h2>
          <BoothWisePanel boothData={analytics?.boothWiseData || []} />
        </motion.div>
      </div>
    </div>
  );
}

function DistrictsGrid({ onSelectDistrict }: { onSelectDistrict: (id: string, name: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {TAMIL_NADU_DISTRICTS.map((district, index) => (
        <DistrictThumbnail
          key={district.id}
          district={district}
          onSelect={onSelectDistrict}
          index={index}
        />
      ))}
    </div>
  );
}

function ConstituencyView({ 
  districtId, 
  districtName,
  onSelectConstituency,
  onBack
}: { 
  districtId: string;
  districtName: string;
  onSelectConstituency: (id: string, name: string) => void;
  onBack: () => void;
}) {
  const constituencies = generateConstituencies(districtId);

  return (
    <div>
      <motion.div 
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <TouchButton variant="back" onClick={onBack}>
          <ChevronLeft className="w-5 h-5 inline mr-1" />
          Back
        </TouchButton>
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-cyan-400" />
          <div>
            <h2 className="text-3xl font-black text-white">{districtName}</h2>
            <p className="text-white/60">{constituencies.length} Constituencies</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {constituencies.map((constituency, index) => (
          <ConstituencyThumbnail
            key={constituency.id}
            constituency={constituency}
            onSelect={onSelectConstituency}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function ConstituencyDetails({ 
  constituencyId, 
  constituencyName,
  districtName,
  onBack
}: { 
  constituencyId: string;
  constituencyName: string;
  districtName: string;
  onBack: () => void;
}) {
  const analyticsUrl = `/api/display/analytics?constituencyId=${constituencyId}`;
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: [analyticsUrl],
    refetchInterval: 5000,
  });

  const areas = generateAreas(constituencyId);
  const partyVotes = analytics?.partyVotes || { DMK: 0, AIADMK: 0, TVK: 0, "Naam Tamilar": 0, Others: 0 };
  const totalVotes = analytics?.totalVotes || 0;
  const sortedParties = Object.entries(partyVotes).sort(([,a], [,b]) => b - a) as [Party, number][];

  return (
    <div>
      <motion.div 
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <TouchButton variant="back" onClick={onBack}>
          <ChevronLeft className="w-5 h-5 inline mr-1" />
          {districtName}
        </TouchButton>
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-emerald-400" />
          <div>
            <h2 className="text-3xl font-black text-white">{constituencyName}</h2>
            <p className="text-white/60">{districtName} District</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            VOTE RESULTS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {sortedParties.map(([party, votes], index) => (
                <PartyBar3D
                  key={party}
                  party={party}
                  votes={votes}
                  totalVotes={totalVotes}
                  rank={index}
                />
              ))}
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="text-white/60 text-lg mb-2">TOTAL VOTES</div>
              <motion.div
                className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"
              >
                <AnimatedNumber value={totalVotes} />
              </motion.div>
              
              {sortedParties[0] && (
                <motion.div
                  className="mt-6 px-6 py-3 rounded-full font-bold text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${PARTY_GRADIENT_COLORS[sortedParties[0][0]].from}30, ${PARTY_GRADIENT_COLORS[sortedParties[0][0]].to}30)`,
                    border: `2px solid ${PARTY_GRADIENT_COLORS[sortedParties[0][0]].from}`,
                    color: PARTY_GRADIENT_COLORS[sortedParties[0][0]].from,
                    boxShadow: `0 0 30px ${PARTY_GRADIENT_COLORS[sortedParties[0][0]].glow}`,
                  }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  LEADING: {sortedParties[0][0]}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            className="rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold">R</div>
              ROUND STATUS
            </h3>
            <RoundWisePanel roundData={analytics?.roundWiseData || []} />
          </motion.div>

          <motion.div
            className="rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              BOOTH STATUS
            </h3>
            <BoothWisePanel boothData={analytics?.boothWiseData || []} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function DisplayDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewState, setViewState] = useState<ViewState>({ mode: "overview" });
  const [popupState, setPopupState] = useState<{ isOpen: boolean; districtId: string; districtName: string }>({ 
    isOpen: false, 
    districtId: "", 
    districtName: "" 
  });
  const queryClient = useQueryClient();

  const analyticsUrl = viewState.constituencyId 
    ? `/api/display/analytics?constituencyId=${viewState.constituencyId}`
    : viewState.districtId 
    ? `/api/display/analytics?districtId=${viewState.districtId}`
    : "/api/display/analytics";

  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: [analyticsUrl],
    refetchInterval: 5000,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // WebSocket for real-time updates - invalidate all analytics queries
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    ws.onopen = () => {
      console.log("Display Dashboard WebSocket connected");
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data.type);
        if (data.type === "vote:update" || data.type === "votes:reset") {
          queryClient.invalidateQueries({ predicate: (query) => {
            const key = query.queryKey[0];
            return typeof key === 'string' && (key.includes('/api/display/analytics') || key.includes('/api/polling-stats'));
          }});
        }
      } catch (e) {
        console.error("WebSocket parse error:", e);
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    ws.onclose = () => {
      console.log("Display Dashboard WebSocket disconnected");
    };
    
    return () => ws.close();
  }, [queryClient]);

  const totalVotes = analytics?.totalVotes || 0;
  const partyVotes = analytics?.partyVotes || { DMK: 0, AIADMK: 0, TVK: 0, "Naam Tamilar": 0, Others: 0 };

  const handleSelectDistrict = (districtId: string, districtName: string) => {
    setViewState({ mode: "districts", districtId, districtName });
  };

  const handleSelectConstituency = (constituencyId: string, constituencyName: string) => {
    setViewState(prev => ({ 
      ...prev, 
      mode: "constituency", 
      constituencyId, 
      constituencyName 
    }));
  };

  const handleBackToOverview = () => {
    setViewState({ mode: "overview" });
  };

  const handleBackToDistrict = () => {
    setViewState(prev => ({ 
      mode: "districts", 
      districtId: prev.districtId, 
      districtName: prev.districtName 
    }));
  };

  const handleMapDistrictClick = (districtId: string, districtName: string) => {
    setPopupState({ isOpen: true, districtId, districtName });
  };

  const handlePopupClose = () => {
    setPopupState({ isOpen: false, districtId: "", districtName: "" });
  };

  const handlePopupConstituencySelect = (constituencyId: string, constituencyName: string) => {
    setViewState({
      mode: "constituency",
      districtId: popupState.districtId,
      districtName: popupState.districtName,
      constituencyId,
      constituencyName,
    });
    setPopupState({ isOpen: false, districtId: "", districtName: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
      
      <ParticleBackground />
      
      <GlowingOrb color="rgba(59, 130, 246, 0.5)" size={400} top="10%" left="5%" delay={0} />
      <GlowingOrb color="rgba(168, 85, 247, 0.5)" size={300} top="60%" left="80%" delay={1} />
      <GlowingOrb color="rgba(236, 72, 153, 0.5)" size={350} top="80%" left="20%" delay={2} />

      <header className="relative z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-3xl md:text-4xl font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                  TAMIL NADU
                </span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white/80">
                ELECTION 2026
              </div>
            </motion.div>

            <div className="flex items-center gap-4 md:gap-6">
              <LiveIndicator />
              <motion.div
                className="text-2xl md:text-3xl font-mono text-cyan-400"
                style={{ textShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
              >
                {currentTime.toLocaleTimeString("en-IN", { hour12: false })}
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-4">
        <motion.div
          className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-white/60 text-sm">TOTAL VOTES</div>
                <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  <AnimatedNumber value={totalVotes} />
                </div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <div className="text-white/60 text-sm">CONSTITUENCIES</div>
                <div className="text-2xl md:text-3xl font-bold text-white">234</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <div className="text-white/60 text-sm">ROUNDS</div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {analytics?.roundsCompleted || 0}/{analytics?.totalRounds || 23}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <TouchButton 
                variant={viewState.mode === "overview" ? "primary" : "default"}
                onClick={handleBackToOverview}
              >
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Overview
              </TouchButton>
              <TouchButton 
                variant={viewState.mode === "districts" || viewState.mode === "constituency" ? "primary" : "default"}
                onClick={() => setViewState({ mode: "districts" })}
              >
                <MapPin className="w-5 h-5 inline mr-2" />
                Districts
              </TouchButton>
            </div>
          </div>
        </motion.div>
      </div>

      <main className="relative z-10 container mx-auto px-6 pb-8">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            POLLING STATISTICS
          </h2>
          <PollingStatsCard variant="display" />
        </motion.div>

        <AnimatePresence mode="wait">
          {viewState.mode === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OverviewDisplay 
                analytics={analytics} 
                partyVotes={partyVotes} 
                totalVotes={totalVotes}
                onDistrictClick={handleMapDistrictClick}
              />
            </motion.div>
          )}

          {viewState.mode === "districts" && !viewState.constituencyId && (
            <motion.div
              key="districts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewState.districtId ? (
                <ConstituencyView
                  districtId={viewState.districtId}
                  districtName={viewState.districtName || ""}
                  onSelectConstituency={handleSelectConstituency}
                  onBack={() => setViewState({ mode: "districts" })}
                />
              ) : (
                <>
                  <motion.h2 
                    className="text-3xl font-bold text-white mb-6 flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <MapPin className="w-8 h-8 text-cyan-400" />
                    SELECT DISTRICT
                  </motion.h2>
                  <DistrictsGrid onSelectDistrict={handleSelectDistrict} />
                </>
              )}
            </motion.div>
          )}

          {viewState.mode === "constituency" && viewState.constituencyId && (
            <motion.div
              key="constituency"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ConstituencyDetails
                constituencyId={viewState.constituencyId}
                constituencyName={viewState.constituencyName || ""}
                districtName={viewState.districtName || ""}
                onBack={handleBackToDistrict}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <motion.div
        className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 z-50"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <DistrictConstituencyPopup
        isOpen={popupState.isOpen}
        districtId={popupState.districtId}
        districtName={popupState.districtName}
        onClose={handlePopupClose}
        onSelectConstituency={handlePopupConstituencySelect}
      />
    </div>
  );
}
