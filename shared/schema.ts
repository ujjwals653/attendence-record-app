import { z } from "zod";

export const subjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Subject name is required"),
  schedule: z.array(z.number().min(0).max(6)), // 0 = Sunday, 1 = Monday, etc.
  createdAt: z.date(),
});

export const attendanceRecordSchema = z.object({
  id: z.string(),
  subjectId: z.string(),
  date: z.string(), // YYYY-MM-DD format
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
}

export interface AppSettings {
  notificationsEnabled: boolean;
  notificationTime: string; // HH:MM format
  firstTimeSetup: boolean;
}
