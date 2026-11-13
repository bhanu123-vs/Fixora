/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ReportIssueView } from './components/student/ReportIssueView';
import { MyComplaintsView } from './components/student/MyComplaintsView';
import { ComplaintTrackingView } from './components/student/ComplaintTrackingView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminComplaintsView } from './components/admin/AdminComplaintsView';
import { StaffManagementView } from './components/admin/StaffManagementView';
import { AnalyticsView } from './components/admin/AnalyticsView';
import { ProfileView } from './components/profile/ProfileView';
import { ArrowRightLeft, Sparkles, Home, Sun, Moon } from 'lucide-react';

import { UserRole } from './types';

const MainApp: React.FC = () => {
  const { currentUser, currentView, setCurrentView, switchRole, theme, toggleTheme } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('student');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const handleOpenAuth = (role: UserRole = 'student') => {
    setAuthInitialRole(role);
    setAuthModalOpen(true);
  };

  const isLanding = currentView === 'landing' && !currentUser;

  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onOpenAuth={handleOpenAuth} />;

      // Student views
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'report-issue':
        return <ReportIssueView />;
      case 'my-complaints':
        return <MyComplaintsView />;
      case 'track-complaint':
        return <ComplaintTrackingView />;
      case 'student-profile':
        return <ProfileView />;

      // Admin views
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-complaints':
        return <AdminComplaintsView />;
      case 'admin-staff':
        return <StaffManagementView />;
      case 'admin-analytics':
        return <AnalyticsView />;
      case 'admin-profile':
        return <ProfileView />;

      default:
        return currentUser?.role === 'admin' ||
          currentUser?.role === 'warden' ||
          currentUser?.role === 'maintenance_staff' ? (
          <AdminDashboard />
        ) : (
          <StudentDashboard />
        );
    }
  };

  const isManagementRole =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'warden' ||
    currentUser?.role === 'maintenance_staff';

  const roleDisplayName = !currentUser
    ? 'Public'
    : currentUser.role === 'admin'
    ? 'Admin'
    : currentUser.role === 'warden'
    ? 'Warden'
    : currentUser.role === 'maintenance_staff'
    ? 'Staff'
    : 'Student';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-red-100 selection:text-red-900 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
      />

      {/* Main Container */}
      {isLanding ? (
        <main className="flex-1">
          <LandingPage onOpenAuth={handleOpenAuth} />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Dashboard Left Sidebar */}
          <Sidebar
            onOpenNotifications={() => setNotificationDrawerOpen(true)}
          />

          {/* Main Content Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            {renderActiveView()}
          </main>
        </div>
      )}

      {/* Evaluator Fast Switch Bar (Floating in Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-slate-950/95 backdrop-blur-md text-white p-1.5 pl-3 rounded-full shadow-2xl border border-red-950/40 text-xs animate-in slide-in-from-bottom-3">
        <div className="flex items-center gap-1.5 font-medium pr-1 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Role Mode:</span>
          <strong className="text-white">
            {roleDisplayName}
          </strong>
        </div>

        {currentUser ? (
          <button
            onClick={() =>
              switchRole(isManagementRole ? 'student' : 'admin')
            }
            className="px-2.5 py-1 bg-red-700 hover:bg-red-600 text-white rounded-full font-semibold transition-colors flex items-center gap-1 shadow-xs"
            title="Switch between student and admin"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Switch to {isManagementRole ? 'Student' : 'Admin'}</span>
          </button>
        ) : (
          <button
            onClick={() => handleOpenAuth('student')}
            className="px-2.5 py-1 bg-red-700 hover:bg-red-600 text-white rounded-full font-semibold transition-colors flex items-center gap-1 shadow-xs"
          >
            Launch Demo
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle color mode"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => {
            if (!currentUser) {
              setCurrentView('landing');
            } else if (currentView === 'landing') {
              setCurrentView(isManagementRole ? 'admin-dashboard' : 'student-dashboard');
            } else {
              setCurrentView('landing');
            }
          }}
          className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          title={currentView === 'landing' && currentUser ? 'Open Dashboard' : 'View Public Landing Page'}
        >
          <Home className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* In-App Notification Center */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />

      {/* Auth & Demo Login Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authInitialRole}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
