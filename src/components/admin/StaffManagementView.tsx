import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import { MaintenanceStaff } from '../../types';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Clock,
  Star,
  CheckCircle2,
  Wrench,
  X,
  ListTodo,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const StaffManagementView: React.FC = () => {
  const { staff, complaints, addStaffMember, setCurrentView } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // New staff form state
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState<MaintenanceStaff['specialty']>('Electrician');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shift, setShift] = useState('Morning (8 AM - 4 PM)');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addStaffMember({
      name: name.trim(),
      specialty,
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      shift,
      avatar: '',
    });

    setAddModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
  };

  const activeStaff = selectedStaffId
    ? staff.find((s) => s.id === selectedStaffId) || staff[0]
    : staff[0];

  const assignedComplaints = activeStaff
    ? complaints.filter((c) => c.assignedStaffId === activeStaff.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Maintenance Staff & Contractor Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage certified campus tradespeople, monitor active workloads, and audit completion ratings.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => {
          const isSelected = activeStaff?.id === member.id;
          const assignedTickets = complaints.filter(
            (c) => c.assignedStaffId === member.id && c.status !== 'Resolved'
          );

          return (
            <div
              key={member.id}
              onClick={() => setSelectedStaffId(member.id)}
              className={`bg-white rounded-xl border p-5 transition-all cursor-pointer shadow-2xs ${
                isSelected
                  ? 'border-red-700 ring-2 ring-red-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={member.avatar}
                    name={member.name}
                    sizeClass="w-12 h-12"
                    textSizeClass="text-sm"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                    <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                      {member.specialty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{member.rating}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-slate-700">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.shift}</span>
                </div>
              </div>

              {/* Task metrics */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-400 block">Active Jobs</span>
                  <span className="font-mono font-bold text-red-700 text-sm">
                    {assignedTickets.length}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-400 block">Completed</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    {member.completedTaskCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Staff Assigned Tasks Detail */}
      {activeStaff && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Active & Past Tasks: {activeStaff.name} ({activeStaff.specialty})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complaints assigned to this staff member in Fixora
              </p>
            </div>

            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-semibold">
              {assignedComplaints.length} Total Task(s) Recorded
            </span>
          </div>

          {assignedComplaints.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No active tasks assigned to {activeStaff.name} right now.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {assignedComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCurrentView('admin-complaints', c.id)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs text-red-700">{c.id}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-slate-900 truncate">{c.title}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{c.building}</span>
                      <span>·</span>
                      <span>{c.specificLocation}</span>
                      <span>·</span>
                      <span className="font-mono">{c.status}</span>
                    </div>
                  </div>

                  <span className="text-xs text-red-700 font-semibold flex items-center gap-1 shrink-0">
                    Open in Queue <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Register Maintenance Staff Member
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Joshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specialty / Trade *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value as MaintenanceStaff['specialty'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 94140 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Shift
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                >
                  <option value="Morning (8 AM - 4 PM)">Morning (8 AM - 4 PM)</option>
                  <option value="Evening (2 PM - 10 PM)">Evening (2 PM - 10 PM)</option>
                  <option value="Night / Emergency (10 PM - 8 AM)">Night / Emergency</option>
                  <option value="Flexible / On-Call">Flexible / On-Call</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
