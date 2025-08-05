import { useState } from "react";
import { Save, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "./date-picker";
import { DynamicLectureAttendance } from "./dynamic-lecture-attendance";
import { Subject, AttendanceRecord } from "@shared/schema";
import { formatDisplayDate, getCurrentDateString, getTodayDay } from "@/lib/date-utils";
import { format, addDays, subDays, parseISO } from "date-fns";

interface DailyScreenProps {
  subjects: Subject[];
  getAttendanceForSubjectAndDate: (subjectId: string, date: string) => AttendanceRecord[];
  markAttendance: (subjectId: string, lectureNumber: number, present: boolean, date?: string) => void;
  removeAttendance: (subjectId: string, lectureNumber: number, date?: string) => void;
}

export function DailyScreen({ 
  subjects, 
  getAttendanceForSubjectAndDate, 
  markAttendance,
  removeAttendance 
}: DailyScreenProps) {
  const [selectedDate, setSelectedDate] = useState(getCurrentDateString());
  
  const selectedDateObj = parseISO(selectedDate);
  const selectedDayOfWeek = selectedDateObj.getDay();
  
  const getSubjectsForDate = (date: string) => {
    const dayOfWeek = parseISO(date).getDay();
    return subjects.filter(subject => subject.schedule.includes(dayOfWeek));
  };

  const subjectsForDate = getSubjectsForDate(selectedDate);

  const handlePreviousDay = () => {
    const prevDay = format(subDays(selectedDateObj, 1), "yyyy-MM-dd");
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = format(addDays(selectedDateObj, 1), "yyyy-MM-dd");
    setSelectedDate(nextDay);
  };

  const handleSaveAttendance = () => {
    console.log("Attendance saved for", selectedDate);
  };

  const isToday = selectedDate === getCurrentDateString();

  return (
    <div className="p-4 space-y-6">
      {/* Date Navigation */}
      <Card className="shadow-material">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-center">Select Date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Picker */}
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          
          {/* Quick Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDay}
              data-testid="button-previous-day"
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
              >
                Today
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDay}
              data-testid="button-next-day"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          {isToday ? "Today's Classes" : "Classes"}
        </h2>
        <p className="text-gray-600">{formatDisplayDate(selectedDate)}</p>
      </div>

      {/* Subjects for Selected Date */}
      {subjectsForDate.length === 0 ? (
        <Card className="shadow-material">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No classes scheduled for this date!</p>
            <p className="text-sm text-gray-500 mt-2">
              {isToday ? "Enjoy your free day!" : "Try selecting a different date."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {subjectsForDate.map((subject) => {
            const existingRecords = getAttendanceForSubjectAndDate(subject.id, selectedDate);

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
              />
            );
          })}
        </div>
      )}

      {/* Save Button */}
      {subjectsForDate.length > 0 && (
        <Button
          onClick={handleSaveAttendance}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 shadow-material sticky bottom-4"
          data-testid="button-save-attendance"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Attendance for {formatDisplayDate(selectedDate)}
        </Button>
      )}
    </div>
  );
}
