import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_BUILDINGS } from '../../data/mockData';
import {
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Save,
  ArrowRightLeft,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, switchRole } = useApp();

  const isStudent = currentUser?.role === 'student';

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [department, setDepartment] = useState(currentUser?.department || '');

  // Student specific
  const [studentId, setStudentId] = useState(currentUser?.studentId || '');
  const [yearOfStudy, setYearOfStudy] = useState(currentUser?.yearOfStudy || '');
  const [hostelBlock, setHostelBlock] = useState(currentUser?.hostelBlock || CAMPUS_BUILDINGS[0]);
  const [roomNumber, setRoomNumber] = useState(currentUser?.roomNumber || '');

  // Admin specific
  const [adminId, setAdminId] = useState(currentUser?.adminId || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isStudent) {
      updateProfile({
        name,
        email,
        phone,
        department,
        studentId,
        yearOfStudy,
        hostelBlock,
        roomNumber,
      });
    } else {
      updateProfile({
        name,
        email,
        phone,
        department,
        adminId,
        designation,
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {isStudent ? 'Student Profile & Residence' : 'Administrator Credentials'}
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
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{currentUser?.name}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-100">
                {isStudent ? 'Student Account' : 'Campus Administrator'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {isStudent ? currentUser?.studentId : currentUser?.adminId}
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
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white"
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

          {/* Student Specific Fields */}
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
                    Hostel / Residential Block
                  </label>
                  <select
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    {CAMPUS_BUILDINGS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
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
