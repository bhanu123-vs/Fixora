export type UserRole = 'student' | 'warden' | 'admin' | 'maintenance_staff';

export interface UserProfile {
  id: string;
  uid?: string;
  role: UserRole;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  department: string;
  studentId?: string;
  yearOfStudy?: string;
  hostelBlock?: string;
  hostel?: string;
  roomNumber?: string;
  adminId?: string;
  designation?: string;
  assignedHostel?: string;
  assignedBlocks?: string;
  specialty?: string;
  accountStatus?: 'active' | 'pending' | 'deactivated';
  createdAt?: string;
  updatedAt?: string;
}

export type IssueCategory =
  | 'Wi-Fi / Internet'
  | 'Electricity'
  | 'Water Supply'
  | 'Cleanliness'
  | 'Plumbing'
  | 'Furniture'
  | 'Classroom Infrastructure'
  | 'Hostel Maintenance'
  | 'Other';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Reopened'
  | 'Closed';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  actorName: string;
  actorRole: 'student' | 'admin' | 'warden' | 'staff';
}

export interface StatusHistoryRecord {
  id: string;
  complaintId: string;
  previousStatus: string;
  newStatus: string;
  updatedByUid: string;
  updatedByName: string;
  updatedByRole: string;
  remarks: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  building: string;
  specificLocation: string;
  images: string[];
  priority: PriorityLevel;
  status: ComplaintStatus;
  studentId: string;
  studentUid?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  assignedWardenUid?: string;
  assignedStaffId?: string;
  assignedStaffUid?: string;
  assignedStaffName?: string;
  assignedStaffPhone?: string;
  assignedStaffSpecialty?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionRemarks?: string;
  resolutionConfirmedByStudent?: boolean;
  studentRating?: number;
  studentFeedback?: string;
  reopenedReason?: string;
  timeline: TimelineEvent[];
}

export interface MaintenanceStaff {
  id: string;
  name: string;
  specialty:
    | 'Electrician'
    | 'Plumber'
    | 'Carpenter'
    | 'HVAC / Fan'
    | 'Network Engineer'
    | 'Sanitation Supervisor'
    | 'General Maintenance';
  phone: string;
  email: string;
  shift: string;
  avatar: string;
  activeTaskCount: number;
  completedTaskCount: number;
  rating: number;
  uid?: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: 'student' | 'warden' | 'admin' | 'maintenance_staff' | 'all';
  recipientUserId?: string;
  recipientUid?: string;
  complaintId?: string;
  title: string;
  message: string;
  type: 'submission' | 'status_change' | 'assignment' | 'resolved' | 'reopened' | 'urgent';
  timestamp: string;
  isRead: boolean;
}

export interface HostelRecord {
  id: string;
  name: string;
  type: 'Boys' | 'Girls' | 'Co-Ed' | 'Faculty';
  totalRooms: number;
  wardenName: string;
  wardenUid?: string;
}
