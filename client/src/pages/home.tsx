import { useState, useEffect } from 'react';
import { Settings, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationTabs } from '@/components/navigation-tabs';
import { SetupScreen } from '@/components/setup-screen';
import { DailyScreen } from '@/components/daily-screen';
import { StatsScreen } from '@/components/stats-screen';
import { useAttendance } from '@/hooks/use-attendance';
import { useNotifications } from '@/hooks/use-notifications';

export default function Home() {
  const [activeTab, setActiveTab] = useState('setup');
  const [isRotated, setIsRotated] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const {
    subjects,
    loading,
    addSubject,
    removeSubject,
    editSubject,
    markAttendance,
    removeAttendance,
    getTodaySubjects,
    getAttendanceForDate,
    getAttendanceForSubjectAndDate,
    getAttendanceStats,
    getOverallStats,
    importData
  } = useAttendance();
  
  const { settings, scheduleDailyReminder } = useNotifications();

  // Switch to daily tab if subjects exist and it's not first time setup
  useEffect(() => {
    if (!loading && subjects.length > 0 && !settings.firstTimeSetup) {
      setActiveTab('daily');
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
      <div className="max-w-[430px] mx-auto bg-white min-h-screen h-screen shadow-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-[430px] mx-auto min-h-screen h-screen shadow-lg relative ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Header */}
      <header
        className={`bg-gradient-to-r from-purple-600 to-purple-700 p-4 shadow-material ${
          darkMode ? 'text-white' : 'text-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-7 h-7 text-white" />
            <h1 className="text-xl font-medium">AttendanceTracker</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`hover:bg-purple-800 rounded-full p-2 ${
              darkMode ? 'text-white' : 'text-white'
            }`}
            data-testid="button-settings"
            onClick={() => {
              setIsRotated((r) => !r);
              setDarkMode((dm) => {
                localStorage.setItem('darkMode', (!dm).toString());
                return !dm;
              });
            }}
          >
            <Settings
              className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                isRotated ? 'rotate-90' : ''
              }`}
            />
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
      />

      {/* Content */}
      {activeTab === 'setup' && (
        <SetupScreen
          subjects={subjects}
          onAddSubject={addSubject}
          onRemoveSubject={removeSubject}
          onEditSubject={editSubject}
          darkMode={darkMode}
        />
      )}

      {activeTab === 'daily' && (
        <DailyScreen
          subjects={subjects}
          getAttendanceForSubjectAndDate={getAttendanceForSubjectAndDate}
          markAttendance={markAttendance}
          removeAttendance={removeAttendance}
          darkMode={darkMode}
        />
      )}

      {activeTab === 'dashboard' && (
        <StatsScreen
          attendanceStats={attendanceStats}
          overallStats={overallStats}
          subjects={subjects}
          darkMode={darkMode}
          onDataImport={importData}
        />
      )}
    </div>
  );
}
