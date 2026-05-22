import { useState } from "react";
import { Monitor } from "lucide-react";
import { Device } from "../DeviceCard";
import { cn } from "@/lib/utils";
import DeviceScreen from "./DeviceScreen";
import DeviceSelector from "./DeviceSelector";
import ViewerHeader from "./ViewerHeader";
import StatusBar from "./StatusBar";

interface ScreenViewerProps {
  devices: Device[];
}

type ViewMode = "single" | "grid";
type GridSize = 2 | 4 | 6;

const ScreenViewer = ({ devices }: ScreenViewerProps) => {
  const onlineDevices = devices.filter((d) => d.status === "online");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(
    onlineDevices[0]?.id || null
  );

  const selectedDeviceData = devices.find((d) => d.id === selectedDevice);

  const getGridClass = () => {
    switch (gridSize) {
      case 2: return "grid-cols-1 md:grid-cols-2";
      case 4: return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";
      case 6: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
      default: return "grid-cols-2";
    }
  };

  return (
    <div className="h-full flex flex-col p-6 gap-5 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <ViewerHeader
        deviceCount={onlineDevices.length}
        viewMode={viewMode}
        gridSize={gridSize}
        onViewModeChange={setViewMode}
        onGridSizeChange={setGridSize}
      />

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {onlineDevices.length === 0 ? (
          /* Empty State */
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-muted/50 flex items-center justify-center">
                <Monitor className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Devices Online
              </h3>
              <p className="text-muted-foreground">
                Connect a device via USB or Wi-Fi to start screen mirroring
              </p>
            </div>
          </div>
        ) : viewMode === "single" ? (
          /* Single View */
          <div className="h-full flex gap-5">
            <DeviceSelector
              devices={onlineDevices}
              selectedDeviceId={selectedDevice}
              onSelect={setSelectedDevice}
            />
            
            <div className="flex-1 min-w-0">
              {selectedDeviceData && (
                <DeviceScreen device={selectedDeviceData} isSelected />
              )}
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className={cn("grid gap-4 h-full auto-rows-fr", getGridClass())}>
            {onlineDevices.slice(0, gridSize).map((device) => (
              <DeviceScreen
                key={device.id}
                device={device}
                isCompact
                isSelected={selectedDevice === device.id}
                onSelect={() => setSelectedDevice(device.id)}
              />
            ))}
            
            {/* Empty Slots */}
            {onlineDevices.length < gridSize &&
              Array.from({ length: gridSize - onlineDevices.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center justify-center bg-muted/10 rounded-2xl border-2 border-dashed border-border/30"
                >
                  <div className="text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted/30 flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm text-muted-foreground/50">
                      Empty slot
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar deviceCount={onlineDevices.length} />
    </div>
  );
};

export default ScreenViewer;
