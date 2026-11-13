import { UserProfile, MaintenanceStaff, Complaint, NotificationItem } from '../types';

export const DEMO_STUDENT: UserProfile = {
  id: 'usr_stu_101',
  role: 'student',
  name: 'Priya Sharma',
  email: 'priya.sharma22@vitap.ac.in',
  avatar: '',
  phone: '+91 98765 43210',
  department: 'SCOPE (Computer Science & Engineering)',
  studentId: '22BCE1084',
  yearOfStudy: '3rd Year (B.Tech CSE)',
  studentType: 'Hosteller',
  hostelBlock: 'LH-1 (Ladies Hostel Block 1)',
  roomNumber: 'Room 302',
};

export const DEMO_ADMIN: UserProfile = {
  id: 'usr_adm_001',
  role: 'admin',
  name: 'Dr. Rajesh Kulkarni',
  email: 'estate.director@vitap.ac.in',
  avatar: '',
  phone: '+91 863 2399999',
  department: 'VIT-AP Campus Estate & Facilities Office',
  adminId: 'VITAP-EST-014',
  designation: 'Director of Campus Infrastructure & Chief Warden',
};

export const LADIES_HOSTELS = [
  'LH-1 (Ladies Hostel Block 1)',
  'LH-2 (Ladies Hostel Block 2)',
  'LH-3 (Ladies Hostel Block 3)',
];

export const MENS_HOSTELS = [
  "MH-1 (Men's Hostel Block 1)",
  "MH-2 (Men's Hostel Block 2)",
  "MH-3 (Men's Hostel Block 3)",
  "MH-4 (Men's Hostel Block 4)",
  "MH-5 (Men's Hostel Block 5)",
  "MH-6 (Men's Hostel Block 6)",
  "MH-7 (Men's Hostel Block 7)",
];

export const HOSTEL_BLOCKS = [...LADIES_HOSTELS, ...MENS_HOSTELS];

export const ACADEMIC_AND_CAMPUS_BLOCKS = [
  'Mahatma Gandhi Block (Central Block)',
  'Academic Block 1 (Sarvepalli Radhakrishnan Block)',
  'Academic Block 2 (Newton Block)',
  'Central Library & Auditorium Complex',
  'Rock Plaza & Student Activity Center (SAC)',
  'Central Dining & Multi-Cuisine Food Court',
  'Campus Transport / Bus Bay & Parking Area',
];

export const CAMPUS_BUILDINGS = [
  ...HOSTEL_BLOCKS,
  ...ACADEMIC_AND_CAMPUS_BLOCKS,
];

export const INITIAL_STAFF: MaintenanceStaff[] = [
  {
    id: 'stf_01',
    name: 'Sunil Verma',
    specialty: 'Electrician',
    phone: '+91 94140 22331',
    email: 'sunil.electric@campus.edu',
    shift: 'Morning (8 AM - 4 PM)',
    avatar: '',
    activeTaskCount: 0,
    completedTaskCount: 0,
    rating: 5.0,
  },
  {
    id: 'stf_02',
    name: 'Ramesh Kumar',
    specialty: 'Plumber',
    phone: '+91 94140 55662',
    email: 'ramesh.plumb@campus.edu',
    shift: 'Morning (8 AM - 4 PM)',
    avatar: '',
    activeTaskCount: 0,
    completedTaskCount: 0,
    rating: 5.0,
  },
  {
    id: 'stf_03',
    name: 'Deepak Mehta',
    specialty: 'Network Engineer',
    phone: '+91 98231 77889',
    email: 'deepak.netops@campus.edu',
    shift: 'Flexible / On-Call',
    avatar: '',
    activeTaskCount: 0,
    completedTaskCount: 0,
    rating: 5.0,
  },
  {
    id: 'stf_04',
    name: 'Anil Pathak',
    specialty: 'HVAC / Fan',
    phone: '+91 97120 44556',
    email: 'anil.hvac@campus.edu',
    shift: 'Morning (8 AM - 4 PM)',
    avatar: '',
    activeTaskCount: 0,
    completedTaskCount: 0,
    rating: 5.0,
  },
  {
    id: 'stf_05',
    name: 'Vikram Rathore',
    specialty: 'Carpenter',
    phone: '+91 98901 33445',
    email: 'vikram.carpentry@campus.edu',
    shift: 'Evening (2 PM - 10 PM)',
    avatar: '',
    activeTaskCount: 0,
    completedTaskCount: 0,
    rating: 5.0,
  },
  {
    id: 'stf_06',
    name: 'Rajesh Meena',
    specialty: 'Sanitation Supervisor',
    phone: '+91 99887 66554',
    email: 'rajesh.sanitation@campus.edu',
    shift: 'Morning (8 AM - 4 PM)',
    avatar: '',
    activeTaskCount: 0,
    completedTaskCount: 0,
    rating: 5.0,
  },
];

// REAL-WORLD LIVE SYSTEM: Starts with 0 complaints until reported in Firestore
export const INITIAL_COMPLAINTS: Complaint[] = [];

// REAL-WORLD LIVE SYSTEM: Starts with 0 notifications until events trigger in Firestore
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
