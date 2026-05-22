import { Device } from "./DeviceRow";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Camera, 
  Download, 
  Upload, 
  Terminal,
  Wifi,
  Usb,
  HardDrive,
  Cpu,
  Battery,
  Play,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeviceDetailProps {
  device: Device;
  onClose?: () => void;
}

const statusConfig = {
  online: { label: "Online", className: "bg-success/10 text-success" },
  offline: { label: "Offline", className: "bg-destructive/10 text-destructive" },
  unauthorized: { label: "Unauthorized", className: "bg-warning/10 text-warning" },
};

const DeviceDetail = ({ device, onClose }: DeviceDetailProps) => {
  const status = statusConfig[device.status];
  const batteryLevel = device.battery || 82;
  const storageUsed = 65;

  return (
    <div className="p-4">
      <div className="flex items-start gap-6">
        {/* Device Header */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            device.status === "online" ? "bg-success/10" : 
            device.status === "unauthorized" ? "bg-warning/10" : "bg-muted"
          )}>
            <Smartphone className={cn(
              "w-5 h-5",
              device.status === "online" ? "text-success" : 
              device.status === "unauthorized" ? "text-warning" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">{device.name}</h3>
            <p className="text-xs text-muted-foreground">{device.model}</p>
          </div>
          <span className={cn("px-2 py-0.5 rounded text-xs font-medium ml-2", status.className)}>
            {status.label}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          {[
            { icon: Camera, label: "Screenshot" },
            { icon: Download, label: "Install APK" },
            { icon: Upload, label: "Push File" },
            { icon: Terminal, label: "Shell" },
            { icon: Play, label: "Screen" },
            { icon: Wifi, label: "Wireless" },
          ].map((action, i) => (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              className="h-8 px-3 gap-1.5"
              disabled={device.status !== "online"}
            >
              <action.icon className="w-3.5 h-3.5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* System Info - Compact */}
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <Usb className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">USB</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-mono text-foreground">{device.architecture}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-mono text-foreground">{device.ip || "-"}</span>
          </div>
        </div>

        {/* Resources - Compact */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2 min-w-[100px]">
            <Battery className={cn(
              "w-3.5 h-3.5",
              batteryLevel > 50 ? "text-success" : batteryLevel > 20 ? "text-warning" : "text-destructive"
            )} />
            <div className="flex-1">
              <Progress 
                value={batteryLevel} 
                className={cn(
                  "h-1.5 w-16",
                  batteryLevel > 50 ? "[&>div]:bg-success" : batteryLevel > 20 ? "[&>div]:bg-warning" : "[&>div]:bg-destructive"
                )} 
              />
            </div>
            <span className="text-xs text-muted-foreground">{batteryLevel}%</span>
          </div>
          <div className="flex items-center gap-2 min-w-[100px]">
            <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex-1">
              <Progress value={storageUsed} className="h-1.5 w-16" />
            </div>
            <span className="text-xs text-muted-foreground">{device.storage}</span>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DeviceDetail;
