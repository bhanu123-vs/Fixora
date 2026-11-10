import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Wrench,
  RotateCcw,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  // Filter relevant notifications for current role
  const role = currentUser?.role || 'student';
  const userNotifications = notifications.filter((n) => {
    if (n.recipientRole === 'all') return true;
    if (n.recipientRole === role) {
      if (role === 'student' && n.recipientUserId) {
        return n.recipientUserId === currentUser?.id || n.recipientUserId === 'usr_stu_101';
      }
      return true;
    }
    return false;
  });

  const filteredNotifications =
    activeTab === 'unread'
      ? userNotifications.filter((n) => !n.isRead)
      : userNotifications;

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const formatTimestamp = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'assignment':
        return <Wrench className="w-4 h-4 text-red-600" />;
      case 'resolved':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'reopened':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-700" />;
    }
  };

  const handleNotificationClick = (complaintId?: string, notifId?: string) => {
    if (notifId) markNotificationRead(notifId);
    if (complaintId) {
      if (currentUser?.role === 'admin') {
        setCurrentView('admin-complaints', complaintId);
      } else {
        setCurrentView('track-complaint', complaintId);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllNotificationsRead(role)}
                  className="text-xs font-medium text-red-700 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({userNotifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'unread'
                  ? 'bg-red-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {filteredNotifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-700">No notifications found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Updates on complaints and maintenance will appear here in real-time.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.complaintId, notif.id)}
                  className={`p-4 rounded-lg transition-colors cursor-pointer hover:bg-slate-50 relative ${
                    !notif.isRead ? 'bg-red-50/40' : ''
                  }`}
                >
                  {!notif.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-600" />
                  )}

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-md bg-white border border-slate-200 shadow-xs shrink-0">
                      {getNotifIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-xs font-semibold text-slate-900">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                        <span className="font-mono tabular-nums">
                          {formatTimestamp(notif.timestamp)}
                        </span>
                        {notif.complaintId && (
                          <span className="text-red-700 font-medium flex items-center gap-0.5 hover:underline">
                            View ticket <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
