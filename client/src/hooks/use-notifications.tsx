import { useState, useEffect, useCallback } from "react";
import { AppSettings } from "@shared/schema";
import { LocalStorage } from "@/lib/storage";

export function useNotifications() {
  const [settings, setSettings] = useState<AppSettings>({
    notificationsEnabled: false,
    notificationTime: "19:00",
    firstTimeSetup: true
  });
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    const loadedSettings = LocalStorage.getSettings();
    setSettings(loadedSettings);
    
    // Check current notification permission
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    LocalStorage.saveSettings(settings);
  }, [settings]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted") {
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, []);

  const scheduleNotification = useCallback((message: string, scheduledTime?: Date) => {
    if (!("Notification" in window) || permission !== "granted") {
      return;
    }

    const showNotification = () => {
      new Notification("AttendanceTracker Reminder", {
        body: message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "attendance-reminder",
        renotify: true,
      });
    };

    if (scheduledTime) {
      const now = new Date();
      const delay = scheduledTime.getTime() - now.getTime();
      
      if (delay > 0) {
        setTimeout(showNotification, delay);
      }
    } else {
      showNotification();
    }
  }, [permission]);

  const scheduleDailyReminder = useCallback(() => {
    if (!settings.notificationsEnabled || permission !== "granted") {
      return;
    }

    const now = new Date();
    const [hours, minutes] = settings.notificationTime.split(":").map(Number);
    
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    scheduleNotification(
      "Don't forget to mark your attendance for today!",
      reminderTime
    );
  }, [settings, permission, scheduleNotification]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleNotifications = useCallback(async () => {
    if (!settings.notificationsEnabled) {
      const granted = await requestPermission();
      if (granted) {
        scheduleDailyReminder();
      }
    } else {
      updateSettings({ notificationsEnabled: false });
    }
  }, [settings.notificationsEnabled, requestPermission, scheduleDailyReminder, updateSettings]);

  return {
    settings,
    permission,
    requestPermission,
    scheduleNotification,
    scheduleDailyReminder,
    updateSettings,
    toggleNotifications,
  };
}
