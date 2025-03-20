'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications, NotificationData } from '@/hooks/useNotifications';

const NotificationsPanel: React.FC = () => {
  const notifications = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    if (notifications.length) {
      setVisibleNotifications((prev) => [...prev, ...notifications]);
    }
  }, [notifications]);

  const dismissNotification = (index: number) => {
    setVisibleNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 space-y-2 z-50">
      {visibleNotifications.map((notif, idx) => (
        <div key={idx} className="bg-white shadow-md rounded p-4 border">
          <div className="flex justify-between items-center">
            <span className="font-bold">{notif.type}</span>
            <button onClick={() => dismissNotification(idx)} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <p className="text-sm">{notif.message}</p>
          {notif.data && (
            <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(notif.data, null, 2)}</pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationsPanel;
