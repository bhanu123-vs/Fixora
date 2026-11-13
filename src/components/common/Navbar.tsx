import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS } from '../../constants/assets';
import { UserAvatar } from './UserAvatar';
import {
  Bell,
  ArrowRightLeft,
  LogOut,
  User,
  PlusCircle,
  Menu,
  X,
  FileText,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (role?: 'student' | 'admin' | 'warden' | 'maintenance_staff') => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenNotifications,
}) => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    logout,
    switchRole,
    notifications,
    resetDemoData,
    isFirebaseConnected,
    theme,
    toggleTheme,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Unread notifications count
  const userRole = currentUser?.role || 'student';
  const currentUid = currentUser?.uid || currentUser?.id;
  const isManagementUser =
    userRole === 'admin' || userRole === 'warden' || userRole === 'maintenance_staff';
  const unreadCount = notifications.filter((n) => {
    if (n.isRead) return false;
    if (n.recipientRole === 'all') return true;
    const recipient = n.recipientUid || n.recipientUserId;
    if (recipient && currentUid) {
      return recipient === currentUid;
    }
    return n.recipientRole === userRole;
  }).length;

  const isLanding = currentView === 'landing' && !currentUser;

  const handleNavClick = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Campus Admin';
      case 'warden':
        return 'Hostel Warden';
      case 'maintenance_staff':
        return 'Maintenance Staff';
      default:
        return 'Student Portal';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* ZONE 1: Fixora Logo & VIT-AP University Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentView(
                    currentUser.role === 'admin' || currentUser.role === 'warden'
                      ? 'admin-dashboard'
                      : 'student-dashboard'
                  );
                } else {
                  setCurrentView('landing');
                }
              }}
              className="flex items-center gap-2.5 group text-left"
            >
              {/* Fixora Official Logo Image */}
              <img
                src={ASSETS.FIXORA_LOGO}
                alt="Fixora Logo"
                className="h-9 w-auto object-contain rounded-md"
              />

              {/* Divider */}
              <div className="h-6 w-px bg-slate-300 hidden sm:block" />

              {/* VIT-AP Official Logo & Badge */}
              <div className="flex items-center gap-2">
                <img
                  src={ASSETS.VIT_AP_LOGO}
                  alt="VIT-AP Logo"
                  className="h-9 w-auto object-contain"
                />
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-xs font-black tracking-wider text-red-700 uppercase">
                    VIT-AP
                  </span>
                  <span className="text-[9px] font-semibold tracking-tight text-slate-600 uppercase">
                    University
                  </span>
                </div>
              </div>
            </button>

            {/* Context tag for active dashboard */}
            {currentUser && (
              <span className="hidden md:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded text-red-900 bg-red-50 border border-red-100">
                {getRoleLabel(currentUser.role)}
              </span>
            )}

            {/* Cloud Firestore connected pill */}
            <span
              className="hidden lg:inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
              title={isFirebaseConnected ? 'Connected to Cloud Firestore' : 'Firestore connection offline'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isFirebaseConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{isFirebaseConnected ? 'Cloud Active' : 'Offline Mode'}</span>
            </span>
          </div>

          {/* ZONE 2: Clean 4–5 single-line navigation links */}
          {isLanding ? (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <button
                onClick={() => handleNavClick('problem')}
                className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                The Challenge
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('roles')}
                className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Roles & Access
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                FAQ
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              {currentUser?.role === 'student' ? (
                <>
                  <button
                    onClick={() => setCurrentView('student-dashboard')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      currentView === 'student-dashboard'
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentView('my-complaints')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      currentView === 'my-complaints' || currentView === 'track-complaint'
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Complaints
                  </button>
                  <button
                    onClick={() => setCurrentView('report-issue')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors whitespace-nowrap shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-red-600" />
                    Report Issue
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentView('admin-dashboard')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      currentView === 'admin-dashboard'
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentView('admin-complaints')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      currentView === 'admin-complaints'
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Complaints Queue
                  </button>
                  <button
                    onClick={() => setCurrentView('admin-staff')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      currentView === 'admin-staff'
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Maintenance Staff
                  </button>
                  <button
                    onClick={() => setCurrentView('admin-analytics')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      currentView === 'admin-analytics'
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Analytics & Hotspots
                  </button>
                </>
              )}
            </div>
          )}

          {/* ZONE 3: Theme Toggle + 1 primary action / user controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Dark / Light Mode Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              onClick={toggleTheme}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full border p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-red-800/70'
                  : 'bg-slate-100 border-slate-300'
              }`}
            >
              <span className="sr-only">Toggle dark or light mode</span>
              <span
                className={`pointer-events-none flex h-5.5 w-5.5 items-center justify-center rounded-full shadow-sm transition-transform duration-200 ${
                  theme === 'dark'
                    ? 'translate-x-6 bg-red-700 text-white'
                    : 'translate-x-0 bg-white text-amber-500'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="h-3 w-3" />
                ) : (
                  <Sun className="h-3 w-3" />
                )}
              </span>
            </button>

            {isLanding ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenAuth('student')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('student')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors shadow-xs whitespace-nowrap shrink-0"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Instant Role Switcher for Evaluators */}
                <button
                  onClick={() =>
                    switchRole(isManagementUser ? 'student' : 'admin')
                  }
                  title="Switch between Student and Admin perspective"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Switch to {isManagementUser ? 'Student' : 'Admin'}
                  </span>
                </button>

                {/* Notifications Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600" />
                  )}
                </button>

                {/* User Avatar & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-700 transition-all"
                  >
                    <UserAvatar
                      src={currentUser?.avatar}
                      name={currentUser?.name}
                      sizeClass="w-7 h-7"
                      textSizeClass="text-[11px]"
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {currentUser?.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {currentUser?.email}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView(
                            isManagementUser ? 'admin-profile' : 'student-profile'
                          );
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        My Profile & Room
                      </button>

                      <button
                        onClick={() => {
                          switchRole(
                            isManagementUser ? 'student' : 'admin'
                          );
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                        Switch to {isManagementUser ? 'Student' : 'Admin'} Mode
                      </button>

                      <button
                        onClick={() => {
                          toggleTheme();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between gap-2"
                      >
                        <span className="flex items-center gap-2">
                          {theme === 'dark' ? (
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Moon className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          resetDemoData();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                        Reset Demo Records
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            {currentUser?.role === 'student' ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView('student-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setCurrentView('report-issue');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 rounded-md"
                >
                  Report an Issue
                </button>
                <button
                  onClick={() => {
                    setCurrentView('my-complaints');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  My Complaints
                </button>
                <button
                  onClick={() => {
                    setCurrentView('student-profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  Profile
                </button>
              </>
            ) : isManagementUser ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  Dashboard Overview
                </button>
                <button
                  onClick={() => {
                    setCurrentView('admin-complaints');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  Manage Complaints
                </button>
                <button
                  onClick={() => {
                    setCurrentView('admin-staff');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  Maintenance Staff
                </button>
                <button
                  onClick={() => {
                    setCurrentView('admin-analytics');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  Analytics
                </button>
              </>
            ) : null}
            {currentUser && (
              <button
                onClick={() => {
                  switchRole(isManagementUser ? 'student' : 'admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 rounded-md"
              >
                Switch to {isManagementUser ? 'Student' : 'Admin'} Mode
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
