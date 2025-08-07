import { z } from "zod";

export const subjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Subject name is required"),
  schedule: z.array(z.number().min(0).max(6)), // 0 = Sunday, 1 = Monday, etc.
  lecturesPerDay: z.number().min(1).max(10).default(1), // Number of lectures per scheduled day
  color: z.string().default("#8B5CF6"), // Purple default color
  createdAt: z.date(),
});

export const attendanceRecordSchema = z.object({
  id: z.string(),
  subjectId: z.string(),
  date: z.string(), // YYYY-MM-DD format
  lectureNumber: z.number().min(1), // Which lecture of the day (1, 2, 3, etc.)
  present: z.boolean(),
  createdAt: z.date(),
});

export const insertSubjectSchema = subjectSchema.omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceRecordSchema = attendanceRecordSchema.omit({
  id: true,
  createdAt: true,
});

export type Subject = z.infer<typeof subjectSchema>;
export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;

export interface AttendanceStats {
  subjectId: string;
  subjectName: string;
  totalClasses: number;
  presentClasses: number;
  attendancePercentage: number;
  schedule?: number[];
  color?: string;
}

export interface ImportData {
  overallStats: {
    totalClasses: number;
    totalPresent: number;
    overallPercentage: number;
  };
  subjects: AttendanceStats[];
  exportDate: string;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  notificationTime: string; // HH:MM format
  firstTimeSetup: boolean;
}
