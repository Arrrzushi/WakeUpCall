const NOTIFICATION_PERMISSION_KEY = 'notification-permission-asked';

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return false;
  }

  const permissionAsked = localStorage.getItem(NOTIFICATION_PERMISSION_KEY);
  if (permissionAsked) {
    return Notification.permission === 'granted';
  }

  const permission = await Notification.requestPermission();
  localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true');
  return permission === 'granted';
}

export function showAlarmNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/alarm-icon.svg',
      badge: '/alarm-icon.svg',
      ...options
    });
  }
  return null;
}
