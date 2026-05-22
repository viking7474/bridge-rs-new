import { Activity, Cpu, HardDrive, Wifi } from "lucide-react";

interface StatusBarProps {
  deviceCount: number;
}

const StatusBar = ({ deviceCount }: StatusBarProps) => {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
      {/* Left Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/10">
            <Activity className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
            <p className="text-sm font-medium text-success">All Connected</p>
          </div>
        </div>

        <div className="h-8 w-px bg-border/50" />

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Wifi className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Latency</p>
            <p className="text-sm font-medium text-foreground">12ms avg</p>
          </div>
        </div>

        <div className="h-8 w-px bg-border/50" />

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
            <Cpu className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total FPS</p>
            <p className="text-sm font-medium text-foreground">{deviceCount * 60}</p>
          </div>
        </div>

        <div className="h-8 w-px bg-border/50" />

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/10">
            <HardDrive className="w-4 h-4 text-warning" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bandwidth</p>
            <p className="text-sm font-medium text-foreground">{deviceCount * 8} Mbps</p>
          </div>
        </div>
      </div>

      {/* Right Info */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="px-2 py-1 bg-muted/50 rounded-md font-mono">scrcpy v2.4</span>
        <span className="px-2 py-1 bg-muted/50 rounded-md font-mono">WebSocket</span>
      </div>
    </div>
  );
};

export default StatusBar;
