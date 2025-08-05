import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationTabs } from "@/components/navigation-tabs";
import { SetupScreen } from "@/components/setup-screen";
import { DailyScreen } from "@/components/daily-screen";
import { StatsScreen } from "@/components/stats-screen";
import { useAttendance } from "@/hooks/use-attendance";
import { useNotifications } from "@/hooks/use-notifications";

export default function Home() {
  const [activeTab, setActiveTab] = useState("setup");
  const {
    subjects,
    loading,
    addSubject,
    removeSubject,
    markAttendance,
    getTodaySubjects,
    getAttendanceForDate,
    getAttendanceStats,
    getOverallStats,
  } = useAttendance();
  
  const { settings, scheduleDailyReminder } = useNotifications();

  // Switch to daily tab if subjects exist and it's not first time setup
  useEffect(() => {
    if (!loading && subjects.length > 0 && !settings.firstTimeSetup) {
      setActiveTab("daily");
    }
  }, [loading, subjects.length, settings.firstTimeSetup]);

  // Schedule daily reminders when app loads
  useEffect(() => {
    if (settings.notificationsEnabled) {
      scheduleDailyReminder();
    }
  }, [settings.notificationsEnabled, scheduleDailyReminder]);

  const todaySubjects = getTodaySubjects();
  const attendanceStats = getAttendanceStats();
  const overallStats = getOverallStats();

  if (loading) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen shadow-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-lg relative">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-material">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">AttendanceTracker</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700 rounded-full p-2"
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      {activeTab === "setup" && (
        <SetupScreen
          subjects={subjects}
          onAddSubject={addSubject}
          onRemoveSubject={removeSubject}
        />
      )}

      {activeTab === "daily" && (
        <DailyScreen
          todaySubjects={todaySubjects}
          getAttendanceForDate={getAttendanceForDate}
          markAttendance={markAttendance}
          getAttendanceStats={getAttendanceStats}
        />
      )}

      {activeTab === "dashboard" && (
        <StatsScreen
          attendanceStats={attendanceStats}
          overallStats={overallStats}
        />
      )}
    </div>
  );
}
