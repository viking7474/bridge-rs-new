import { Lightbulb, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const TipBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="h-10 bg-card border-t border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-warning" />
        <span className="text-sm text-muted-foreground">
          Tip: Use <code className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono">adb devices</code> to list connected devices
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default TipBar;
