import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PARTIES, PARTY_COLORS, type AreaVoteDetails } from "@shared/schema";
import { MapPin, Loader2, Users, Percent } from "lucide-react";
import { useState } from "react";
import { PartySymbol } from "./party-symbols";

interface AreaStatusProps {
  areas: AreaVoteDetails[];
  isLoading?: boolean;
}

export function AreaStatus({ areas, isLoading = false }: AreaStatusProps) {
  const [viewType, setViewType] = useState<"taluk" | "booth">("taluk");
  const [sortBy, setSortBy] = useState<"name" | "total">("name");

  const filteredAreas = areas.filter((a) => a.areaType === viewType);
  const sortedAreas = [...filteredAreas].sort((a, b) => {
    if (sortBy === "total") {
      return b.totalVotes - a.totalVotes;
    }
    return a.areaName.localeCompare(b.areaName);
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Area-wise Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="area-status-panel">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Area-wise Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={viewType} onValueChange={(v) => setViewType(v as "taluk" | "booth")}>
              <SelectTrigger className="w-28" data-testid="select-view-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taluk">Taluk</SelectItem>
                <SelectItem value="booth">Booth</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedAreas.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No {viewType} data available
          </p>
        ) : (
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => setSortBy("name")}
                  >
                    {viewType === "taluk" ? "Taluk" : "Booth"} Name
                    {sortBy === "name" && " ↓"}
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">Eligible</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Percent className="h-3 w-3" />
                      <span className="text-xs">Polled</span>
                    </div>
                  </TableHead>
                  {PARTIES.map((party) => (
                    <TableHead key={party} className="text-center w-20">
                      <div className="flex flex-col items-center gap-1">
                        <PartySymbol party={party} size={16} />
                        <span className="text-xs">{party.length > 8 ? party.substring(0, 6) + ".." : party}</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead 
                    className="text-right cursor-pointer hover:text-foreground"
                    onClick={() => setSortBy("total")}
                  >
                    Total
                    {sortBy === "total" && " ↓"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAreas.map((area) => {
                  const maxVotes = Math.max(...PARTIES.map((p) => area.partyVotes[p] || 0));
                  
                  return (
                    <TableRow key={area.areaId} data-testid={`area-row-${area.areaId}`}>
                      <TableCell className="font-medium">
                        {area.areaName}
                      </TableCell>
                      <TableCell className="text-center tabular-nums text-sm">
                        {area.eligibleVoters.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="secondary" 
                          className={`tabular-nums text-xs ${
                            area.pollingPercentage >= 70 ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                            area.pollingPercentage >= 50 ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" :
                            "bg-red-500/20 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {area.pollingPercentage.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      {PARTIES.map((party) => {
                        const votes = area.partyVotes[party] || 0;
                        const isMax = votes === maxVotes && votes > 0;
                        
                        return (
                          <TableCell 
                            key={party} 
                            className={`text-center tabular-nums ${isMax ? "font-bold" : ""}`}
                          >
                            <div className="relative">
                              <div
                                className="absolute inset-0 rounded opacity-20"
                                style={{
                                  backgroundColor: PARTY_COLORS[party],
                                  width: area.totalVotes > 0 ? `${(votes / area.totalVotes) * 100}%` : "0%",
                                }}
                              />
                              <span className="relative">
                                {votes.toLocaleString()}
                              </span>
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right font-semibold tabular-nums">
                        {area.totalVotes.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
