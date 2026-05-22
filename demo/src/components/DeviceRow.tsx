import { cn } from "@/lib/utils";
import { Smartphone, Battery, Camera, Download, Terminal, Monitor, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

export interface Device {
  id: string;
  name: string;
  model: string;
  brand: string;
  androidVersion: string;
  status: "online" | "offline" | "unauthorized";
  lastSeen: string;
  tags: string[];
  ip?: string;
  serial?: string;
  architecture?: string;
  battery?: number;
  storage?: string;
}

interface DeviceRowProps {
  device: Device;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig = {
  online: {
    dotClass: "bg-success",
  },
  offline: {
    dotClass: "bg-destructive",
  },
  unauthorized: {
    dotClass: "bg-warning",
  },
};

const DeviceRow = ({ device, isSelected, onClick }: DeviceRowProps) => {
  const status = statusConfig[device.status];
  const batteryLevel = device.battery || 0;
  const batteryColor = batteryLevel > 50 ? "text-success" : batteryLevel > 20 ? "text-warning" : "text-destructive";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group px-4 py-3 border-b border-border cursor-pointer transition-all",
        isSelected
          ? "bg-primary/5"
          : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <span className={cn("w-2 h-2 rounded-full flex-shrink-0", status.dotClass)} />

        {/* Device Icon */}
        <div className={cn(
          "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0",
          device.status === "online" ? "bg-success/10" : 
          device.status === "unauthorized" ? "bg-warning/10" : "bg-muted"
        )}>
          <Smartphone className={cn(
            "w-4 h-4",
            device.status === "online" ? "text-success" : 
            device.status === "unauthorized" ? "text-warning" : "text-muted-foreground"
          )} />
        </div>

        {/* Device Name */}
        <div className="min-w-[140px]">
          <h3 className="text-sm font-medium text-foreground truncate">{device.name}</h3>
        </div>

        {/* Model */}
        <div className="min-w-[120px] hidden md:block">
          <span className="text-sm text-muted-foreground truncate">{device.model}</span>
        </div>

        {/* Android Version */}
        <div className="min-w-[100px] hidden lg:block">
          <span className="text-xs text-muted-foreground">{device.androidVersion}</span>
        </div>

        {/* IP Address */}
        <div className="min-w-[120px] hidden xl:block">
          <span className="text-xs font-mono text-muted-foreground">{device.ip || "-"}</span>
        </div>

        {/* Battery */}
        <div className="min-w-[60px] hidden sm:flex items-center gap-1.5">
          <Battery className={cn("w-3.5 h-3.5", batteryColor)} />
          <span className={cn("text-xs", batteryColor)}>{batteryLevel}%</span>
        </div>

        {/* Last Seen */}
        <div className="min-w-[80px] hidden md:block">
          <span className="text-xs text-muted-foreground">{device.lastSeen}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Quick Actions - Show on Hover */}
        <div className={cn(
          "flex items-center gap-1 transition-opacity",
          "opacity-0 group-hover:opacity-100"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => { e.stopPropagation(); }}
            disabled={device.status !== "online"}
          >
            <Camera className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => { e.stopPropagation(); }}
            disabled={device.status !== "online"}
          >
            <Terminal className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => { e.stopPropagation(); }}
            disabled={device.status !== "online"}
          >
            <Monitor className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => { e.stopPropagation(); }}
            disabled={device.status !== "online"}
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceRow;
