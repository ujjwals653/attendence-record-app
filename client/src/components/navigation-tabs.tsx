import { cn } from "@/lib/utils";
import { CalendarCheck, ChartBar, Plus } from "lucide-react";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs = [
    { id: "setup", label: "Setup", icon: Plus },
    { id: "daily", label: "Today", icon: CalendarCheck },
    { id: "dashboard", label: "Stats", icon: ChartBar },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 py-3 px-4 text-center border-b-2 font-medium transition-colors",
                isActive
                  ? "border-purple-500 text-purple-600 bg-purple-50"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
              data-testid={`tab-${tab.id}`}
            >
              <Icon className="w-4 h-4 mr-2 inline" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
