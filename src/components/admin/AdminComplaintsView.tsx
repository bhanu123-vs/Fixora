import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Complaint, ComplaintStatus, PriorityLevel, IssueCategory } from '../../types';
import { CAMPUS_BUILDINGS } from '../../data/mockData';
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  User,
  MapPin,
  Calendar,
  Wrench,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Phone,
  MessageSquare,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

export const AdminComplaintsView: React.FC = () => {
  const {
    complaints,
    staff,
    selectedComplaintId,
    setCurrentView,
    updateComplaintStatus,
    updateComplaintPriority,
    assignStaff,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [buildingFilter, setBuildingFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'createdAt' | 'priority' | 'status'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Detail drawer / modal state
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(() => {
    if (selectedComplaintId) {
      return complaints.find((c) => c.id === selectedComplaintId) || null;
    }
    return null;
  });

  // Modal actions state
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [statusToUpdate, setStatusToUpdate] = useState<ComplaintStatus>('In Progress');
  const [adminRemark, setAdminRemark] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('High');

  // Keep active complaint in sync with main state
  const currentComplaint = activeComplaint
    ? complaints.find((c) => c.id === activeComplaint.id) || activeComplaint
    : null;

  const filteredComplaints = complaints
    .filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.specificLocation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchesBuilding = buildingFilter === 'All' || c.building === buildingFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesBuilding;
    })
    .sort((a, b) => {
      if (sortField === 'createdAt') {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortAsc ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const handleOpenDetail = (complaint: Complaint) => {
    setActiveComplaint(complaint);
    setSelectedStaffId(complaint.assignedStaffId || '');
    setStatusToUpdate(complaint.status);
    setNewPriority(complaint.priority);
    setAdminRemark('');
  };

  const handleAssignStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentComplaint || !selectedStaffId) return;
    try {
      await assignStaff(currentComplaint.id, selectedStaffId);
    } catch (err) {
      console.error('Assign staff error', err);
    }
  };

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentComplaint) return;
    try {
      await updateComplaintStatus(currentComplaint.id, statusToUpdate, adminRemark.trim());
      setAdminRemark('');
    } catch (err) {
      console.error('Update status error', err);
    }
  };

  const handlePriorityChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentComplaint) return;
    updateComplaintPriority(currentComplaint.id, newPriority);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Campus Complaints Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review submissions, assign certified campus technicians, update repair statuses, and oversee resolution.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, title, student, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
              <option value="Electricity">Electricity</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Furniture">Furniture</option>
              <option value="Classroom Infrastructure">Classroom</option>
              <option value="Hostel Maintenance">Hostel</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Building */}
          <div>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white truncate"
            >
              <option value="All">All Buildings</option>
              {CAMPUS_BUILDINGS.map((b) => (
                <option key={b} value={b}>
                  {b.split('(')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active counter & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Displaying <strong className="text-slate-800">{filteredComplaints.length}</strong> of{' '}
            {complaints.length} complaints in system
          </span>

          {(searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' || buildingFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setCategoryFilter('All');
                setPriorityFilter('All');
                setBuildingFilter('All');
              }}
              className="text-red-700 hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* COMPLAINTS MANAGEMENT TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Student & Contact</th>
                <th className="py-3 px-4">Title & Category</th>
                <th className="py-3 px-4">Building & Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No complaints match current filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenDetail(c)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-red-700 whitespace-nowrap">
                      {c.id}
                    </td>

                    <td className="py-3 px-4 max-w-[150px]">
                      <div className="font-semibold text-slate-900 truncate">
                        {c.studentName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {c.studentPhone}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{c.category}</div>
                    </td>

                    <td className="py-3 px-4 max-w-[180px]">
                      <div className="text-slate-800 font-medium truncate">
                        {c.specificLocation}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {c.building}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {c.assignedStaffName ? (
                        <div>
                          <span className="font-medium text-slate-800">
                            {c.assignedStaffName}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {c.assignedStaffSpecialty}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(c);
                        }}
                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md font-bold text-xs transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & ACTION SLIDE-OVER DRAWER */}
      {currentComplaint && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveComplaint(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded">
                      {currentComplaint.id}
                    </span>
                    <PriorityBadge priority={currentComplaint.priority} />
                    <StatusBadge status={currentComplaint.status} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {currentComplaint.title}
                  </h2>
                </div>

                <button
                  onClick={() => setActiveComplaint(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Reopened Alert */}
                {currentComplaint.status === 'Reopened' && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-700">
                      <RotateCcw className="w-4 h-4" />
                      <span>Reopened Ticket - Immediate Follow-Up Needed</span>
                    </div>
                    <p className="text-rose-800">
                      <strong>Student Reason:</strong> {currentComplaint.reopenedReason}
                    </p>
                  </div>
                )}

                {/* Student Info Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Reported by:</span>
                    <span className="font-bold text-slate-900">{currentComplaint.studentName}</span>
                    <span className="text-slate-500 font-mono block text-[11px]">{currentComplaint.studentId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Location:</span>
                    <span className="font-semibold text-slate-800">{currentComplaint.specificLocation}</span>
                    <span className="text-slate-500 block text-[11px]">{currentComplaint.building}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Student Contact:</span>
                    <span className="font-mono text-slate-700">{currentComplaint.studentPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Submitted:</span>
                    <span className="font-mono tabular-nums text-slate-700">{formatDate(currentComplaint.createdAt)}</span>
                  </div>
                </div>

                {/* Description & Photos */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Description & Photos
                  </h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    {currentComplaint.description}
                  </p>

                  {currentComplaint.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {currentComplaint.images.map((img, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                          <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ADMIN ACTIONS SECTION */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-700">
                    Management Actions
                  </h4>

                  {/* 1. Assign Staff Member */}
                  <form onSubmit={handleAssignStaff} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-red-700" />
                        Assign Maintenance Staff
                      </label>
                      {currentComplaint.assignedStaffName && (
                        <span className="text-[11px] text-slate-500">
                          Currently: <strong>{currentComplaint.assignedStaffName}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={selectedStaffId}
                        onChange={(e) => setSelectedStaffId(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                      >
                        <option value="">-- Choose Staff Specialist --</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.specialty}) — {s.activeTaskCount} active jobs
                          </option>
                        ))}
                      </select>

                      <button
                        type="submit"
                        disabled={!selectedStaffId}
                        className="px-3.5 py-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
                      >
                        Assign
                      </button>
                    </div>
                  </form>

                  {/* 2. Update Status & Add Resolution / Progress Notes */}
                  <form onSubmit={handleStatusChange} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <label className="text-xs font-semibold text-slate-900 block">
                      Update Complaint Status & Progress Remarks
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">
                          New Status:
                        </label>
                        <select
                          value={statusToUpdate}
                          onChange={(e) => setStatusToUpdate(e.target.value as ComplaintStatus)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Reopened">Reopened</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">
                          Remarks / Work Done:
                        </label>
                        <input
                          type="text"
                          placeholder={
                            statusToUpdate === 'Resolved'
                              ? 'e.g. Cleared drain and replaced valve'
                              : 'e.g. Technician arriving at 2 PM'
                          }
                          value={adminRemark}
                          onChange={(e) => setAdminRemark(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors"
                    >
                      Apply Status Transition
                    </button>
                  </form>

                  {/* 3. Change Priority */}
                  <form onSubmit={handlePriorityChange} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-900">
                        Change Priority Level
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Current: <strong>{currentComplaint.priority}</strong>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>

                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Update Priority
                      </button>
                    </div>
                  </form>
                </div>

                {/* Audit Trail in Drawer */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Audit Trail ({currentComplaint.timeline.length} updates)
                  </h4>
                  <div className="space-y-3">
                    {currentComplaint.timeline.map((ev) => (
                      <div key={ev.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs">
                        <div className="flex justify-between font-semibold text-slate-800">
                          <span>{ev.title}</span>
                          <span className="text-[11px] font-mono text-slate-400">{formatDate(ev.timestamp)}</span>
                        </div>
                        <p className="text-slate-600 mt-1">{ev.description}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">By {ev.actorName} ({ev.actorRole})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
