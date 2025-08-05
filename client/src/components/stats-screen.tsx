import { Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AttendanceStats } from "@shared/schema";
import { cn } from "@/lib/utils";

interface StatsScreenProps {
  attendanceStats: AttendanceStats[];
  overallStats: {
    totalClasses: number;
    totalPresent: number;
    overallPercentage: number;
  };
}

export function StatsScreen({ attendanceStats, overallStats }: StatsScreenProps) {
  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const lowAttendanceSubjects = attendanceStats.filter(s => s.attendancePercentage < 75);

  const handleExportData = () => {
    const data = {
      overallStats,
      subjects: attendanceStats,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          Attendance Statistics
        </h2>
        <p className="text-gray-600">Your performance overview</p>
      </div>

      {/* Overall Stats */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="text-lg">Overall Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div 
                className="text-2xl font-bold text-primary"
                data-testid="text-overall-percentage"
              >
                {overallStats.overallPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Overall</div>
            </div>
            <div className="text-center">
              <div 
                className="text-2xl font-bold text-gray-900"
                data-testid="text-total-classes"
              >
                {overallStats.totalClasses}
              </div>
              <div className="text-sm text-gray-600">Total Classes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Warnings */}
      {lowAttendanceSubjects.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Attendance Alert:</strong>{" "}
            {lowAttendanceSubjects.length === 1 
              ? `${lowAttendanceSubjects[0].subjectName} (${lowAttendanceSubjects[0].attendancePercentage.toFixed(1)}%) is below 75% requirement`
              : `${lowAttendanceSubjects.length} subjects are below 75% requirement`
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Subject Stats */}
      {attendanceStats.length === 0 ? (
        <Card className="shadow-material">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No attendance data yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Add subjects and start marking attendance to see statistics.
            </p>
          </CardContent>
        </Card>
      ) : (
        attendanceStats.map((stats) => (
          <Card key={stats.subjectId} className="shadow-material">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium" data-testid={`text-subject-${stats.subjectId}`}>
                  {stats.subjectName}
                </h3>
                <span 
                  className={cn("text-2xl font-bold", getAttendanceColor(stats.attendancePercentage))}
                  data-testid={`text-percentage-${stats.subjectId}`}
                >
                  {stats.attendancePercentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="mb-4">
                <Progress 
                  value={stats.attendancePercentage} 
                  className="h-2"
                  data-testid={`progress-${stats.subjectId}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Present: </span>
                  <span className="font-medium" data-testid={`text-present-${stats.subjectId}`}>
                    {stats.presentClasses}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total: </span>
                  <span className="font-medium" data-testid={`text-total-${stats.subjectId}`}>
                    {stats.totalClasses}
                  </span>
                </div>
              </div>

              {stats.attendancePercentage < 75 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center text-yellow-800">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Below 75% requirement</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Export Button */}
      {attendanceStats.length > 0 && (
        <Button
          onClick={handleExportData}
          className="w-full bg-secondary hover:bg-cyan-500 text-gray-900 py-4 shadow-material"
          data-testid="button-export-data"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Attendance Data
        </Button>
      )}
    </div>
  );
}
