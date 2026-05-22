import { Monitor, LayoutGrid, Square, Maximize2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "single" | "grid";
type GridSize = 2 | 4 | 6;

interface ViewerHeaderProps {
  deviceCount: number;
  viewMode: ViewMode;
  gridSize: GridSize;
  onViewModeChange: (mode: ViewMode) => void;
  onGridSizeChange: (size: GridSize) => void;
}

const ViewerHeader = ({
  deviceCount,
  viewMode,
  gridSize,
  onViewModeChange,
  onGridSizeChange
}: ViewerHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      {/* Title Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20">
          <Monitor className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Screen Viewer
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time device screen mirroring via scrcpy
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Device Count Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-success">
            {deviceCount} online
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-muted/50 rounded-xl border border-border/50">
          <Button
            variant={viewMode === "single" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "h-9 px-4 gap-2 rounded-lg transition-all",
              viewMode === "single" && "shadow-sm"
            )}
            onClick={() => onViewModeChange("single")}
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Focus</span>
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "h-9 px-4 gap-2 rounded-lg transition-all",
              viewMode === "grid" && "shadow-sm"
            )}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </Button>
        </div>

        {/* Grid Size */}
        {viewMode === "grid" && (
          <div className="flex items-center p-1 bg-muted/50 rounded-xl border border-border/50">
            {([2, 4, 6] as GridSize[]).map((size) => (
              <Button
                key={size}
                variant={gridSize === size ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 w-9 p-0 rounded-lg transition-all",
                  gridSize === size && "shadow-sm"
                )}
                onClick={() => onGridSizeChange(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewerHeader;
