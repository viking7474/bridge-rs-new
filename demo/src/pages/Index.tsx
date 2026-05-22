import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DeviceTable from "@/components/DeviceTable";
import DevicePanel from "@/components/DevicePanel";
import ScreenViewer from "@/components/ScreenViewer/index";
import { Device } from "@/components/DeviceRow";

const generateMockDevices = (): Device[] => {
  const models = [
    { model: "Pixel 6 Pro", brand: "Google" },
    { model: "Pixel 7", brand: "Google" },
    { model: "Pixel 8 Pro", brand: "Google" },
    { model: "Galaxy S23", brand: "Samsung" },
    { model: "Galaxy S24 Ultra", brand: "Samsung" },
    { model: "Galaxy A54", brand: "Samsung" },
    { model: "Galaxy Z Fold5", brand: "Samsung" },
    { model: "OnePlus 12", brand: "OnePlus" },
    { model: "OnePlus Nord 3", brand: "OnePlus" },
    { model: "Xiaomi 14 Pro", brand: "Xiaomi" },
    { model: "Redmi Note 13", brand: "Xiaomi" },
    { model: "POCO F5", brand: "Xiaomi" },
    { model: "Oppo Find X6", brand: "Oppo" },
    { model: "Realme GT5", brand: "Realme" },
    { model: "Vivo X100", brand: "Vivo" },
  ];

  const androidVersions = ["Android 11", "Android 12", "Android 13", "Android 14", "Android 15"];
  const statuses: ("online" | "offline" | "unauthorized")[] = ["online", "offline", "unauthorized"];
  const tags = ["daily", "test", "farm", "client", "dev", "staging", "production"];
  const architectures = ["arm64-v8a", "armeabi-v7a", "x86_64"];

  const names = [
    "Daily Driver", "Farm Node", "Test Device", "Client Phone", "Dev Unit",
    "Staging Device", "QA Phone", "Debug Unit", "Release Test", "Beta Device",
    "Alpha Unit", "Main Phone", "Backup Device", "Secondary", "Primary",
    "Work Phone", "Personal", "Demo Unit", "Showcase", "Presentation"
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const modelData = models[i % models.length];
    const status = statuses[Math.floor(Math.random() * 3)];
    const lastSeenOptions = ["Just now", "1m ago", "2m ago", "5m ago", "10m ago", "1h ago", "2h ago"];
    
    return {
      id: String(i + 1),
      name: `${names[i % names.length]} #${i + 1}`,
      model: modelData.model,
      brand: modelData.brand,
      androidVersion: androidVersions[i % androidVersions.length],
      status,
      lastSeen: status === "online" ? "Just now" : lastSeenOptions[Math.floor(Math.random() * lastSeenOptions.length)],
      tags: [tags[i % tags.length], tags[(i + 3) % tags.length]],
      ip: `192.168.1.${100 + i}`,
      serial: `DEV-SN-${String(i + 1).padStart(3, "0")}`,
      architecture: architectures[i % architectures.length],
      battery: Math.floor(Math.random() * 80) + 20,
      storage: `${Math.floor(Math.random() * 100) + 10} GB`,
    };
  });
};

const mockDevices: Device[] = generateMockDevices();

const Index = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>("1");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredDevices = useMemo(() => {
    if (statusFilter === "all") return mockDevices;
    return mockDevices.filter((d) => d.status === statusFilter);
  }, [statusFilter]);

  const selectedDevice = mockDevices.find((d) => d.id === selectedDeviceId) || null;

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar - Icon only */}
      <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {activeMenuItem === "screen" ? (
            <ScreenViewer devices={filteredDevices} />
          ) : (
            <>
              {/* Device Table - Main content */}
              <DeviceTable
                devices={filteredDevices}
                selectedDeviceId={selectedDeviceId}
                onDeviceSelect={setSelectedDeviceId}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />

              {/* Device Panel - Right sidebar */}
              <DevicePanel device={selectedDevice} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
