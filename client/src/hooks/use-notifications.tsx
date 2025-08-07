import { useState, useEffect, useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { AppSettings } from '@shared/schema';
import { LocalStorage } from '@/lib/storage';

export function useNotifications() {
  const [settings, setSettings] = useState<AppSettings>({
    notificationsEnabled: false,
    notificationTime: '19:00',
    firstTimeSetup: true,
  });
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const isCapacitor = Capacitor.isNativePlatform();

  useEffect(() => {
    const loadedSettings = LocalStorage.getSettings();
    setSettings(loadedSettings);

    // Check current notification permission
    if (isCapacitor) {
      // Capacitor permissions are handled differently
      setPermission('granted');
    } else if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    LocalStorage.saveSettings(settings);
  }, [settings]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (isCapacitor) {
      try {
        const result = await LocalNotifications.requestPermissions();
        if (result.display === 'granted') {
          setPermission('granted');
          setSettings((prev) => ({ ...prev, notificationsEnabled: true }));
          return true;
        }
        setPermission('denied');
        return false;
      } catch (error) {
        console.error(
          'Error requesting Capacitor notification permission:',
          error
        );
        setPermission('denied');
        return false;
      }
    } else if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
          setSettings((prev) => ({ ...prev, notificationsEnabled: true }));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    } else {
      console.warn('Notifications not supported');
      return false;
    }
  }, [isCapacitor]);

  const scheduleNotification = useCallback(
    (message: string, scheduledTime?: Date) => {
      if (permission !== 'granted') {
        return;
      }

      if (isCapacitor) {
        // Use Capacitor LocalNotifications
        const now = new Date();
        let scheduleTime = now;
        if (scheduledTime && scheduledTime > now) {
          scheduleTime = scheduledTime;
        }
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'AttendanceTracker Reminder',
              body: message,
              id: Math.floor(Math.random() * 100000),
              schedule: { at: scheduleTime },
              sound: undefined,
              smallIcon: 'ic_stat_icon',
              actionTypeId: 'attendance-reminder',
            },
          ],
        });
      } else if ('Notification' in window) {
        const showNotification = () => {
          new Notification('AttendanceTracker Reminder', {
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'attendance-reminder',
            // renotify: true, // Removed, not in NotificationOptions type
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
      }
    },
    [permission, isCapacitor]
  );

  const scheduleDailyReminder = useCallback(() => {
    if (!settings.notificationsEnabled || permission !== 'granted') {
      return;
    }

    const now = new Date();
    const [hours, minutes] = settings.notificationTime.split(':').map(Number);

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
    setSettings((prev) => ({ ...prev, ...newSettings }));
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
  }, [
    settings.notificationsEnabled,
    requestPermission,
    scheduleDailyReminder,
    updateSettings,
  ]);

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
