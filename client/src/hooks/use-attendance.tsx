import { useState, useEffect, useCallback } from "react";
import { Subject, AttendanceRecord, InsertSubject, InsertAttendanceRecord, AttendanceStats } from "@shared/schema";
import { LocalStorage } from "@/lib/storage";
import { getCurrentDateString, getTodayDay } from "@/lib/date-utils";
import { nanoid } from "nanoid";

export function useAttendance() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedSubjects = LocalStorage.getSubjects();
    const loadedRecords = LocalStorage.getAttendanceRecords();
    setSubjects(loadedSubjects);
    setAttendanceRecords(loadedRecords);
    setLoading(false);
  }, []);

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      LocalStorage.saveSubjects(subjects);
    }
  }, [subjects, loading]);

  // Save attendance records to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      LocalStorage.saveAttendanceRecords(attendanceRecords);
    }
  }, [attendanceRecords, loading]);

  const addSubject = useCallback((insertSubject: InsertSubject) => {
    const newSubject: Subject = {
      ...insertSubject,
      id: nanoid(),
      createdAt: new Date(),
    };
    setSubjects(prev => [...prev, newSubject]);
  }, []);

  const removeSubject = useCallback((subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    setAttendanceRecords(prev => prev.filter(r => r.subjectId !== subjectId));
  }, []);

  const markAttendance = useCallback((subjectId: string, lectureNumber: number, present: boolean, date?: string) => {
    const attendanceDate = date || getCurrentDateString();
    
    setAttendanceRecords(prev => {
      const existingRecord = prev.find(r => 
        r.subjectId === subjectId && 
        r.date === attendanceDate && 
        r.lectureNumber === lectureNumber
      );
      
      if (existingRecord) {
        // Update existing record
        return prev.map(r => 
          r.id === existingRecord.id 
            ? { ...r, present }
            : r
        );
      } else {
        // Create new record
        const newRecord: AttendanceRecord = {
          id: nanoid(),
          subjectId,
          date: attendanceDate,
          lectureNumber,
          present,
          createdAt: new Date(),
        };
        return [...prev, newRecord];
      }
    });
  }, []);

  const getTodaySubjects = useCallback((): Subject[] => {
    const todayDay = getTodayDay();
    return subjects.filter(subject => subject.schedule.includes(todayDay));
  }, [subjects]);

  const getAttendanceForDate = useCallback((subjectId: string, date: string, lectureNumber: number): boolean | undefined => {
    const record = attendanceRecords.find(r => 
      r.subjectId === subjectId && 
      r.date === date && 
      r.lectureNumber === lectureNumber
    );
    return record?.present;
  }, [attendanceRecords]);

  const getAttendanceForSubjectAndDate = useCallback((subjectId: string, date: string): AttendanceRecord[] => {
    return attendanceRecords.filter(r => r.subjectId === subjectId && r.date === date);
  }, [attendanceRecords]);

  const getAttendanceStats = useCallback((): AttendanceStats[] => {
    return subjects.map(subject => {
      const subjectRecords = attendanceRecords.filter(r => r.subjectId === subject.id);
      const totalClasses = subjectRecords.length;
      const presentClasses = subjectRecords.filter(r => r.present).length;
      const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        totalClasses,
        presentClasses,
        attendancePercentage: Math.round(attendancePercentage * 10) / 10, // Round to 1 decimal
      };
    });
  }, [subjects, attendanceRecords]);

  const getOverallStats = useCallback(() => {
    const stats = getAttendanceStats();
    const totalClasses = stats.reduce((sum, s) => sum + s.totalClasses, 0);
    const totalPresent = stats.reduce((sum, s) => sum + s.presentClasses, 0);
    const overallPercentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;

    return {
      totalClasses,
      totalPresent,
      overallPercentage: Math.round(overallPercentage * 10) / 10,
    };
  }, [getAttendanceStats]);

  return {
    subjects,
    attendanceRecords,
    loading,
    addSubject,
    removeSubject,
    markAttendance,
    getTodaySubjects,
    getAttendanceForDate,
    getAttendanceForSubjectAndDate,
    getAttendanceStats,
    getOverallStats,
  };
}
