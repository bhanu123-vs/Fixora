import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import {
  HOSTEL_BLOCKS,
  LADIES_HOSTELS,
  MENS_HOSTELS,
  ACADEMIC_AND_CAMPUS_BLOCKS,
} from '../../data/mockData';
import { StudentType } from '../../types';
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  Save,
  ArrowRightLeft,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, firebaseAuthUser, updateProfile, switchRole } = useApp();

  const role = currentUser?.role || 'student';
  const isStudent = role === 'student';
  const isWarden = role === 'warden';
  const isStaff = role === 'maintenance_staff';

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [department, setDepartment] = useState(currentUser?.department || '');

  // Student specific
  const [studentId, setStudentId] = useState(currentUser?.studentId || '');
  const [yearOfStudy, setYearOfStudy] = useState(currentUser?.yearOfStudy || '');
  const [studentType, setStudentType] = useState<StudentType>(
    currentUser?.studentType === 'Day Scholar' ||
      currentUser?.hostelBlock?.includes('Day Scholar')
      ? 'Day Scholar'
      : 'Hosteller'
  );
  const [hostelBlock, setHostelBlock] = useState(
    currentUser?.hostelBlock && HOSTEL_BLOCKS.includes(currentUser.hostelBlock)
      ? currentUser.hostelBlock
      : HOSTEL_BLOCKS[0]
  );
  const [roomNumber, setRoomNumber] = useState(currentUser?.roomNumber || '');

  // Admin / Warden / Staff specific
  const [adminId, setAdminId] = useState(currentUser?.adminId || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');
  const [assignedHostel, setAssignedHostel] = useState(
    currentUser?.assignedHostel || HOSTEL_BLOCKS[0]
  );
  const [specialty, setSpecialty] = useState(currentUser?.specialty || 'General Maintenance');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const isDS =
      currentUser.studentType === 'Day Scholar' ||
      Boolean(currentUser.hostelBlock?.includes('Day Scholar'));
    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setPhone(currentUser.phone || '');
    setDepartment(currentUser.department || '');
    setStudentId(currentUser.studentId || '');
    setYearOfStudy(currentUser.yearOfStudy || '1st Year (B.Tech)');
    setStudentType(isDS ? 'Day Scholar' : 'Hosteller');
    setHostelBlock(
      currentUser.hostelBlock && HOSTEL_BLOCKS.includes(currentUser.hostelBlock)
        ? currentUser.hostelBlock
        : HOSTEL_BLOCKS[0]
    );
    setRoomNumber(
      isDS && currentUser.roomNumber === 'Day Scholar'
        ? ''
        : currentUser.roomNumber || ''
    );
    setAdminId(currentUser.adminId || '');
    setDesignation(currentUser.designation || '');
    setAssignedHostel(currentUser.assignedHostel || currentUser.hostelBlock || HOSTEL_BLOCKS[0]);
    setSpecialty(currentUser.specialty || 'General Maintenance');
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isStudent) {
      const isDS = studentType === 'Day Scholar';
      updateProfile({
        name,
        ...(firebaseAuthUser ? {} : { email }),
        phone,
        department,
        studentId,
        yearOfStudy,
        studentType,
        hostelBlock: isDS ? 'Day Scholar (Off-Campus)' : hostelBlock,
        roomNumber: isDS ? roomNumber.trim() || 'Day Scholar' : roomNumber,
      });
    } else if (isWarden) {
      updateProfile({
        name,
        ...(firebaseAuthUser ? {} : { email }),
        phone,
        department,
        assignedHostel,
      });
    } else if (isStaff) {
      updateProfile({
        name,
        ...(firebaseAuthUser ? {} : { email }),
        phone,
        department,
        specialty,
      });
    } else {
      updateProfile({
        name,
        ...(firebaseAuthUser ? {} : { email }),
        phone,
        department,
        adminId,
        designation,
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const roleBadgeLabel = isStudent
    ? 'Student Account'
    : isWarden
    ? 'Hostel Warden'
    : isStaff
    ? 'Maintenance Staff'
    : 'Campus Administrator';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {isStudent
              ? 'Student Profile & Residence'
              : isWarden
              ? 'Hostel Warden Profile'
              : isStaff
              ? 'Maintenance Staff Profile'
              : 'Administrator Credentials'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your contact details and room coordinates updated for dispatch accuracy.
          </p>
        </div>

        <button
          onClick={() => switchRole(isStudent ? 'admin' : 'student')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs shrink-0"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-red-700" />
          Switch to {isStudent ? 'Admin Profile' : 'Student Profile'}
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Profile Header Block */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <UserAvatar
            src={currentUser?.avatar}
            name={currentUser?.name}
            sizeClass="w-16 h-16"
            textSizeClass="text-xl"
            className="border-2 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{currentUser?.name}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-100">
                {roleBadgeLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {isStudent
                ? currentUser?.studentId
                : isWarden
                ? currentUser?.assignedHostel
                : isStaff
                ? currentUser?.specialty
                : currentUser?.adminId}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="my-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official College Mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  readOnly={Boolean(firebaseAuthUser)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white ${
                    firebaseAuthUser ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Role Specific Fields */}
          {isStudent ? (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Academic & Hostel Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Roll Number / ID
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="1st Year (B.Tech)">1st Year (B.Tech)</option>
                    <option value="2nd Year (B.Tech)">2nd Year (B.Tech)</option>
                    <option value="3rd Year (B.Tech)">3rd Year (B.Tech)</option>
                    <option value="4th Year (B.Tech)">4th Year (B.Tech)</option>
                    <option value="Postgraduate (M.Tech/Ph.D)">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Category
                  </label>
                  <select
                    value={studentType}
                    onChange={(e) => setStudentType(e.target.value as StudentType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="Hosteller">Hosteller (LH-1 to LH-3 / MH-1 to MH-7)</option>
                    <option value="Day Scholar">Day Scholar (Off-Campus Commuter)</option>
                  </select>
                </div>

                {studentType === 'Hosteller' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hostel Block
                    </label>
                    <select
                      value={hostelBlock}
                      onChange={(e) => setHostelBlock(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                    >
                      <optgroup label="Ladies Hostels (LH-1 to LH-3)">
                        {LADIES_HOSTELS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Men's Hostels (MH-1 to MH-7)">
                        {MENS_HOSTELS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Residence Status
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Day Scholar (Off-Campus)"
                      className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {studentType === 'Day Scholar'
                    ? 'Commute / Bus Route (Optional)'
                    : 'Room Number'}
                </label>
                <input
                  type="text"
                  required={studentType === 'Hosteller'}
                  placeholder={
                    studentType === 'Day Scholar'
                      ? 'e.g. Vijayawada / Bus Route 4 (leave blank if N/A)'
                      : 'e.g. Room 302'
                  }
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>
          ) : isWarden ? (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Warden Hostel Assignment
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Hostel / Block
                </label>
                <select
                  value={assignedHostel}
                  onChange={(e) => setAssignedHostel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <optgroup label="Ladies Hostels (LH-1 to LH-3)">
                    {LADIES_HOSTELS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Men's Hostels (MH-1 to MH-7)">
                    {MENS_HOSTELS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Academic & Campus Facilities">
                    {ACADEMIC_AND_CAMPUS_BLOCKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          ) : isStaff ? (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Maintenance Trade Specialty
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specialty / Trade
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="HVAC / Fan">HVAC / Fan</option>
                  <option value="Network Engineer">Network Engineer</option>
                  <option value="Sanitation Supervisor">Sanitation Supervisor</option>
                  <option value="General Maintenance">General Maintenance</option>
                </select>
              </div>
            </div>
          ) : (
            /* Admin Specific Fields */
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Staff Designation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Identification ID
                  </label>
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
