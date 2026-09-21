import React, { createContext, useContext, useState } from 'react';
import { LiveAlert } from '../types/logistics';
import { INITIAL_ALERTS } from '../data/alertsData';

interface NotificationContextType {
  alerts: LiveAlert[];
  unreadCount: number;
  selectedAlert: LiveAlert | null;
  setSelectedAlert: (alert: LiveAlert | null) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addAlert: (alert: Omit<LiveAlert, 'id' | 'timestamp' | 'timeAgo'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<LiveAlert[]>(INITIAL_ALERTS);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [selectedAlert, setSelectedAlert] = useState<LiveAlert | null>(null);

  const unreadCount = alerts.filter(a => !readIds.has(a.id)).length;

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set(prev).add(id));
  };

  const markAllAsRead = () => {
    setReadIds(new Set(alerts.map(a => a.id)));
  };

  const addAlert = (newAlert: Omit<LiveAlert, 'id' | 'timestamp' | 'timeAgo'>) => {
    const alert: LiveAlert = {
      ...newAlert,
      id: `alt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now'
    };
    setAlerts(prev => [alert, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        alerts,
        unreadCount,
        selectedAlert,
        setSelectedAlert,
        markAsRead,
        markAllAsRead,
        addAlert
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
