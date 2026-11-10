import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  Crosshair,
  Bell,
  User,
  LogOut,
  Users,
  BarChart3,
  ArrowRightLeft,
  Wrench,
  ShieldAlert,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: number;
  urgentBadge?: number;
  isAction?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  onOpenNotifications: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    logout,
    switchRole,
    notifications,
    complaints,
  } = useApp();

  if (!currentUser) return null;

  const isStudent = currentUser.role === 'student';

  // Counts
  const userRole = currentUser.role;
  const unreadCount = notifications.filter((n) => {
    if (n.isRead) return false;
    if (n.recipientRole === 'all') return true;
    if (n.recipientRole === userRole) {
      if (userRole === 'student' && n.recipientUserId) {
        return n.recipientUserId === currentUser.id || n.recipientUserId === 'usr_stu_101';
      }
      return true;
    }
    return false;
  }).length;

  const urgentAdminCount = complaints.filter(
    (c) => c.priority === 'Urgent' && c.status !== 'Resolved'
  ).length;

  const studentNavItems: NavItem[] = [
    {
      id: 'student-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'report-issue',
      label: 'Report an Issue',
      icon: PlusCircle,
      highlight: true,
    },
    {
      id: 'my-complaints',
      label: 'My Complaints',
      icon: ListTodo,
      badge: complaints.filter(
        (c) => c.studentId === currentUser.studentId || c.studentId === 'STU-2023-CS-084'
      ).length,
    },
    {
      id: 'track-complaint',
      label: 'Track Complaints',
      icon: Crosshair,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      isAction: true,
      onClick: onOpenNotifications,
    },
    {
      id: 'student-profile',
      label: 'Student Profile',
      icon: User,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      id: 'admin-dashboard',
      label: 'Admin Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'admin-complaints',
      label: 'Manage Complaints',
      icon: ListTodo,
      badge: complaints.length,
      urgentBadge: urgentAdminCount > 0 ? urgentAdminCount : undefined,
    },
    {
      id: 'admin-staff',
      label: 'Maintenance Staff',
      icon: Users,
    },
    {
      id: 'admin-analytics',
      label: 'Analytics & Hotspots',
      icon: BarChart3,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      isAction: true,
      onClick: onOpenNotifications,
    },
    {
      id: 'admin-profile',
      label: 'Admin Profile',
      icon: User,
    },
  ];

  const items = isStudent ? studentNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Role Banner / Profile Quick Card */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-slate-900 truncate">
              {currentUser.name}
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {currentUser.role === 'student'
                ? currentUser.studentId
                : currentUser.role === 'warden'
                ? `Warden · ${currentUser.assignedHostel?.split('(')[0] || 'Block A'}`
                : currentUser.role === 'maintenance_staff'
                ? `Staff · ${currentUser.specialty || 'General'}`
                : currentUser.designation || 'Campus Admin'}
            </p>
          </div>
        </div>

        {/* Quick switch button for evaluation */}
        <button
          onClick={() => switchRole(isStudent ? 'admin' : 'student')}
          className="mt-3 w-full py-1.5 px-2.5 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <ArrowRightLeft className="w-3 h-3 text-red-700" />
          Switch to {isStudent ? 'Admin' : 'Student'} View
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {isStudent ? 'Student Workspace' : 'Campus Operations'}
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  setCurrentView(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-red-700 text-white shadow-xs'
                  : item.highlight
                  ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-100'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : item.highlight ? 'text-red-600' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {item.urgentBadge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700'
                    }`}
                    title="Urgent unresolved tickets"
                  >
                    {item.urgentBadge}
                  </span>
                )}
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-red-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info & Sign out */}
      <div className="p-3 border-t border-slate-100 bg-white space-y-2">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 text-[11px] text-slate-500 flex items-center gap-2">
          <Wrench className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-slate-700 block">VIT-AP Facilities Helpdesk</span>
            <span className="text-slate-600 font-mono">+91 863 2399999 · Ext. 4400</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out of Fixora
        </button>
      </div>
    </aside>
  );
};
