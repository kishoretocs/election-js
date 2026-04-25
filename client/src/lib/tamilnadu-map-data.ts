// Re-export from shared module and add client-specific extensions
export { 
  TAMIL_NADU_DISTRICTS, 
  CONSTITUENCY_NAMES,
  generateConstituencies as generateConstituenciesBase,
  generateAreas,
  type DistrictMapData 
} from "@shared/tamilnadu-data";

import { TAMIL_NADU_DISTRICTS, CONSTITUENCY_NAMES } from "@shared/tamilnadu-data";

export interface ConstituencyMapData {
  id: string;
  districtId: string;
  name: string;
  tamilName: string;
  path: string;
  labelX: number;
  labelY: number;
}

// Generate constituencies with SVG positioning for the client map
export function generateConstituencies(districtId: string): ConstituencyMapData[] {
  const district = TAMIL_NADU_DISTRICTS.find(d => d.id === districtId);
  if (!district) return [];

  const names = CONSTITUENCY_NAMES[districtId] || ["Constituency 1", "Constituency 2", "Constituency 3"];
  
  return names.map((name, index) => {
    const baseX = district.labelX - 40 + (index % 3) * 40;
    const baseY = district.labelY - 20 + Math.floor(index / 3) * 30;
    
    return {
      id: `${districtId}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      districtId,
      name,
      tamilName: name,
      path: `M ${baseX} ${baseY} L ${baseX + 35} ${baseY} L ${baseX + 35} ${baseY + 25} L ${baseX} ${baseY + 25} Z`,
      labelX: baseX + 17,
      labelY: baseY + 15,
    };
  });
}
