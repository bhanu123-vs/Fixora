import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, testConnection } from '../lib/firebase';
import {
  UserProfile,
  Complaint,
  MaintenanceStaff,
  NotificationItem,
  ComplaintStatus,
  PriorityLevel,
  UserRole,
  TimelineEvent,
} from '../types';
import {
  DEMO_STUDENT,
  DEMO_ADMIN,
  INITIAL_COMPLAINTS,
  INITIAL_STAFF,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import {
  registerWithEmail,
  loginWithEmail,
  logout as firebaseLogout,
  fetchUserProfile,
  subscribeToComplaints,
  subscribeToNotifications,
  createComplaintInFirestore,
  updateComplaintStatusInFirestore,
  updateComplaintPriorityInFirestore,
  assignStaffInFirestore,
  confirmResolutionInFirestore,
  reopenComplaintInFirestore,
  markNotificationReadInFirestore,
  markAllNotificationsReadInFirestore,
  ensureAdminUserRecord,
  ensureUserProfileDoc,
  isRegistrationInProgress,
  updateUserProfileInFirestore,
} from '../services/firebaseService';

export type ThemeMode = 'light' | 'dark';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  currentUser: UserProfile | null;
  firebaseAuthUser: FirebaseUser | null;
  isFirebaseConnected: boolean;
  isAuthLoading: boolean;
  currentView: string;
  selectedComplaintId: string | null;
  complaints: Complaint[];
  staff: MaintenanceStaff[];
  notifications: NotificationItem[];
  setCurrentView: (view: string, complaintId?: string | null) => void;
  login: (role: UserRole, customData?: Partial<UserProfile>) => Promise<void>;
  loginEmailPassword: (email: string, pass: string) => Promise<void>;
  registerEmailPassword: (
    email: string,
    pass: string,
    profileData: Partial<UserProfile>
  ) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  registerStudent: (data: Partial<UserProfile>) => void;
  submitComplaint: (complaint: {
    title: string;
    category: Complaint['category'];
    description: string;
    building: string;
    specificLocation: string;
    priority: PriorityLevel;
    images: string[];
  }) => Promise<string>;
  updateComplaintStatus: (
    complaintId: string,
    status: ComplaintStatus,
    remarks?: string
  ) => Promise<void>;
  updateComplaintPriority: (complaintId: string, priority: PriorityLevel) => Promise<void>;
  assignStaff: (complaintId: string, staffId: string) => Promise<void>;
  confirmResolution: (
    complaintId: string,
    rating: number,
    feedback: string
  ) => Promise<void>;
  reopenComplaint: (complaintId: string, reason: string) => Promise<void>;
  addStaffMember: (
    staffData: Omit<
      MaintenanceStaff,
      'id' | 'activeTaskCount' | 'completedTaskCount' | 'rating'
    >
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role?: UserRole) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fixora_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = theme;
    localStorage.setItem('fixora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [firebaseAuthUser, setFirebaseAuthUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Current active user profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fixora_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile;
        if (
          parsed?.avatar &&
          (parsed.avatar.includes('/src/assets/images/avatar_') ||
            parsed.avatar.includes('avatar_student_lead_') ||
            parsed.avatar.includes('avatar_maintenance_staff_'))
        ) {
          parsed.avatar = '';
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
    return null;
  });

  const [currentView, setCurrentViewState] = useState<string>('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [staff, setStaff] = useState<MaintenanceStaff[]>(INITIAL_STAFF);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Test connection and listen to Auth state
  useEffect(() => {
    testConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseAuthUser(user);
      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid);
          if (profile) {
            setCurrentUser(profile);
            localStorage.setItem('fixora_current_user', JSON.stringify(profile));
          } else if (!isRegistrationInProgress()) {
            // Self-heal missing Firestore user document (e.g. if earlier signup write was interrupted)
            const createdProfile = await ensureUserProfileDoc(user);
            setCurrentUser(createdProfile);
            localStorage.setItem('fixora_current_user', JSON.stringify(createdProfile));
          }
          // Ensure super admin record is registered in Firestore
          ensureAdminUserRecord();
        } catch (err) {
          console.error('Error restoring user profile from Firestore', err);
        }
      } else {
        // Clear authenticated profile if Firebase user is logged out
        setCurrentUser((prev) => {
          if (prev && !prev.id.startsWith('usr_stu_') && !prev.id.startsWith('usr_adm_') && !prev.id.startsWith('usr_warden_')) {
            localStorage.removeItem('fixora_current_user');
            return null;
          }
          return prev;
        });
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync current user to local cache for offline reliability
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fixora_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fixora_current_user');
    }
  }, [currentUser]);

  // Real-time Firestore Subscriptions (only when genuinely authenticated with Firebase)
  useEffect(() => {
    if (!auth.currentUser || !currentUser) {
      return;
    }

    const unsubComplaints = subscribeToComplaints(currentUser, (liveComplaints) => {
      setComplaints(liveComplaints || []);
    });

    const unsubNotifs = subscribeToNotifications(currentUser, (liveNotifs) => {
      setNotifications(liveNotifs || []);
    });

    return () => {
      unsubComplaints();
      unsubNotifs();
    };
  }, [currentUser, firebaseAuthUser]);

  const setCurrentView = (view: string, complaintId?: string | null) => {
    setCurrentViewState(view);
    if (complaintId !== undefined) {
      setSelectedComplaintId(complaintId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getHomeViewForRole = (role?: UserRole) =>
    role === 'admin' || role === 'warden' || role === 'maintenance_staff'
      ? 'admin-dashboard'
      : 'student-dashboard';

  // Email / Password Login
  const loginEmailPassword = async (email: string, pass: string) => {
    try {
      const profile = await loginWithEmail(email, pass);
      setCurrentUser(profile);
      setSelectedComplaintId(null);
      setCurrentViewState(getHomeViewForRole(profile.role));
    } catch (err) {
      console.error('Login error', err);
      throw err;
    }
  };

  // Email / Password Registration
  const registerEmailPassword = async (
    email: string,
    pass: string,
    profileData: Partial<UserProfile>
  ) => {
    try {
      const profile = await registerWithEmail(email, pass, profileData);
      setCurrentUser(profile);
      setSelectedComplaintId(null);
      setCurrentViewState(getHomeViewForRole(profile.role));
    } catch (err) {
      console.error('Registration error', err);
      throw err;
    }
  };

  // Demo 1-Click Login (preserves evaluator experience with realistic profile)
  const login = async (role: UserRole, customData?: Partial<UserProfile>) => {
    let profile: UserProfile;
    if (role === 'admin') {
      profile = {
        ...DEMO_ADMIN,
        uid: 'usr_adm_001',
        ...(customData || {}),
      };
      setCurrentUser(profile);
      setCurrentViewState('admin-dashboard');
    } else if (role === 'warden') {
      profile = {
        id: 'usr_warden_001',
        uid: 'usr_warden_001',
        role: 'warden',
        name: 'Prof. S. N. Joshi',
        email: 'warden.blocka@campus.edu',
        avatar: '',
        phone: '+91 98220 55443',
        department: 'Hostel Administration',
        assignedHostel: 'LH-1 (Ladies Hostel Block 1)',
        assignedBlocks: 'LH-1, Floors 1-5',
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
        ...(customData || {}),
      };
      setCurrentUser(profile);
      setCurrentViewState('admin-dashboard');
    } else {
      profile = {
        ...DEMO_STUDENT,
        uid: 'usr_stu_101',
        ...(customData || {}),
      };
      setCurrentUser(profile);
      setCurrentViewState('student-dashboard');
    }
    setSelectedComplaintId(null);
  };

  const logout = async () => {
    try {
      await firebaseLogout();
    } catch (err) {
      console.log('Firebase logout completed or was not active.', err);
    }
    setFirebaseAuthUser(null);
    setCurrentUser(null);
    localStorage.removeItem('fixora_current_user');
    setCurrentViewState('landing');
    setSelectedComplaintId(null);
  };

  const switchRole = (targetRole: UserRole) => {
    login(targetRole);
  };

  const registerStudent = (data: Partial<UserProfile>) => {
    const isDayScholar = data.studentType === 'Day Scholar';
    const newStudent: UserProfile = {
      id: `usr_stu_${Date.now().toString().slice(-4)}`,
      uid: `usr_stu_${Date.now().toString().slice(-4)}`,
      role: 'student',
      name: data.name || 'New Student',
      email: data.email || 'student@campus.edu',
      avatar: data.avatar || '',
      phone: data.phone || '+91 98000 00000',
      department: data.department || 'Computer Science & Engineering',
      studentId: data.studentId || `STU-${new Date().getFullYear()}-001`,
      yearOfStudy: data.yearOfStudy || '1st Year',
      studentType: isDayScholar ? 'Day Scholar' : 'Hosteller',
      hostelBlock: isDayScholar
        ? 'Day Scholar (Off-Campus)'
        : data.hostelBlock || 'LH-1 (Ladies Hostel Block 1)',
      roomNumber: isDayScholar
        ? data.roomNumber || 'Day Scholar'
        : data.roomNumber || 'Room 101',
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newStudent);
    setCurrentViewState('student-dashboard');
  };

  // Complaint Operations with Cloud Firestore Real-Time Persistence
  const submitComplaint = async (data: {
    title: string;
    category: Complaint['category'];
    description: string;
    building: string;
    specificLocation: string;
    priority: PriorityLevel;
    images: string[];
  }): Promise<string> => {
    const activeStudent = currentUser || {
      ...DEMO_STUDENT,
      uid: 'usr_stu_101',
    };

    try {
      const generatedId = await createComplaintInFirestore(data, activeStudent);
      return generatedId;
    } catch (err) {
      console.error('Firestore complaint creation error', err);
      // Fallback local update
      const now = new Date().toISOString();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const complaintId = `FIX-${new Date().getFullYear()}-${randomSuffix}`;
      const fallbackItem: Complaint = {
        id: complaintId,
        title: data.title,
        category: data.category,
        description: data.description,
        building: data.building,
        specificLocation: data.specificLocation,
        images: data.images,
        priority: data.priority,
        status: 'Submitted',
        studentId: activeStudent.studentId || 'STU-CS-084',
        studentUid: activeStudent.uid,
        studentName: activeStudent.name,
        studentEmail: activeStudent.email,
        studentPhone: activeStudent.phone,
        createdAt: now,
        updatedAt: now,
        timeline: [
          {
            id: `t-${Date.now()}`,
            timestamp: now,
            status: 'Submitted',
            title: 'Complaint Submitted',
            description: `Reported by ${activeStudent.name}. Priority: ${data.priority}`,
            actorName: activeStudent.name,
            actorRole: 'student',
          },
        ],
      };
      setComplaints((prev) => [fallbackItem, ...prev]);
      return complaintId;
    }
  };

  const updateComplaintStatus = async (
    complaintId: string,
    status: ComplaintStatus,
    remarks?: string
  ) => {
    const target = complaints.find((c) => c.id === complaintId);
    if (!target) return;

    const activeUser = currentUser || {
      ...DEMO_ADMIN,
      uid: 'usr_adm_001',
    };

    try {
      await updateComplaintStatusInFirestore(
        complaintId,
        status,
        remarks || '',
        activeUser,
        target
      );
    } catch (err) {
      console.error('Firestore status update error', err);
      // Fallback local update
      const now = new Date().toISOString();
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;
          return {
            ...c,
            status,
            updatedAt: now,
            resolvedAt: status === 'Resolved' ? now : c.resolvedAt,
            resolutionRemarks: remarks || c.resolutionRemarks,
            timeline: [
              ...c.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: now,
                status,
                title: `Status updated to ${status}`,
                description: remarks || `Status set to ${status}`,
                actorName: activeUser.name,
                actorRole: activeUser.role as 'student' | 'admin' | 'staff' | 'warden',
              },
            ],
          };
        })
      );
    }
  };

  const updateComplaintPriority = async (complaintId: string, priority: PriorityLevel) => {
    const target = complaints.find((c) => c.id === complaintId);
    if (!target) return;

    const activeUser = currentUser || {
      ...DEMO_ADMIN,
      uid: 'usr_adm_001',
    };

    if (auth.currentUser) {
      try {
        await updateComplaintPriorityInFirestore(
          complaintId,
          priority,
          activeUser,
          target
        );
        return;
      } catch (err) {
        console.error('Firestore priority update error', err);
      }
    }

    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              priority,
              updatedAt: now,
              timeline: [
                ...c.timeline,
                {
                  id: `t-${Date.now()}`,
                  timestamp: now,
                  status: c.status,
                  title: `Priority updated to ${priority}`,
                  description: `Changed priority from ${c.priority} to ${priority} by ${activeUser.name}`,
                  actorName: activeUser.name,
                  actorRole: (activeUser.role === 'maintenance_staff' ? 'staff' : activeUser.role) as
                    | 'student'
                    | 'admin'
                    | 'staff'
                    | 'warden',
                },
              ],
            }
          : c
      )
    );
  };

  const assignStaff = async (complaintId: string, staffId: string) => {
    const assignedMember = staff.find((s) => s.id === staffId);
    const target = complaints.find((c) => c.id === complaintId);
    if (!assignedMember || !target) return;

    const activeUser = currentUser || {
      ...DEMO_ADMIN,
      uid: 'usr_adm_001',
    };

    try {
      await assignStaffInFirestore(complaintId, assignedMember, activeUser, target);
    } catch (err) {
      console.error('Firestore assign staff error', err);
      const now = new Date().toISOString();
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;
          return {
            ...c,
            status: 'Assigned',
            assignedStaffId: assignedMember.id,
            assignedStaffName: assignedMember.name,
            assignedStaffPhone: assignedMember.phone,
            assignedStaffSpecialty: assignedMember.specialty,
            updatedAt: now,
            timeline: [
              ...c.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: now,
                status: 'Assigned',
                title: `Assigned to ${assignedMember.name}`,
                description: `Assigned to ${assignedMember.name} (${assignedMember.specialty})`,
                actorName: activeUser.name,
                actorRole: 'admin',
              },
            ],
          };
        })
      );
    }
  };

  const confirmResolution = async (
    complaintId: string,
    rating: number,
    feedback: string
  ) => {
    const target = complaints.find((c) => c.id === complaintId);
    if (!target) return;

    const activeUser = currentUser || {
      ...DEMO_STUDENT,
      uid: 'usr_stu_101',
    };

    try {
      await confirmResolutionInFirestore(
        complaintId,
        rating,
        feedback,
        activeUser,
        target
      );
    } catch (err) {
      console.error('Firestore resolution confirm error', err);
      const now = new Date().toISOString();
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;
          return {
            ...c,
            resolutionConfirmedByStudent: true,
            studentRating: rating,
            studentFeedback: feedback,
            updatedAt: now,
            timeline: [
              ...c.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: now,
                status: 'Resolved',
                title: `Resolution Confirmed by Student (${rating} ★)`,
                description: feedback || 'Student confirmed the fix.',
                actorName: activeUser.name,
                actorRole: 'student',
              },
            ],
          };
        })
      );
    }
  };

  const reopenComplaint = async (complaintId: string, reason: string) => {
    const target = complaints.find((c) => c.id === complaintId);
    if (!target) return;

    const activeUser = currentUser || {
      ...DEMO_STUDENT,
      uid: 'usr_stu_101',
    };

    try {
      await reopenComplaintInFirestore(complaintId, reason, activeUser, target);
    } catch (err) {
      console.error('Firestore reopen complaint error', err);
      const now = new Date().toISOString();
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;
          return {
            ...c,
            status: 'Reopened',
            reopenedReason: reason,
            resolutionConfirmedByStudent: false,
            updatedAt: now,
            timeline: [
              ...c.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: now,
                status: 'Reopened',
                title: 'Complaint Reopened by Student',
                description: reason,
                actorName: activeUser.name,
                actorRole: 'student',
              },
            ],
          };
        })
      );
    }
  };

  const addStaffMember = (
    staffData: Omit<
      MaintenanceStaff,
      'id' | 'activeTaskCount' | 'completedTaskCount' | 'rating'
    >
  ) => {
    const newStaff: MaintenanceStaff = {
      ...staffData,
      id: `stf_${Date.now().toString().slice(-4)}`,
      activeTaskCount: 0,
      completedTaskCount: 0,
      rating: 5.0,
    };
    setStaff((prev) => [newStaff, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    if (auth.currentUser && target) {
      const isAdmin =
        auth.currentUser.email === 'bhanuvenkatanagesh@gmail.com' ||
        currentUser?.role === 'admin';
      const canUpdate = isAdmin || target.recipientUid === auth.currentUser.uid;
      markNotificationReadInFirestore(id, canUpdate).catch((err) => {
        console.error('Failed to mark notification read in Firestore:', err);
      });
    }
  };

  const markAllNotificationsRead = (role?: UserRole) => {
    const matching = notifications.filter(
      (n) => !n.isRead && (!role || n.recipientRole === role || n.recipientRole === 'all')
    );
    setNotifications((prev) =>
      prev.map((n) => {
        if (!role || n.recipientRole === role || n.recipientRole === 'all') {
          return { ...n, isRead: true };
        }
        return n;
      })
    );
    if (auth.currentUser && matching.length > 0) {
      markAllNotificationsReadInFirestore(matching, currentUser).catch((err) => {
        console.error('Failed to mark all notifications read in Firestore:', err);
      });
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const modified = { ...currentUser, ...updated };
    setCurrentUser(modified);
    if (auth.currentUser && auth.currentUser.uid === currentUser.uid) {
      updateUserProfileInFirestore(auth.currentUser.uid, updated).catch((err) => {
        console.error('Failed to sync profile update to Firestore:', err);
      });
    }
  };

  const resetDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setStaff(INITIAL_STAFF);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        firebaseAuthUser,
        isFirebaseConnected,
        isAuthLoading,
        currentView,
        selectedComplaintId,
        complaints,
        staff,
        notifications,
        setCurrentView,
        login,
        loginEmailPassword,
        registerEmailPassword,
        logout,
        switchRole,
        registerStudent,
        submitComplaint,
        updateComplaintStatus,
        updateComplaintPriority,
        assignStaff,
        confirmResolution,
        reopenComplaint,
        addStaffMember,
        markNotificationRead,
        markAllNotificationsRead,
        updateProfile,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
