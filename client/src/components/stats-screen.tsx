import { Download, Upload, AlertTriangle } from 'lucide-react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AttendanceStats, Subject, ImportData } from '@shared/schema';
import { cn } from '@/lib/utils';

interface StatsScreenProps {
  attendanceStats: AttendanceStats[];
  overallStats: {
    totalClasses: number;
    totalPresent: number;
    overallPercentage: number;
  };
  subjects: Subject[];
  darkMode?: boolean;
  onDataImport?: (data: ImportData) => void;
}

export function StatsScreen({
  attendanceStats,
  overallStats,
  subjects,
  darkMode,
  onDataImport,
}: StatsScreenProps) {
  const { toast } = useToast();
  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const lowAttendanceSubjects = attendanceStats.filter(
    (s) => s.attendancePercentage < 75
  );

  const handleExportData = () => {
    const subjectsWithMetadata = attendanceStats.map(stat => {
      const subject = subjects.find((s: Subject) => s.id === stat.subjectId);
      return {
        ...stat,
        schedule: subject?.schedule || [],
        color: subject?.color || "#8B5CF6"
      };
    });
    
    const data = {
      overallStats,
      subjects: subjectsWithMetadata,
      exportDate: new Date().toISOString(),
    };
    const fileName = `attendance-data-${new Date().toISOString().split('T')[0]}.json`;
    const fileContent = JSON.stringify(data, null, 2);

    if (Capacitor.isNativePlatform()) {
      Filesystem.writeFile({
        path: fileName,
        data: fileContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })
        .then(() => {
          alert('Attendance data exported to Documents folder!');
        })
        .catch((err) => {
          alert('Failed to export attendance data: ' + err.message);
        });
    } else {
      // Fallback for web
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className={`p-4 space-y-6 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Header */}
      <div className="text-center py-6">
        <h2
          className={`text-2xl font-medium mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Attendance Statistics
        </h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Your performance overview
        </p>
      </div>

      {/* Overall Stats */}
      <Card
        className={`shadow-material ${
          darkMode ? 'bg-gray-800 text-white' : ''
        }`}
      >
        <CardHeader>
          <CardTitle className={`text-lg ${darkMode ? 'text-white' : ''}`}>
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  darkMode ? 'text-purple-400' : 'text-primary'
                }`}
                data-testid="text-overall-percentage"
              >
                {overallStats.overallPercentage.toFixed(1)}%
              </div>
              <div
                className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Overall
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
                data-testid="text-total-classes"
              >
                {overallStats.totalClasses}
              </div>
              <div
                className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Total Classes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Warnings */}
      {lowAttendanceSubjects.length > 0 && (
        <Alert
          className={
            darkMode ? 'border-red-400 bg-red-950' : 'border-red-200 bg-red-50'
          }
        >
          <AlertTriangle
            className={`h-4 w-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}
               />
           <AlertDescription
             className={darkMode ? 'text-red-300' : 'text-red-800'}
           >
             <strong>Attendance Alert:</strong>{' '}
             {lowAttendanceSubjects.length === 1
               ? `${
                   lowAttendanceSubjects[0].subjectName
                 } (${lowAttendanceSubjects[0].attendancePercentage.toFixed(
                   1
                 )}%) is below 75% requirement`
               : `${lowAttendanceSubjects.length} subjects are below 75% requirement`}
           </AlertDescription>
         </Alert>
      )}

      {/* Subject Stats */}
      {attendanceStats.length === 0 ? (
        <Card
          className={`shadow-material ${
            darkMode ? 'bg-gray-800 text-white' : ''
          }`}
        >
          <CardContent className="p-8 text-center">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              No attendance data yet.
            </p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              Add subjects and start marking attendance to see statistics.
            </p>
          </CardContent>
        </Card>
      ) : (
        attendanceStats.map((stats) => (
          <Card
            key={stats.subjectId}
            className={`shadow-material ${
              darkMode ? 'bg-gray-800 text-white' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-medium ${
                    darkMode ? 'text-white' : ''
                  }`}
                  data-testid={`text-subject-${stats.subjectId}`}
                >
                  {stats.subjectName}
                </h3>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    getAttendanceColor(stats.attendancePercentage)
                  )}
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
                  <span
                    className={darkMode ? 'text-gray-400' : 'text-gray-600'}
                  >
                    Present:{' '}
                  </span>
                  <span
                    className="font-medium"
                    data-testid={`text-present-${stats.subjectId}`}
                  >
                    {stats.presentClasses}
                  </span>
                </div>
                <div>
                  <span
                    className={darkMode ? 'text-gray-400' : 'text-gray-600'}
                  >
                    Total:{' '}
                  </span>
                  <span
                    className="font-medium"
                    data-testid={`text-total-${stats.subjectId}`}
                  >
                    {stats.totalClasses}
                  </span>
                </div>
              </div>
              {stats.attendancePercentage < 75 && (
                <div
                  className={`mt-4 rounded-lg p-3 ${
                    darkMode
                      ? 'bg-yellow-950 border border-yellow-900'
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      darkMode ? 'text-yellow-300' : 'text-yellow-800'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Below 75% requirement
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Import/Export Buttons */}
      <div className="space-y-2">
        {attendanceStats.length > 0 && (
          <Button
            onClick={handleExportData}
            className={`w-full py-4 shadow-material ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-secondary hover:bg-cyan-500 text-gray-900'
            }`}
            data-testid="button-export-data"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Attendance Data
          </Button>
        )}
        
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
            id="import-file"
          />
          <Button
            onClick={() => document.getElementById('import-file')?.click()}
            className={`w-full py-4 shadow-material ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-secondary hover:bg-cyan-500 text-gray-900'
            }`}
            data-testid="button-import-data"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Attendance Data
          </Button>
        </div>
      </div>
    </div>
  );

  async function handleImportData(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // For web platform (we'll handle native platform differently if needed)
      const fileContent = await file.text();
      const importedData = JSON.parse(fileContent) as ImportData;
      onDataImport?.(importedData);

      toast({
        title: "Success",
        description: "Attendance data imported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import attendance data. Please check the file format.",
        variant: "destructive",
      });
      console.error('Import error:', error);
    }

    // Reset the file input
    event.target.value = '';
  }
}
