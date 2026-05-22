import { LayoutDashboard, Monitor, FileText, Info, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const menuItems = [
  { id: "dashboard", icon: RefreshCw },
  { id: "logs", icon: FileText },
  { id: "screen", icon: Monitor },
];

const Sidebar = ({ activeItem, onItemClick }: SidebarProps) => {
  return (
    <aside className="w-14 bg-card border-r border-border flex flex-col h-full">
      {/* Navigation - Icon only */}
      <nav className="flex-1 py-4 flex flex-col items-center gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              onClick={() => onItemClick(item.id)}
              className={cn(
                "w-10 h-10",
                isActive && "bg-secondary"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive ? "text-foreground" : "text-muted-foreground"
              )} />
            </Button>
          );
        })}
      </nav>

      {/* Bottom icons */}
      <div className="py-4 flex flex-col items-center gap-1 border-t border-border">
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <FileText className="w-5 h-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Info className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Version */}
      <div className="py-2 text-center">
        <span className="text-[10px] text-muted-foreground">1.0.4</span>
      </div>
    </aside>
  );
};

export default Sidebar;
