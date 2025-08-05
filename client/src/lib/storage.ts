import { Subject, AttendanceRecord, AppSettings } from "@shared/schema";

const SUBJECTS_KEY = "attendance_tracker_subjects";
const ATTENDANCE_KEY = "attendance_tracker_attendance";
const SETTINGS_KEY = "attendance_tracker_settings";

export class LocalStorage {
  static getSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(SUBJECTS_KEY);
      if (!data) return [];
      const subjects = JSON.parse(data);
      return subjects.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt)
      }));
    } catch (error) {
      console.error("Error loading subjects:", error);
      return [];
    }
  }

  static saveSubjects(subjects: Subject[]): void {
    try {
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
    } catch (error) {
      console.error("Error saving subjects:", error);
    }
  }

  static getAttendanceRecords(): AttendanceRecord[] {
    try {
      const data = localStorage.getItem(ATTENDANCE_KEY);
      if (!data) return [];
      const records = JSON.parse(data);
      return records.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt)
      }));
    } catch (error) {
      console.error("Error loading attendance records:", error);
      return [];
    }
  }

  static saveAttendanceRecords(records: AttendanceRecord[]): void {
    try {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Error saving attendance records:", error);
    }
  }

  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        return {
          notificationsEnabled: false,
          notificationTime: "19:00",
          firstTimeSetup: true
        };
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading settings:", error);
      return {
        notificationsEnabled: false,
        notificationTime: "19:00",
        firstTimeSetup: true
      };
    }
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }
}
