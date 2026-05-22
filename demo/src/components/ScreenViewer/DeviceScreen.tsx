import { Monitor, ZoomIn, ZoomOut, Home, MousePointer, Hand, RotateCcw, Camera, Video, Pause, Move } from "lucide-react";
import { Device } from "../DeviceCard";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";
import { Button } from "../ui/button";

type InteractionMode = "touch" | "pan";

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  type: "tap" | "swipe";
  timestamp: number;
}

interface SwipeGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  active: boolean;
}

interface DeviceScreenProps {
  device: Device;
  isCompact?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const DeviceScreen = ({ 
  device, 
  isCompact = false,
  isSelected = false,
  onSelect
}: DeviceScreenProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [interactionMode, setInteractionMode] = useState<InteractionMode>("touch");
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [swipeGesture, setSwipeGesture] = useState<SwipeGesture | null>(null);
  const [lastAction, setLastAction] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef(0);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getRelativePosition = useCallback((e: React.MouseEvent) => {
    if (!screenRef.current) return { x: 0, y: 0 };
    const rect = screenRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  }, []);

  const addTouchPoint = useCallback((x: number, y: number, type: "tap" | "swipe") => {
    const id = touchIdRef.current++;
    const newPoint: TouchPoint = { id, x, y, type, timestamp: Date.now() };
    setTouchPoints(prev => [...prev, newPoint]);
    
    setTimeout(() => {
      setTouchPoints(prev => prev.filter(p => p.id !== id));
    }, 500);
    
    return newPoint;
  }, []);

  const handleScreenMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (interactionMode === "pan" && zoom > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (interactionMode === "touch") {
      const pos = getRelativePosition(e);
      setSwipeGesture({
        startX: pos.x,
        startY: pos.y,
        endX: pos.x,
        endY: pos.y,
        active: true
      });
    }
  }, [interactionMode, zoom, pan, getRelativePosition]);

  const handleScreenMouseMove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (interactionMode === "pan" && isPanning && zoom > 1) {
      const maxPan = (zoom - 1) * 100;
      const newX = Math.max(-maxPan, Math.min(maxPan, e.clientX - panStart.x));
      const newY = Math.max(-maxPan, Math.min(maxPan, e.clientY - panStart.y));
      setPan({ x: newX, y: newY });
    } else if (interactionMode === "touch" && swipeGesture?.active) {
      const pos = getRelativePosition(e);
      setSwipeGesture(prev => prev ? { ...prev, endX: pos.x, endY: pos.y } : null);
    }
  }, [interactionMode, isPanning, zoom, panStart, swipeGesture, getRelativePosition]);

  const handleScreenMouseUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (interactionMode === "pan") {
      setIsPanning(false);
    } else if (interactionMode === "touch" && swipeGesture?.active) {
      const deltaX = swipeGesture.endX - swipeGesture.startX;
      const deltaY = swipeGesture.endY - swipeGesture.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < 5) {
        addTouchPoint(swipeGesture.startX, swipeGesture.startY, "tap");
        setLastAction(`Tap at (${Math.round(swipeGesture.startX)}%, ${Math.round(swipeGesture.startY)}%)`);
      } else {
        let direction = "";
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? "Right" : "Left";
        } else {
          direction = deltaY > 0 ? "Down" : "Up";
        }
        addTouchPoint(swipeGesture.endX, swipeGesture.endY, "swipe");
        setLastAction(`Swipe ${direction}`);
      }
      
      setSwipeGesture(null);
    }
  }, [interactionMode, swipeGesture, addTouchPoint]);

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
    setSwipeGesture(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
    }
  }, []);

  return (
    <div 
      className={cn(
        "group flex flex-col bg-card/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden",
        isSelected 
          ? "border-primary/50 shadow-xl shadow-primary/10 ring-1 ring-primary/20" 
          : "border-border/50 hover:border-primary/30 hover:shadow-lg",
        isCompact ? "p-3" : "p-4"
      )}
      onClick={onSelect}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between",
        isCompact ? "mb-2" : "mb-3"
      )}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn(
            "flex items-center justify-center rounded-lg bg-gradient-to-br from-success/20 to-success/5",
            isCompact ? "w-6 h-6" : "w-8 h-8"
          )}>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className={cn(
              "font-semibold text-foreground truncate leading-tight",
              isCompact ? "text-xs" : "text-sm"
            )}>
              {device.name}
            </p>
            {!isCompact && (
              <p className="text-[10px] text-muted-foreground truncate">
                {device.model}
              </p>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className={cn(
          "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
          isSelected && "opacity-100"
        )}>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0 hover:bg-muted/80", isCompact ? "h-6 w-6" : "h-7 w-7")}
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className={cn(isCompact ? "w-3 h-3" : "w-3.5 h-3.5")} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0 hover:bg-muted/80", isCompact ? "h-6 w-6" : "h-7 w-7")}
            onClick={handleZoomIn}
            disabled={zoom >= 3}
          >
            <ZoomIn className={cn(isCompact ? "w-3 h-3" : "w-3.5 h-3.5")} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0 hover:bg-muted/80", isCompact ? "h-6 w-6" : "h-7 w-7")}
            onClick={handleReset}
          >
            <Home className={cn(isCompact ? "w-3 h-3" : "w-3.5 h-3.5")} />
          </Button>
          
          {!isCompact && (
            <>
              <div className="w-px h-4 bg-border mx-1.5" />
              <Button
                variant={interactionMode === "touch" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setInteractionMode("touch");
                }}
                title="Touch Mode"
              >
                <MousePointer className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant={interactionMode === "pan" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setInteractionMode("pan");
                }}
                title="Pan Mode"
              >
                <Hand className="w-3.5 h-3.5" />
              </Button>
              <div className="w-px h-4 bg-border mx-1.5" />
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Camera className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant={isRecording ? "destructive" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRecording(!isRecording);
                }}
              >
                {isRecording ? <Pause className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Screen Container */}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 flex items-center justify-center rounded-xl overflow-hidden relative",
          "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950",
          isCompact ? "min-h-[200px]" : "min-h-[350px]",
          interactionMode === "pan" && zoom > 1 ? "cursor-grab" : "",
          interactionMode === "touch" ? "cursor-crosshair" : "",
          isPanning && "cursor-grabbing"
        )}
        onMouseDown={handleScreenMouseDown}
        onMouseMove={handleScreenMouseMove}
        onMouseUp={handleScreenMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        {/* Mode indicator */}
        {interactionMode === "pan" && zoom > 1 && !isPanning && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-[10px] text-white/80 font-medium">
            <Move className="w-3 h-3" />
            Drag to pan
          </div>
        )}
        {interactionMode === "touch" && !isCompact && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-[10px] text-white/80 font-medium">
            <MousePointer className="w-3 h-3" />
            Touch mode
          </div>
        )}

        {/* Zoom indicator */}
        {zoom !== 1 && (
          <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-md text-[10px] text-primary-foreground font-semibold">
            {Math.round(zoom * 100)}%
          </div>
        )}

        {/* Touch points visualization */}
        {touchPoints.map((point) => (
          <div
            key={point.id}
            className={cn(
              "absolute z-20 rounded-full pointer-events-none",
              point.type === "tap" 
                ? "w-10 h-10 bg-primary/40 animate-ping" 
                : "w-8 h-8 bg-accent/40 animate-pulse"
            )}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: "translate(-50%, -50%)"
            }}
          />
        ))}

        {/* Swipe gesture line */}
        {swipeGesture?.active && (
          <svg className="absolute inset-0 z-20 pointer-events-none w-full h-full">
            <line
              x1={`${swipeGesture.startX}%`}
              y1={`${swipeGesture.startY}%`}
              x2={`${swipeGesture.endX}%`}
              y2={`${swipeGesture.endY}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="6,4"
              className="drop-shadow-lg"
            />
            <circle
              cx={`${swipeGesture.startX}%`}
              cy={`${swipeGesture.startY}%`}
              r="8"
              fill="hsl(var(--primary))"
              className="drop-shadow-lg"
            />
          </svg>
        )}
        
        {/* Phone Frame */}
        <div 
          ref={screenRef}
          className={cn(
            "relative bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl overflow-hidden transition-transform duration-200",
            isCompact 
              ? "w-[90px] h-[180px] rounded-[14px] border-[3px] border-slate-700" 
              : "w-[160px] h-[320px] rounded-[24px] border-4 border-slate-700"
          )}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          }}
        >
          {/* Dynamic Island / Notch */}
          <div className={cn(
            "absolute top-1.5 left-1/2 -translate-x-1/2 bg-black rounded-full z-10",
            isCompact ? "w-10 h-2.5" : "w-16 h-4"
          )} />
          
          {/* Screen Content */}
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 flex flex-col">
              {/* Status Bar */}
              <div className={cn(
                "flex justify-between items-center px-3 text-white/90 font-medium",
                isCompact ? "h-5 text-[6px]" : "h-8 text-[9px]"
              )}>
                <span>12:34</span>
                <div className="flex items-center gap-1">
                  <span>📶</span>
                  <span>🔋 {device.battery}%</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-3">
                <div className={cn(
                  "rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2",
                  isCompact ? "w-10 h-10" : "w-16 h-16"
                )}>
                  <Monitor className={cn("text-white/80", isCompact ? "w-5 h-5" : "w-8 h-8")} />
                </div>
                <p className={cn("text-white font-semibold", isCompact ? "text-[8px]" : "text-xs")}>
                  Live Screen
                </p>
                <p className={cn("text-white/60", isCompact ? "text-[6px]" : "text-[9px]")}>
                  Connected
                </p>
              </div>

              {/* App Dock */}
              <div className={cn(
                "mx-2 mb-2 p-1.5 bg-white/10 backdrop-blur-md rounded-xl",
                isCompact ? "mx-1.5 mb-1.5 p-1" : ""
              )}>
                <div className={cn(
                  "grid gap-1",
                  isCompact ? "grid-cols-4" : "grid-cols-4"
                )}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-lg bg-white/20 backdrop-blur-sm",
                        isCompact ? "w-4 h-4" : "w-8 h-8"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Home Indicator */}
              <div className={cn(
                "mx-auto mb-1 bg-white/40 rounded-full",
                isCompact ? "w-8 h-0.5" : "w-16 h-1"
              )} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        "flex items-center justify-between mt-2 pt-2 border-t border-border/30",
        isCompact ? "text-[9px]" : "text-xs"
      )}>
        <div className="flex items-center gap-2 text-muted-foreground">
          {isCompact ? (
            <span>{device.model}</span>
          ) : (
            <>
              <span className="font-medium">{device.androidVersion}</span>
              {lastAction && (
                <>
                  <span className="text-border">•</span>
                  <span className="text-primary font-medium">{lastAction}</span>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            12ms
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeviceScreen;
