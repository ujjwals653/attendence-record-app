import { AttendanceToggle } from "./attendance-toggle";
import { AttendanceRecord } from "@shared/schema";
import { cn } from "@/lib/utils";

interface LectureAttendanceProps {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  lecturesPerDay: number;
  date: string;
  existingRecords: AttendanceRecord[];
  onMarkAttendance: (subjectId: string, lectureNumber: number, present: boolean, date: string) => void;
}

export function LectureAttendance({
  subjectId,
  subjectName,
  subjectColor,
  lecturesPerDay,
  date,
  existingRecords,
  onMarkAttendance,
}: LectureAttendanceProps) {
  const getLectureAttendance = (lectureNumber: number): boolean => {
    const record = existingRecords.find(r => r.lectureNumber === lectureNumber);
    return record?.present || false;
  };

  const getPresentCount = (): number => {
    return existingRecords.filter(r => r.present).length;
  };

  const getAttendanceColor = (presentCount: number, totalLectures: number) => {
    const percentage = totalLectures > 0 ? (presentCount / totalLectures) * 100 : 0;
    if (percentage === 100) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    if (percentage > 0) return "text-orange-600";
    return "text-red-600";
  };

  const presentCount = getPresentCount();

  return (
    <div 
      className="border-l-4 rounded-lg p-4 bg-white shadow-material"
      style={{ borderLeftColor: subjectColor }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium" data-testid={`text-subject-${subjectId}`}>
            {subjectName}
          </h3>
          <p className="text-sm text-gray-600">
            {lecturesPerDay === 1 ? "Single lecture" : `${lecturesPerDay} lectures today`}
          </p>
        </div>
        <div className="text-right">
          <div 
            className={cn("text-lg font-bold", getAttendanceColor(presentCount, lecturesPerDay))}
            data-testid={`text-attendance-${subjectId}`}
          >
            {presentCount}/{lecturesPerDay}
          </div>
          <div className="text-xs text-gray-500">Present</div>
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: lecturesPerDay }, (_, index) => {
          const lectureNumber = index + 1;
          const isPresent = getLectureAttendance(lectureNumber);

          return (
            <div 
              key={lectureNumber} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <span className="font-medium">Lecture {lectureNumber}</span>
                {lecturesPerDay > 1 && (
                  <span className="text-sm text-gray-500 ml-2">
                    {index === 0 && "Morning"}
                    {index === 1 && "Afternoon"}
                    {index === 2 && "Evening"}
                    {index > 2 && `Session ${lectureNumber}`}
                  </span>
                )}
              </div>
              <AttendanceToggle
                present={isPresent}
                onToggle={(present) => onMarkAttendance(subjectId, lectureNumber, present, date)}
                data-testid={`toggle-${subjectId}-${lectureNumber}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}