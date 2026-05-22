import { Device } from "./DeviceRow";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  ChevronDown,
  Smartphone,
  Camera,
  Download,
  Upload,
  Terminal,
  Play,
  Wifi,
  Usb,
  Cpu,
  HardDrive,
  Battery,
  RefreshCw,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DevicePanelProps {
  device: Device | null;
}

const statusConfig = {
  online: { label: "Online", className: "bg-success/10 text-success" },
  offline: { label: "Offline", className: "bg-destructive/10 text-destructive" },
  unauthorized: { label: "Unauthorized", className: "bg-warning/10 text-warning" },
};

const DevicePanel = ({ device }: DevicePanelProps) => {
  const [actionsOpen, setActionsOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(true);

  if (!device) {
    return (
      <div className="w-80 bg-card border-l border-border flex flex-col h-full items-center justify-center">
        <Smartphone className="w-10 h-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">Select a device to view details</p>
      </div>
    );
  }

  const status = statusConfig[device.status];
  const batteryLevel = device.battery || 82;
  const storageUsed = 65;

  const quickActions = [
    { icon: Camera, label: "Screenshot" },
    { icon: Download, label: "Install APK" },
    { icon: Upload, label: "Push File" },
    { icon: Terminal, label: "Shell" },
    { icon: Play, label: "Screen" },
    { icon: Wifi, label: "Wireless" },
  ];

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full overflow-hidden">
      {/* Device Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
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
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">{device.name}</h3>
            <p className="text-xs text-muted-foreground">{device.model}</p>
          </div>
          <span className={cn("px-2 py-0.5 rounded text-xs font-medium shrink-0", status.className)}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {/* Quick Actions Section */}
        <Collapsible open={actionsOpen} onOpenChange={setActionsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <span className="text-sm font-medium text-foreground">Quick Actions</span>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              actionsOpen && "rotate-180"
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="h-9 justify-start gap-2 bg-muted/30 hover:bg-muted"
                  disabled={device.status !== "online"}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* System Info Section */}
        <Collapsible open={systemOpen} onOpenChange={setSystemOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <span className="text-sm font-medium text-foreground">System Info</span>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              systemOpen && "rotate-180"
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InfoItem icon={Usb} label="Connection" value="USB" />
              <InfoItem icon={Cpu} label="Arch" value={device.architecture || "arm64"} />
              <InfoItem icon={Wifi} label="IP" value={device.ip || "-"} />
              <InfoItem icon={Settings} label="OS" value={device.androidVersion} />
            </div>
            <div className="pt-2 border-t border-border">
              <InfoItem icon={RefreshCw} label="Serial" value={device.serial || "-"} fullWidth />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Resources Section */}
        <Collapsible open={resourcesOpen} onOpenChange={setResourcesOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <span className="text-sm font-medium text-foreground">Resources</span>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              resourcesOpen && "rotate-180"
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-4">
            {/* Battery */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className={cn(
                    "w-4 h-4",
                    batteryLevel > 50 ? "text-success" : batteryLevel > 20 ? "text-warning" : "text-destructive"
                  )} />
                  <span className="text-sm text-foreground">Battery</span>
                </div>
                <span className="text-sm font-medium text-foreground">{batteryLevel}%</span>
              </div>
              <Progress 
                value={batteryLevel} 
                className={cn(
                  "h-2",
                  batteryLevel > 50 ? "[&>div]:bg-success" : batteryLevel > 20 ? "[&>div]:bg-warning" : "[&>div]:bg-destructive"
                )} 
              />
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Storage</span>
                </div>
                <span className="text-sm font-medium text-foreground">{device.storage}</span>
              </div>
              <Progress value={storageUsed} className="h-2" />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  fullWidth?: boolean;
}

const InfoItem = ({ icon: Icon, label, value, fullWidth }: InfoItemProps) => (
  <div className={cn("flex items-center gap-2", fullWidth && "col-span-2")}>
    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
    <span className="text-xs text-muted-foreground">{label}:</span>
    <span className="text-xs font-mono text-foreground truncate">{value}</span>
  </div>
);

export default DevicePanel;
