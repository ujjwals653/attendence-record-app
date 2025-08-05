import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AttendanceToggle } from "./attendance-toggle";
import { Subject } from "@shared/schema";
import { formatDisplayDate, getCurrentDateString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface DailyScreenProps {
  todaySubjects: Subject[];
  getAttendanceForDate: (subjectId: string, date: string) => boolean | undefined;
  markAttendance: (subjectId: string, present: boolean, date?: string) => void;
  getAttendanceStats: () => Array<{
    subjectId: string;
    subjectName: string;
    totalClasses: number;
    presentClasses: number;
    attendancePercentage: number;
  }>;
}

export function DailyScreen({ 
  todaySubjects, 
  getAttendanceForDate, 
  markAttendance, 
  getAttendanceStats 
}: DailyScreenProps) {
  const today = getCurrentDateString();
  const stats = getAttendanceStats();

  const getSubjectStats = (subjectId: string) => {
    return stats.find(s => s.subjectId === subjectId);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleSaveAttendance = () => {
    // All attendance is saved automatically when toggled
    // This button could show a confirmation or sync data if needed
    console.log("Attendance saved for", today);
  };

  if (todaySubjects.length === 0) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Today's Classes</h2>
          <p className="text-gray-600">{formatDisplayDate(today)}</p>
        </div>
        <Card className="shadow-material">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No classes scheduled for today!</p>
            <p className="text-sm text-gray-500 mt-2">Enjoy your free day!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Today's Classes</h2>
        <p className="text-gray-600">{formatDisplayDate(today)}</p>
      </div>

      {/* Today's Subjects */}
      {todaySubjects.map((subject) => {
        const isPresent = getAttendanceForDate(subject.id, today);
        const subjectStats = getSubjectStats(subject.id);
        const attendancePercentage = subjectStats?.attendancePercentage || 0;

        return (
          <Card key={subject.id} className="shadow-material">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium" data-testid={`text-subject-${subject.id}`}>
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-600">Were you present today?</p>
                </div>
                <AttendanceToggle
                  present={isPresent || false}
                  onToggle={(present) => markAttendance(subject.id, present, today)}
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span>Current Attendance</span>
                  <span 
                    className={cn("font-medium", getAttendanceColor(attendancePercentage))}
                    data-testid={`text-percentage-${subject.id}`}
                  >
                    {attendancePercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Save Button */}
      <Button
        onClick={handleSaveAttendance}
        className="w-full bg-primary hover:bg-blue-700 text-white py-4 shadow-material sticky bottom-4"
        data-testid="button-save-attendance"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Today's Attendance
      </Button>
    </div>
  );
}
