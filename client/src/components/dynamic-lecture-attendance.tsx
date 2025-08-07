import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttendanceToggle } from './attendance-toggle';
import { AttendanceRecord } from '@shared/schema';
import { cn } from '@/lib/utils';

interface DynamicLectureAttendanceProps {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  defaultLecturesPerDay: number;
  date: string;
  existingRecords: AttendanceRecord[];
  onMarkAttendance: (
    subjectId: string,
    lectureNumber: number,
    present: boolean,
    date: string
  ) => void;
  onRemoveAttendance: (
    subjectId: string,
    lectureNumber: number,
    date: string
  ) => void;
  darkMode?: boolean;
}

export function DynamicLectureAttendance({
  subjectId,
  subjectName,
  subjectColor,
  defaultLecturesPerDay,
  date,
  existingRecords,
  onMarkAttendance,
  onRemoveAttendance,
  darkMode,
}: DynamicLectureAttendanceProps) {
  // Get the maximum lecture number from existing records or default
  const maxExistingLecture =
    existingRecords.length > 0
      ? Math.max(...existingRecords.map((r) => r.lectureNumber))
      : 0;

  const [lecturesForDay, setLecturesForDay] = useState(
    Math.max(defaultLecturesPerDay, maxExistingLecture)
  );

  const getLectureAttendance = (lectureNumber: number): boolean => {
    const record = existingRecords.find(
      (r) => r.lectureNumber === lectureNumber
    );
    return record?.present || false;
  };

  const getPresentCount = (): number => {
    if (lecturesForDay === 0) return 0;
    return existingRecords.filter(
      (r) => r.lectureNumber <= lecturesForDay && r.present
    ).length;
  };

  const getAttendanceColor = (presentCount: number, totalLectures: number) => {
    if (totalLectures === 0) return 'text-gray-500';
    const percentage = (presentCount / totalLectures) * 100;
    if (percentage === 100) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage > 0) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleLectureCountChange = (newCount: number) => {
    const clampedCount = Math.max(0, Math.min(10, newCount));
    setLecturesForDay(clampedCount);

    // Remove attendance records for lectures that no longer exist
    if (clampedCount < maxExistingLecture) {
      for (let i = clampedCount + 1; i <= maxExistingLecture; i++) {
        const hasRecord = existingRecords.some((r) => r.lectureNumber === i);
        if (hasRecord) {
          onRemoveAttendance(subjectId, i, date);
        }
      }
    }
  };

  const presentCount = getPresentCount();

  return (
    <div
      className={cn(
        'border-l-4 rounded-lg p-4 shadow-material',
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      )}
      style={{ borderLeftColor: subjectColor }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className={`text-lg font-medium ${darkMode ? 'text-white' : ''}`}
            data-testid={`text-subject-${subjectId}`}
          >
            {subjectName}
          </h3>
          <p
            className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {lecturesForDay === 0
              ? 'No lectures (cancelled)'
              : lecturesForDay === 1
              ? 'Single lecture'
              : `${lecturesForDay} lectures today`}
          </p>
        </div>
        <div className="text-right">
          <div
            className={cn(
              'text-lg font-bold',
              getAttendanceColor(presentCount, lecturesForDay)
            )}
            data-testid={`text-attendance-${subjectId}`}
          >
            {lecturesForDay === 0
              ? 'Cancelled'
              : `${presentCount}/${lecturesForDay}`}
          </div>
          <div
            className={`text-xs ${
              darkMode ? 'text-gray-500' : 'text-gray-500'
            }`}
          >
            {lecturesForDay === 0 ? 'No classes' : 'Present'}
          </div>
        </div>
      </div>

      {/* Lecture Count Control */}
      <div
        className={cn(
          'flex items-center justify-center space-x-3 mb-4 p-3 rounded-lg',
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        )}
      >
        <span
          className={`text-sm font-medium ${
            darkMode ? 'text-white' : 'text-gray-700'
          }`}
        >
          Lectures today:
        </span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLectureCountChange(lecturesForDay - 1)}
            disabled={lecturesForDay <= 0}
            className={cn(
              'h-8 w-8 p-0',
              darkMode
                ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                : ''
            )}
            data-testid={`button-decrease-lectures-${subjectId}`}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div
            className={cn(
              'w-12 h-8 flex items-center justify-center text-lg font-medium border rounded',
              darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white'
            )}
            data-testid={`text-lecture-count-${subjectId}`}
          >
            {lecturesForDay}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLectureCountChange(lecturesForDay + 1)}
            disabled={lecturesForDay >= 10}
            className={cn(
              'h-8 w-8 p-0',
              darkMode
                ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                : ''
            )}
            data-testid={`button-increase-lectures-${subjectId}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lecture Attendance Toggles */}
      {lecturesForDay === 0 ? (
        <div
          className={cn(
            'text-center py-6',
            darkMode ? 'text-gray-400' : 'text-gray-500'
          )}
        >
          <p className="text-sm">Classes cancelled for today</p>
          <p className="text-xs mt-1">
            Set lectures to 1 or more to mark attendance
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: lecturesForDay }, (_, index) => {
            const lectureNumber = index + 1;
            const isPresent = getLectureAttendance(lectureNumber);
            return (
              <div
                key={lectureNumber}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg',
                  darkMode ? 'bg-gray-900' : 'bg-gray-50'
                )}
              >
                <div>
                  <span
                    className={`font-medium ${darkMode ? 'text-white' : ''}`}
                  >
                    Lecture {lectureNumber}
                  </span>
                  {lecturesForDay > 1 && (
                    <span
                      className={`text-sm ml-2 ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      {index === 0 && 'Morning'}
                      {index === 1 && 'Afternoon'}
                      {index === 2 && 'Evening'}
                      {index > 2 && `Session ${lectureNumber}`}
                    </span>
                  )}
                </div>
                <AttendanceToggle
                  present={isPresent}
                  onToggle={(present) =>
                    onMarkAttendance(subjectId, lectureNumber, present, date)
                  }
                  data-testid={`toggle-${subjectId}-${lectureNumber}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
