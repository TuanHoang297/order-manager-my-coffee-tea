import { useState, useEffect } from 'react';
import { playNotificationSound } from '../utils/notification';

export const useNotification = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
    }
  };

  const playNotification = async () => {
    await playNotificationSound();
  };

  const showBrowserNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png'
      });
    }
  };

  return {
    playNotification,
    requestPermission,
    showBrowserNotification,
    hasPermission
  };
};
