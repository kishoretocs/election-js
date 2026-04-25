import { ChevronRight, Map } from "lucide-react";

interface BreadcrumbsProps {
  districtName?: string;
  constituencyName?: string;
  onDistrictClick?: () => void;
  onHomeClick?: () => void;
}

export function Breadcrumbs({
  districtName,
  constituencyName,
  onDistrictClick,
  onHomeClick,
}: BreadcrumbsProps) {
  return (
    <nav
      className="flex items-center gap-1 text-sm"
      aria-label="Breadcrumb"
      data-testid="breadcrumbs"
    >
      <button
        onClick={onHomeClick}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        data-testid="breadcrumb-home"
      >
        <Map className="h-4 w-4" />
        <span>Tamil Nadu</span>
      </button>

      {districtName && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={onDistrictClick}
            className={`transition-colors ${
              constituencyName
                ? "text-muted-foreground hover:text-foreground"
                : "text-foreground font-medium"
            }`}
            data-testid="breadcrumb-district"
          >
            {districtName}
          </button>
        </>
      )}

      {constituencyName && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span
            className="text-foreground font-medium"
            data-testid="breadcrumb-constituency"
          >
            {constituencyName}
          </span>
        </>
      )}
    </nav>
  );
}
