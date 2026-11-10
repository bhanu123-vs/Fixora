import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, auth, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  UserProfile,
  Complaint,
  ComplaintStatus,
  PriorityLevel,
  NotificationItem,
  MaintenanceStaff,
  StatusHistoryRecord,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_STAFF,
  INITIAL_NOTIFICATIONS,
  DEMO_STUDENT,
  DEMO_ADMIN,
} from '../data/mockData';

const USERS_COLLECTION = 'users';
const COMPLAINTS_COLLECTION = 'complaints';
const NOTIFICATIONS_COLLECTION = 'notifications';

// AUTHENTICATION FUNCTIONS

export async function loginWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    const user = cred.user;

    // Check if user document already exists in Firestore
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    let userSnap;
    try {
      userSnap = await getDoc(userRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${USERS_COLLECTION}/${user.uid}`);
    }

    if (userSnap && userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }

    // Determine initial role: if runtime admin email, assign admin, else student
    const isAdminEmail = user.email === 'bhanuvenkatanagesh@gmail.com';
    const newProfile: UserProfile = {
      id: user.uid,
      uid: user.uid,
      role: isAdminEmail ? 'admin' : 'student',
      name: user.displayName || (isAdminEmail ? 'Admin User' : 'Campus Student'),
      email: user.email || '',
      avatar: user.photoURL || '/src/assets/images/avatar_student_lead_1794215793948.jpg',
      phone: user.phoneNumber || '+91 98765 00000',
      department: 'Computer Science & Engineering',
      studentId: isAdminEmail ? undefined : `STU-${new Date().getFullYear()}-001`,
      yearOfStudy: isAdminEmail ? undefined : '3rd Year (B.Tech)',
      hostelBlock: 'Hostel Block A (Girls Wing)',
      roomNumber: 'Room 302',
      adminId: isAdminEmail ? 'ADM-FAC-001' : undefined,
      designation: isAdminEmail ? 'Chief Campus Administrator' : undefined,
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(userRef, newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${USERS_COLLECTION}/${user.uid}`);
    }

    return newProfile;
  } catch (error) {
    console.error('Google Sign-in failed', error);
    throw error;
  }
}

export async function registerWithEmail(
  email: string,
  pass: string,
  profileData: Partial<UserProfile>
): Promise<UserProfile> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    const newProfile: UserProfile = {
      id: user.uid,
      uid: user.uid,
      role: profileData.role || 'student',
      name: profileData.name || 'New User',
      email: user.email || email,
      avatar:
        profileData.avatar || '/src/assets/images/avatar_student_lead_1794215793948.jpg',
      phone: profileData.phone || '+91 98765 43210',
      department: profileData.department || 'General Academic',
      studentId: profileData.studentId || `STU-${Date.now().toString().slice(-4)}`,
      yearOfStudy: profileData.yearOfStudy || '1st Year',
      hostelBlock: profileData.hostelBlock || 'Hostel Block A (Girls Wing)',
      roomNumber: profileData.roomNumber || 'Room 101',
      adminId: profileData.role === 'admin' ? profileData.adminId || 'ADM-01' : undefined,
      designation: profileData.designation,
      assignedHostel: profileData.assignedHostel,
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userRef = doc(db, USERS_COLLECTION, user.uid);
    try {
      await setDoc(userRef, newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${USERS_COLLECTION}/${user.uid}`);
    }

    return newProfile;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
}

export async function loginWithEmail(
  email: string,
  pass: string
): Promise<UserProfile> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    const userRef = doc(db, USERS_COLLECTION, user.uid);
    let userSnap;
    try {
      userSnap = await getDoc(userRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${USERS_COLLECTION}/${user.uid}`);
    }

    if (userSnap && userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }

    // Default fallback profile if record wasn't found in Firestore
    const fallback: UserProfile = {
      id: user.uid,
      uid: user.uid,
      role: email.includes('admin') ? 'admin' : 'student',
      name: user.displayName || 'Fixora User',
      email: user.email || email,
      avatar: '/src/assets/images/avatar_student_lead_1794215793948.jpg',
      phone: '+91 98765 00000',
      department: 'Engineering',
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, fallback);
    return fallback;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `${USERS_COLLECTION}/${uid}`;
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// REAL-TIME FIRESTORE SUBSCRIPTIONS

export function subscribeToComplaints(
  currentUser: UserProfile | null,
  callback: (complaints: Complaint[]) => void
): () => void {
  // CRITICAL: Only attach onSnapshot listeners if auth is ready and user is authenticated
  if (!auth.currentUser) {
    return () => {};
  }

  const path = COMPLAINTS_COLLECTION;
  const isSuperAdmin =
    auth.currentUser.email === 'bhanuvenkatanagesh@gmail.com' ||
    currentUser?.role === 'admin';

  let q;
  if (isSuperAdmin) {
    q = collection(db, COMPLAINTS_COLLECTION);
  } else if (currentUser?.role === 'warden' && currentUser.assignedHostel) {
    q = query(
      collection(db, COMPLAINTS_COLLECTION),
      where('building', '==', currentUser.assignedHostel)
    );
  } else if (currentUser?.role === 'maintenance_staff') {
    q = query(
      collection(db, COMPLAINTS_COLLECTION),
      where('assignedStaffUid', '==', auth.currentUser.uid)
    );
  } else {
    // Student: must match rule (resource.data.studentUid == request.auth.uid)
    q = query(
      collection(db, COMPLAINTS_COLLECTION),
      where('studentUid', '==', auth.currentUser.uid)
    );
  }

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items: Complaint[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Complaint;
        items.push({
          ...data,
          id: docSnap.id,
        });
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

export function subscribeToNotifications(
  currentUser: UserProfile | null,
  callback: (notifications: NotificationItem[]) => void
): () => void {
  // CRITICAL: Only attach onSnapshot listeners if auth is ready and user is authenticated
  if (!auth.currentUser) {
    return () => {};
  }

  const path = NOTIFICATIONS_COLLECTION;
  const isSuperAdmin =
    auth.currentUser.email === 'bhanuvenkatanagesh@gmail.com' ||
    currentUser?.role === 'admin';

  let q;
  if (isSuperAdmin) {
    q = collection(db, NOTIFICATIONS_COLLECTION);
  } else {
    q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('recipientUid', '==', auth.currentUser.uid)
    );
  }

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const notifs: NotificationItem[] = [];
      snapshot.forEach((docSnap) => {
        notifs.push({
          ...(docSnap.data() as NotificationItem),
          id: docSnap.id,
        });
      });

      // Sort newest first
      notifs.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      callback(notifs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

// COMPLAINT MUTATIONS

export async function createComplaintInFirestore(
  data: {
    title: string;
    category: Complaint['category'];
    description: string;
    building: string;
    specificLocation: string;
    priority: PriorityLevel;
    images: string[];
  },
  currentUser: UserProfile
): Promise<string> {
  const now = new Date().toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const complaintId = `FIX-${new Date().getFullYear()}-${randomSuffix}`;
  const path = `${COMPLAINTS_COLLECTION}/${complaintId}`;

  const newComplaint: Complaint = {
    id: complaintId,
    title: data.title,
    category: data.category,
    description: data.description,
    building: data.building,
    specificLocation: data.specificLocation,
    images: data.images.length > 0 ? data.images : [],
    priority: data.priority,
    status: 'Submitted',
    studentId: currentUser.studentId || 'STU-GEN',
    studentUid: currentUser.uid,
    studentName: currentUser.name,
    studentEmail: currentUser.email,
    studentPhone: currentUser.phone,
    createdAt: now,
    updatedAt: now,
    timeline: [
      {
        id: `t-${Date.now()}`,
        timestamp: now,
        status: 'Submitted',
        title: 'Complaint Submitted',
        description: `Logged in central queue under ${data.category}. Priority: ${data.priority}`,
        actorName: currentUser.name,
        actorRole: 'student',
      },
    ],
  };

  try {
    await setDoc(doc(db, COMPLAINTS_COLLECTION, complaintId), newComplaint);

    // Write audit subcollection doc
    const historyRef = doc(
      db,
      COMPLAINTS_COLLECTION,
      complaintId,
      'statusHistory',
      `hist_${Date.now()}`
    );
    await setDoc(historyRef, {
      id: `hist_${Date.now()}`,
      complaintId,
      previousStatus: '',
      newStatus: 'Submitted',
      updatedByUid: currentUser.uid,
      updatedByName: currentUser.name,
      updatedByRole: currentUser.role,
      remarks: 'Initial complaint registration',
      timestamp: now,
    });

    // Notify Student
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, `notif_st_${Date.now()}`), {
      id: `notif_st_${Date.now()}`,
      recipientRole: 'student',
      recipientUid: currentUser.uid,
      complaintId,
      title: 'Complaint Registered in Cloud Firestore',
      message: `Your complaint "${data.title}" was logged. Tracking ID: ${complaintId}.`,
      type: 'submission',
      timestamp: now,
      isRead: false,
    });

    // Notify Admin & Warden
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, `notif_adm_${Date.now()}`), {
      id: `notif_adm_${Date.now()}`,
      recipientRole: data.priority === 'Urgent' ? 'all' : 'admin',
      complaintId,
      title:
        data.priority === 'Urgent'
          ? '🚨 Urgent Complaint Received'
          : 'New Complaint Submitted',
      message: `${currentUser.name} reported "${data.title}" at ${data.building} (${data.priority} priority).`,
      type: data.priority === 'Urgent' ? 'urgent' : 'submission',
      timestamp: now,
      isRead: false,
    });

    return complaintId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return complaintId;
  }
}

export async function updateComplaintStatusInFirestore(
  complaintId: string,
  newStatus: ComplaintStatus,
  remarks: string,
  currentUser: UserProfile,
  existingComplaint: Complaint
): Promise<void> {
  const now = new Date().toISOString();
  const path = `${COMPLAINTS_COLLECTION}/${complaintId}`;

  const updatedTimeline = [
    ...(existingComplaint.timeline || []),
    {
      id: `t-${Date.now()}`,
      timestamp: now,
      status: newStatus,
      title: `Status updated to ${newStatus}`,
      description:
        remarks || `Status updated to ${newStatus} by ${currentUser.name}`,
      actorName: currentUser.name,
      actorRole: currentUser.role as 'student' | 'admin' | 'staff' | 'warden',
    },
  ];

  const updatePayload: Partial<Complaint> = {
    status: newStatus,
    updatedAt: now,
    timeline: updatedTimeline,
  };

  if (newStatus === 'Resolved') {
    updatePayload.resolvedAt = now;
    updatePayload.resolutionRemarks = remarks;
    updatePayload.resolutionConfirmedByStudent = false;
  }

  try {
    await updateDoc(doc(db, COMPLAINTS_COLLECTION, complaintId), updatePayload);

    // Audit status history subcollection
    const historyRef = doc(
      db,
      COMPLAINTS_COLLECTION,
      complaintId,
      'statusHistory',
      `hist_${Date.now()}`
    );
    await setDoc(historyRef, {
      id: `hist_${Date.now()}`,
      complaintId,
      previousStatus: existingComplaint.status,
      newStatus,
      updatedByUid: currentUser.uid,
      updatedByName: currentUser.name,
      updatedByRole: currentUser.role,
      remarks: remarks || `Transition to ${newStatus}`,
      timestamp: now,
    });

    // Notify student
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, `notif_st_${Date.now()}`), {
      id: `notif_st_${Date.now()}`,
      recipientRole: 'student',
      recipientUid: existingComplaint.studentUid,
      complaintId,
      title:
        newStatus === 'Resolved'
          ? 'Issue Resolved - Please Confirm'
          : `Status Updated: ${newStatus}`,
      message:
        newStatus === 'Resolved'
          ? `Your ticket "${existingComplaint.title}" was marked resolved. Please confirm or reopen.`
          : `Status transitioned to "${newStatus}" by campus facility office.`,
      type: newStatus === 'Resolved' ? 'resolved' : 'status_change',
      timestamp: now,
      isRead: false,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function assignStaffInFirestore(
  complaintId: string,
  staffMember: MaintenanceStaff,
  currentUser: UserProfile,
  existingComplaint: Complaint
): Promise<void> {
  const now = new Date().toISOString();
  const path = `${COMPLAINTS_COLLECTION}/${complaintId}`;

  const updatedTimeline = [
    ...(existingComplaint.timeline || []),
    {
      id: `t-${Date.now()}`,
      timestamp: now,
      status: 'Assigned' as ComplaintStatus,
      title: `Assigned to ${staffMember.name}`,
      description: `Dispatched ${staffMember.name} (${staffMember.specialty}). Phone: ${staffMember.phone}`,
      actorName: currentUser.name,
      actorRole: currentUser.role as 'admin' | 'warden',
    },
  ];

  try {
    await updateDoc(doc(db, COMPLAINTS_COLLECTION, complaintId), {
      status: 'Assigned',
      assignedStaffId: staffMember.id,
      assignedStaffUid: staffMember.uid || staffMember.id,
      assignedStaffName: staffMember.name,
      assignedStaffPhone: staffMember.phone,
      assignedStaffSpecialty: staffMember.specialty,
      updatedAt: now,
      timeline: updatedTimeline,
    });

    // Notify student
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, `notif_as_${Date.now()}`), {
      id: `notif_as_${Date.now()}`,
      recipientRole: 'student',
      recipientUid: existingComplaint.studentUid,
      complaintId,
      title: 'Technician Assigned',
      message: `${staffMember.name} (${staffMember.specialty}) has been assigned to your ticket.`,
      type: 'assignment',
      timestamp: now,
      isRead: false,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function confirmResolutionInFirestore(
  complaintId: string,
  rating: number,
  feedback: string,
  currentUser: UserProfile,
  existingComplaint: Complaint
): Promise<void> {
  const now = new Date().toISOString();
  const path = `${COMPLAINTS_COLLECTION}/${complaintId}`;

  const updatedTimeline = [
    ...(existingComplaint.timeline || []),
    {
      id: `t-${Date.now()}`,
      timestamp: now,
      status: 'Resolved' as ComplaintStatus,
      title: `Resolution Confirmed by Student (${rating} ★)`,
      description: feedback || 'Student verified successful fix.',
      actorName: currentUser.name,
      actorRole: 'student' as const,
    },
  ];

  try {
    await updateDoc(doc(db, COMPLAINTS_COLLECTION, complaintId), {
      resolutionConfirmedByStudent: true,
      studentRating: rating,
      studentFeedback: feedback,
      updatedAt: now,
      timeline: updatedTimeline,
    });

    // Notify admin
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, `notif_conf_${Date.now()}`), {
      id: `notif_conf_${Date.now()}`,
      recipientRole: 'admin',
      complaintId,
      title: 'Student Confirmed Resolution',
      message: `${currentUser.name} rated ticket ${complaintId} with ${rating} stars.`,
      type: 'resolved',
      timestamp: now,
      isRead: false,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function reopenComplaintInFirestore(
  complaintId: string,
  reason: string,
  currentUser: UserProfile,
  existingComplaint: Complaint
): Promise<void> {
  const now = new Date().toISOString();
  const path = `${COMPLAINTS_COLLECTION}/${complaintId}`;

  const updatedTimeline = [
    ...(existingComplaint.timeline || []),
    {
      id: `t-${Date.now()}`,
      timestamp: now,
      status: 'Reopened' as ComplaintStatus,
      title: 'Complaint Reopened by Student',
      description: reason || 'Issue was not completely resolved.',
      actorName: currentUser.name,
      actorRole: 'student' as const,
    },
  ];

  try {
    await updateDoc(doc(db, COMPLAINTS_COLLECTION, complaintId), {
      status: 'Reopened',
      reopenedReason: reason,
      resolutionConfirmedByStudent: false,
      updatedAt: now,
      timeline: updatedTimeline,
    });

    // Notify admin
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, `notif_reop_${Date.now()}`), {
      id: `notif_reop_${Date.now()}`,
      recipientRole: 'admin',
      complaintId,
      title: '⚠️ Complaint Reopened by Student',
      message: `${currentUser.name} reopened ticket ${complaintId}: "${reason.slice(0, 80)}"`,
      type: 'reopened',
      timestamp: now,
      isRead: false,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// FIREBASE STORAGE IMAGE UPLOAD
export async function uploadComplaintImageToStorage(
  file: File,
  complaintPrefix: string = 'complaint'
): Promise<string> {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `complaints/${complaintPrefix}_${Date.now()}_${cleanFileName}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = await uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'image/jpeg',
    });
    const downloadUrl = await getDownloadURL(uploadTask.ref);
    return downloadUrl;
  } catch (storageError) {
    console.warn('Firebase Storage upload notice, using DataURL fallback:', storageError);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.readAsDataURL(file);
    });
  }
}

// ENSURE ADMIN PROFILE EXISTS IN FIRESTORE (No mock data seeding)
export async function ensureAdminUserRecord(): Promise<void> {
  if (!auth.currentUser || auth.currentUser.email !== 'bhanuvenkatanagesh@gmail.com') {
    return;
  }
  try {
    const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        id: auth.currentUser.uid,
        uid: auth.currentUser.uid,
        role: 'admin',
        name: auth.currentUser.displayName || 'Bhanu (Chief Administrator)',
        email: auth.currentUser.email,
        department: 'VIT-AP Campus Estate & Facilities Office',
        adminId: 'VITAP-ADMIN-001',
        designation: 'Director of Campus Infrastructure',
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('Verified super admin record in Firestore.');
    }
  } catch (error) {
    console.log('Admin record verification check:', error);
  }
}
