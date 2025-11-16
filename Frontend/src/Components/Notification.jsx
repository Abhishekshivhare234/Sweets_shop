import React from 'react';
import { useApp } from '../Context/AppContext';

const Notification = () => {
  const { notifications, removeNotification } = useApp();

  const getNotificationStyles = (type) => {
    const styles = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationStyles(
            notification.type
          )} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] animate-slide-in`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;

