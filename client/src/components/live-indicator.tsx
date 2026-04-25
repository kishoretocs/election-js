import { useEffect, useState } from "react";

interface LiveIndicatorProps {
  isConnected: boolean;
}

export function LiveIndicator({ isConnected }: LiveIndicatorProps) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2" data-testid="live-indicator">
      <div className="relative flex items-center">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          } ${pulse && isConnected ? "animate-pulse" : ""}`}
        />
        {isConnected && (
          <span
            className={`absolute h-2.5 w-2.5 rounded-full bg-green-500 ${
              pulse ? "animate-ping" : ""
            }`}
            style={{ opacity: 0.5 }}
          />
        )}
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {isConnected ? "Live" : "Disconnected"}
      </span>
    </div>
  );
}
