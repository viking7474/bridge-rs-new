import { cn } from "@/lib/utils";
import { Smartphone, Battery } from "lucide-react";

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

interface DeviceCardProps {
  device: Device;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig = {
  online: {
    label: "Online",
    className: "bg-success/10 text-success",
    dotClass: "bg-success",
  },
  offline: {
    label: "Offline",
    className: "bg-destructive/10 text-destructive",
    dotClass: "bg-destructive",
  },
  unauthorized: {
    label: "Unauthorized",
    className: "bg-warning/10 text-warning",
    dotClass: "bg-warning",
  },
};

const DeviceCard = ({ device, isSelected, onClick }: DeviceCardProps) => {
  const status = statusConfig[device.status];
  const batteryLevel = device.battery || 0;
  const batteryColor = batteryLevel > 50 ? "text-success" : batteryLevel > 20 ? "text-warning" : "text-destructive";

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg border cursor-pointer transition-colors",
        isSelected
          ? "bg-primary/5 border-primary"
          : "bg-card border-border hover:border-primary/50"
      )}
    >
      <div className="flex gap-3">
        {/* Device Icon */}
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
          device.status === "online" ? "bg-success/10" : 
          device.status === "unauthorized" ? "bg-warning/10" : "bg-muted"
        )}>
          <Smartphone className={cn(
            "w-6 h-6",
            device.status === "online" ? "text-success" : 
            device.status === "unauthorized" ? "text-warning" : "text-muted-foreground"
          )} />
        </div>

        {/* Device Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground truncate">{device.name}</h3>
            <span className={cn("flex items-center gap-1.5", batteryColor)}>
              <Battery className="w-3.5 h-3.5" />
              <span className="text-xs">{batteryLevel}%</span>
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {device.model} • {device.androidVersion}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
              status.className
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", status.dotClass)} />
              {status.label}
            </span>
            <span className="text-xs text-muted-foreground">{device.lastSeen}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
