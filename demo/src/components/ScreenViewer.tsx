import { Monitor, Maximize2, Minimize2, RotateCcw, Camera, Video, Pause, LayoutGrid, Square, ZoomIn, ZoomOut, Move, Home, MousePointer, Hand } from "lucide-react";
import { Device } from "./DeviceCard";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";

interface ScreenViewerProps {
  devices: Device[];
}

type ViewMode = "single" | "grid";
type GridSize = 2 | 4 | 6;
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

const DeviceScreen = ({ 
  device, 
  isCompact = false,
  isSelected = false,
  onSelect
}: { 
  device: Device; 
  isCompact?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) => {
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
    
    // Remove touch point after animation
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
        // It's a tap
        addTouchPoint(swipeGesture.startX, swipeGesture.startY, "tap");
        setLastAction(`Tap at (${Math.round(swipeGesture.startX)}%, ${Math.round(swipeGesture.startY)}%)`);
      } else {
        // It's a swipe
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
        "flex flex-col gap-2 p-3 bg-card rounded-xl border transition-all duration-200",
        isSelected ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border hover:border-primary/50",
        isCompact ? "h-full" : ""
      )}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className={cn("font-medium text-foreground truncate", isCompact ? "text-xs" : "text-sm")}>
            {device.name}
          </span>
          {zoom !== 1 && (
            <span className="text-xs text-primary font-medium">
              {Math.round(zoom * 100)}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Zoom Controls */}
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0", isCompact ? "h-5 w-5" : "h-6 w-6")}
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className={cn(isCompact ? "w-2.5 h-2.5" : "w-3 h-3")} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0", isCompact ? "h-5 w-5" : "h-6 w-6")}
            onClick={handleZoomIn}
            disabled={zoom >= 3}
          >
            <ZoomIn className={cn(isCompact ? "w-2.5 h-2.5" : "w-3 h-3")} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0", isCompact ? "h-5 w-5" : "h-6 w-6")}
            onClick={handleReset}
          >
            <Home className={cn(isCompact ? "w-2.5 h-2.5" : "w-3 h-3")} />
          </Button>
          
          {!isCompact && (
            <>
              <div className="w-px h-4 bg-border mx-1" />
              {/* Interaction Mode Toggle */}
              <Button
                variant={interactionMode === "touch" ? "secondary" : "ghost"}
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setInteractionMode("touch");
                }}
                title="Touch Mode"
              >
                <MousePointer className="w-3 h-3" />
              </Button>
              <Button
                variant={interactionMode === "pan" ? "secondary" : "ghost"}
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setInteractionMode("pan");
                }}
                title="Pan Mode"
              >
                <Hand className="w-3 h-3" />
              </Button>
              <div className="w-px h-4 bg-border mx-1" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <RotateCcw className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Camera className="w-3 h-3" />
              </Button>
              <Button
                variant={isRecording ? "destructive" : "ghost"}
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRecording(!isRecording);
                }}
              >
                {isRecording ? <Pause className="w-3 h-3" /> : <Video className="w-3 h-3" />}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Screen */}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 flex items-center justify-center bg-black/90 rounded-lg overflow-hidden relative",
          isCompact ? "min-h-[180px]" : "min-h-[300px]",
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
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 bg-black/60 rounded text-[10px] text-white/70">
            <Move className="w-3 h-3" />
            Drag to pan
          </div>
        )}
        {interactionMode === "touch" && !isCompact && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 bg-black/60 rounded text-[10px] text-white/70">
            <MousePointer className="w-3 h-3" />
            Click to tap, drag to swipe
          </div>
        )}

        {/* Touch points visualization */}
        {touchPoints.map((point) => (
          <div
            key={point.id}
            className={cn(
              "absolute z-20 rounded-full pointer-events-none",
              point.type === "tap" 
                ? "w-8 h-8 bg-primary/50 animate-ping" 
                : "w-6 h-6 bg-accent/50 animate-pulse"
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
              strokeDasharray="5,5"
            />
            <circle
              cx={`${swipeGesture.startX}%`}
              cy={`${swipeGesture.startY}%`}
              r="6"
              fill="hsl(var(--primary))"
            />
          </svg>
        )}
        
        <div 
          ref={screenRef}
          className={cn(
            "relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700 shadow-xl overflow-hidden transition-transform duration-150",
            isCompact ? "w-[100px] h-[200px] rounded-[1rem]" : "w-[140px] h-[280px] rounded-[1.5rem]"
          )}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          }}
        >
          {/* Notch */}
          <div className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 bg-slate-800 rounded-b-lg",
            isCompact ? "w-12 h-3" : "w-16 h-4"
          )} />
          
          {/* Screen Content */}
          <div className="w-full h-full pt-4 pb-2 px-0.5">
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-lg flex flex-col items-center justify-center gap-2 p-2">
              {/* Status Bar */}
              <div className={cn(
                "absolute left-2 right-2 flex justify-between text-white/80",
                isCompact ? "top-4 text-[6px]" : "top-5 text-[8px]"
              )}>
                <span>12:34</span>
                <span>🔋 {device.battery}%</span>
              </div>

              {/* Content */}
              <div className="flex flex-col items-center gap-1 text-white">
                <Monitor className={cn("opacity-50", isCompact ? "w-6 h-6" : "w-8 h-8")} />
                <p className={cn("font-medium", isCompact ? "text-[8px]" : "text-[10px]")}>Live</p>
              </div>

              {/* App Grid */}
              <div className={cn(
                "grid gap-1 mt-auto",
                isCompact ? "grid-cols-3" : "grid-cols-4"
              )}>
                {Array.from({ length: isCompact ? 6 : 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-md bg-white/20 backdrop-blur-sm",
                      isCompact ? "w-5 h-5" : "w-6 h-6"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className={cn(
            "absolute bottom-1 left-1/2 -translate-x-1/2 bg-white/30 rounded-full",
            isCompact ? "w-10 h-0.5" : "w-12 h-1"
          )} />
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        "flex items-center justify-between text-muted-foreground",
        isCompact ? "text-[10px]" : "text-xs"
      )}>
        <div className="flex items-center gap-2">
          <span>{device.model}</span>
          {lastAction && !isCompact && (
            <span className="text-primary font-medium">{lastAction}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {zoom !== 1 && (
            <span className="text-primary">{Math.round(zoom * 100)}%</span>
          )}
          <span>12ms</span>
        </div>
      </div>
    </div>
  );
};


const ScreenViewer = ({ devices }: ScreenViewerProps) => {
  const onlineDevices = devices.filter((d) => d.status === "online");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(
    onlineDevices[0]?.id || null
  );

  const selectedDeviceData = devices.find((d) => d.id === selectedDevice);

  const getGridClass = () => {
    switch (gridSize) {
      case 2: return "grid-cols-2";
      case 4: return "grid-cols-2 lg:grid-cols-4";
      case 6: return "grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
      default: return "grid-cols-2";
    }
  };

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Screen Viewer</h2>
            <p className="text-sm text-muted-foreground">
              View and control connected device screens via scrcpy
            </p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {onlineDevices.length} device(s) online
          </span>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            <Button
              variant={viewMode === "single" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode("single")}
            >
              <Square className="w-4 h-4 mr-1" />
              Single
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Grid
            </Button>
          </div>

          {/* Grid Size */}
          {viewMode === "grid" && (
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
              {([2, 4, 6] as GridSize[]).map((size) => (
                <Button
                  key={size}
                  variant={gridSize === size ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setGridSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        {onlineDevices.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Monitor className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">No online devices available</p>
            </div>
          </div>
        ) : viewMode === "single" ? (
          <div className="h-full flex gap-6">
            {/* Device List */}
            <div className="w-64 flex flex-col gap-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Available Devices
              </h3>
              <div className="flex flex-col gap-2">
                {onlineDevices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left",
                      selectedDevice === device.id
                        ? "bg-primary/10 border-primary/30 shadow-sm"
                        : "bg-card border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Monitor className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {device.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{device.model}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  </button>
                ))}
              </div>

              {/* Connection Info */}
              <div className="mt-auto p-4 bg-muted/30 rounded-lg border border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Connection Info
                </h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Protocol: scrcpy v2.4</p>
                  <p>Bitrate: 8 Mbps</p>
                  <p>Max FPS: 60</p>
                </div>
              </div>
            </div>

            {/* Single Screen */}
            <div className="flex-1">
              {selectedDeviceData && (
                <DeviceScreen device={selectedDeviceData} isSelected />
              )}
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className={cn("grid gap-4 h-full auto-rows-fr", getGridClass())}>
            {onlineDevices.slice(0, gridSize).map((device) => (
              <DeviceScreen
                key={device.id}
                device={device}
                isCompact
                isSelected={selectedDevice === device.id}
                onSelect={() => setSelectedDevice(device.id)}
              />
            ))}
            {/* Empty slots */}
            {onlineDevices.length < gridSize &&
              Array.from({ length: gridSize - onlineDevices.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border"
                >
                  <div className="text-center text-muted-foreground/50">
                    <Monitor className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs">No device</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Bottom Status */}
      <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">All systems connected</span>
          </span>
          <span className="text-muted-foreground">
            Avg Latency: <span className="text-foreground">12ms</span>
          </span>
          <span className="text-muted-foreground">
            Total FPS: <span className="text-foreground">{onlineDevices.length * 60}</span>
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          scrcpy v2.4 | Protocol: WebSocket
        </span>
      </div>
    </div>
  );
};

export default ScreenViewer;
