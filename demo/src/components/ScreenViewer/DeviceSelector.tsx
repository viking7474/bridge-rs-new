import { Monitor, Wifi, ChevronRight } from "lucide-react";
import { Device } from "../DeviceCard";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface DeviceSelectorProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelect: (deviceId: string) => void;
}

const DeviceSelector = ({ devices, selectedDeviceId, onSelect }: DeviceSelectorProps) => {
  return (
    <div className="w-72 flex flex-col bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <h3 className="font-semibold text-foreground">Available Devices</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {devices.length} device{devices.length !== 1 ? 's' : ''} connected
        </p>
      </div>

      {/* Device List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {devices.map((device) => {
            const isSelected = selectedDeviceId === device.id;
            return (
              <button
                key={device.id}
                onClick={() => onSelect(device.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group",
                  isSelected
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
                  isSelected 
                    ? "bg-primary/20" 
                    : "bg-muted group-hover:bg-muted/80"
                )}>
                  <Monitor className={cn(
                    "w-5 h-5 transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      "font-medium truncate transition-colors",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {device.name}
                    </p>
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground truncate">
                      {device.model}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">•</span>
                    <span className="text-xs text-muted-foreground">
                      {device.androidVersion}
                    </span>
                  </div>
                </div>

                <ChevronRight className={cn(
                  "w-4 h-4 transition-all",
                  isSelected 
                    ? "text-primary opacity-100" 
                    : "text-muted-foreground opacity-0 group-hover:opacity-100"
                )} />
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Connection Info */}
      <div className="p-4 border-t border-border/30 bg-muted/20">
        <div className="flex items-center gap-2 mb-3">
          <Wifi className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Connection</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-background/50 rounded-lg">
            <span className="text-muted-foreground">Protocol</span>
            <p className="font-medium text-foreground mt-0.5">scrcpy v2.4</p>
          </div>
          <div className="p-2 bg-background/50 rounded-lg">
            <span className="text-muted-foreground">Bitrate</span>
            <p className="font-medium text-foreground mt-0.5">8 Mbps</p>
          </div>
          <div className="p-2 bg-background/50 rounded-lg">
            <span className="text-muted-foreground">Max FPS</span>
            <p className="font-medium text-foreground mt-0.5">60</p>
          </div>
          <div className="p-2 bg-background/50 rounded-lg">
            <span className="text-muted-foreground">Latency</span>
            <p className="font-medium text-success mt-0.5">12ms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSelector;
