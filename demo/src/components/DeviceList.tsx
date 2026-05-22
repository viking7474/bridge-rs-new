import DeviceRow, { Device } from "./DeviceRow";

interface DeviceListProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onDeviceSelect: (deviceId: string) => void;
}

const DeviceList = ({ devices, selectedDeviceId, onDeviceSelect }: DeviceListProps) => {
  const onlineCount = devices.filter(d => d.status === "online").length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Table Header */}
      <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-4 text-xs font-medium text-muted-foreground">
        <span className="w-2" /> {/* Status dot space */}
        <span className="w-8" /> {/* Icon space */}
        <span className="min-w-[140px]">Device</span>
        <span className="min-w-[120px] hidden md:block">Model</span>
        <span className="min-w-[100px] hidden lg:block">OS</span>
        <span className="min-w-[120px] hidden xl:block">IP</span>
        <span className="min-w-[60px] hidden sm:block">Battery</span>
        <span className="min-w-[80px] hidden md:block">Last Seen</span>
        <span className="flex-1" />
        <span className="w-[180px] text-right">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {onlineCount}/{devices.length} online
          </span>
        </span>
      </div>

      {/* Device Rows */}
      <div className="flex-1 overflow-auto">
        {devices.map((device) => (
          <DeviceRow
            key={device.id}
            device={device}
            isSelected={selectedDeviceId === device.id}
            onClick={() => onDeviceSelect(device.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
