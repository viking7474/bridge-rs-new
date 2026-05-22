import { Search, Filter, RefreshCw, Bell, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left - Menu items */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-foreground">Folder</span>
        <span className="text-sm font-medium text-foreground">File</span>
        <span className="text-sm font-medium text-foreground">Toolbox</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Bell className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <User className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
