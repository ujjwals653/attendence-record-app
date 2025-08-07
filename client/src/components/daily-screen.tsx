import { useState } from 'react';
import { Save, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from './date-picker';
import { DynamicLectureAttendance } from './dynamic-lecture-attendance';
import { Subject, AttendanceRecord } from '@shared/schema';
import {
  formatDisplayDate,
  getCurrentDateString,
  getTodayDay,
} from '@/lib/date-utils';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface DailyScreenProps {
  subjects: Subject[];
  getAttendanceForSubjectAndDate: (
    subjectId: string,
    date: string
  ) => AttendanceRecord[];
  markAttendance: (
    subjectId: string,
    lectureNumber: number,
    present: boolean,
    date?: string
  ) => void;
  removeAttendance: (
    subjectId: string,
    lectureNumber: number,
    date?: string
  ) => void;
  darkMode?: boolean;
}

export function DailyScreen({
  subjects,
  getAttendanceForSubjectAndDate,
  markAttendance,
  removeAttendance,
  darkMode,
}: DailyScreenProps) {
  const [selectedDate, setSelectedDate] = useState(getCurrentDateString());

  const selectedDateObj = parseISO(selectedDate);
  const selectedDayOfWeek = selectedDateObj.getDay();

  const getSubjectsForDate = (date: string) => {
    const dayOfWeek = parseISO(date).getDay();
    return subjects.filter((subject) => subject.schedule.includes(dayOfWeek));
  };

  const subjectsForDate = getSubjectsForDate(selectedDate);

  const handlePreviousDay = () => {
    const prevDay = format(subDays(selectedDateObj, 1), 'yyyy-MM-dd');
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = format(addDays(selectedDateObj, 1), 'yyyy-MM-dd');
    setSelectedDate(nextDay);
  };

  const handleSaveAttendance = () => {
    console.log('Attendance saved for', selectedDate);
  };

  const isToday = selectedDate === getCurrentDateString();

  return (
    <div
      className={`p-4 space-y-6 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Date Navigation */}
      <Card
        className={`shadow-material ${
          darkMode ? 'bg-gray-800 text-white' : ''
        }`}
      >
        <CardHeader className="pb-4">
          <CardTitle
            className={`text-lg text-center ${darkMode ? 'text-white' : ''}`}
          >
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Picker */}
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            darkMode={darkMode}
          />

          {/* Quick Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDay}
              data-testid="button-previous-day"
              className={cn(
                darkMode &&
                  'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              )}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            {!isToday && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(getCurrentDateString())}
                data-testid="button-today"
                className={cn(
                  darkMode &&
                    'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                )}
              >
                Today
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDay}
              data-testid="button-next-day"
              className={cn(
                darkMode &&
                  'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              )}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="text-center py-4">
        <h2
          className={`text-2xl font-medium mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {isToday ? "Today's Classes" : 'Classes'}
        </h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {formatDisplayDate(selectedDate)}
        </p>
      </div>

      {/* Subjects for Selected Date */}
      {subjectsForDate.length === 0 ? (
        <Card
          className={`shadow-material ${
            darkMode ? 'bg-gray-800 text-white' : ''
          }`}
        >
          <CardContent className="p-8 text-center">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              No classes scheduled for this date!
            </p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              {isToday
                ? 'Enjoy your free day!'
                : 'Try selecting a different date.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {subjectsForDate.map((subject) => {
            const existingRecords = getAttendanceForSubjectAndDate(
              subject.id,
              selectedDate
            );

            return (
              <DynamicLectureAttendance
                key={subject.id}
                subjectId={subject.id}
                subjectName={subject.name}
                subjectColor={subject.color}
                defaultLecturesPerDay={subject.lecturesPerDay}
                date={selectedDate}
                existingRecords={existingRecords}
                onMarkAttendance={markAttendance}
                onRemoveAttendance={removeAttendance}
                darkMode={darkMode}
              />
            );
          })}
        </div>
      )}

      {/* Save Button */}
      {subjectsForDate.length > 0 && (
        <Button
          onClick={handleSaveAttendance}
          className={`w-full py-4 shadow-material sticky bottom-4 ${
            darkMode
              ? 'bg-gradient-to-r from-purple-800 to-purple-900 text-white hover:from-purple-900 hover:to-purple-950'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
          }`}
          data-testid="button-save-attendance"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Attendance for {formatDisplayDate(selectedDate)}
        </Button>
      )}
    </div>
  );
}
