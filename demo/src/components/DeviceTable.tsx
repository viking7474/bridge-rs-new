import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, Filter, RefreshCw, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Device } from "./DeviceRow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DeviceTableProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onDeviceSelect: (deviceId: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const statusConfig = {
  online: { label: "Active", className: "text-success" },
  offline: { label: "Offline", className: "text-destructive" },
  unauthorized: { label: "Idle", className: "text-warning" },
};

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "online", label: "Active" },
  { value: "offline", label: "Offline" },
  { value: "unauthorized", label: "Idle" },
];

const DeviceTable = ({ devices, selectedDeviceId, onDeviceSelect, statusFilter, onStatusFilterChange }: DeviceTableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(devices.length / itemsPerPage);
  
  const paginatedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return devices.slice(startIndex, startIndex + itemsPerPage);
  }, [devices, currentPage, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, devices.length);

  const toggleRowSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    const currentIds = paginatedDevices.map(d => d.id);
    const allSelected = currentIds.every(id => selectedRows.includes(id));
    
    if (allSelected) {
      setSelectedRows(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedRows(prev => [...new Set([...prev, ...currentIds])]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const currentPageIds = paginatedDevices.map(d => d.id);
  const allCurrentSelected = currentPageIds.length > 0 && currentPageIds.every(id => selectedRows.includes(id));

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-card">
      {/* Table Header with Search */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
        <Checkbox 
          checked={allCurrentSelected}
          onCheckedChange={toggleAllSelection}
          className="mr-2"
        />
        <span className="w-8 text-xs font-medium text-muted-foreground">No</span>
        <span className="w-28 text-xs font-medium text-muted-foreground flex items-center gap-1">
          Serial Number
        </span>
        <span className="w-32 text-xs font-medium text-muted-foreground flex items-center gap-1">
          <ChevronDown className="w-3 h-3" />
          Device Name
          <ChevronDown className="w-3 h-3" />
        </span>
        <span className="w-40 text-xs font-medium text-muted-foreground">Email</span>
        <span className="w-20 text-xs font-medium text-muted-foreground">Status</span>
        
        {/* Search & Actions */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="h-7 w-32 pl-8 text-xs bg-background border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-7 w-28 text-xs">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-1.5">
                    {option.value !== "all" && (
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        option.value === "online" ? "bg-success" :
                        option.value === "offline" ? "bg-destructive" : "bg-warning"
                      )} />
                    )}
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {paginatedDevices.map((device, index) => {
          const status = statusConfig[device.status];
          const isSelected = selectedDeviceId === device.id;
          const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
          
          return (
            <div
              key={device.id}
              onClick={() => onDeviceSelect(device.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b border-border cursor-pointer transition-colors",
                isSelected ? "bg-primary/5" : "hover:bg-muted/50"
              )}
            >
              <Checkbox 
                checked={selectedRows.includes(device.id)}
                onClick={(e) => toggleRowSelection(device.id, e)}
                className="mr-2"
              />
              <span className="w-8 text-sm text-muted-foreground">{globalIndex}</span>
              <span className="w-28 text-sm font-mono text-muted-foreground">{device.serial || "-"}</span>
              <span className="w-32 text-sm text-foreground font-medium">{device.model}</span>
              <span className="w-40 text-sm text-muted-foreground">user{globalIndex}@example.com</span>
              <div className="w-20 flex items-center gap-1.5">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  device.status === "online" ? "bg-success" :
                  device.status === "offline" ? "bg-destructive" : "bg-warning"
                )} />
                <span className={cn("text-sm", status.className)}>{status.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Hiển thị</span>
          <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map(option => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>trên tổng {devices.length} thiết bị</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground mr-2">
            {startIndex}-{endIndex} / {devices.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "ghost"}
                size="icon"
                className="h-7 w-7 text-xs"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceTable;
