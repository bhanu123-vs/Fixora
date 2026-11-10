import React from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS } from '../../constants/assets';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  MapPin,
  Calendar,
  CheckCheck,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, complaints, setCurrentView } = useApp();

  // Filter complaints for this logged-in student
  const studentComplaints = complaints.filter(
    (c) =>
      c.studentUid === currentUser?.uid ||
      (currentUser?.studentId && c.studentId === currentUser.studentId) ||
      (currentUser?.email && c.studentEmail === currentUser.email)
  );

  const totalSubmitted = studentComplaints.length;
  const inProgressCount = studentComplaints.filter(
    (c) => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Under Review'
  ).length;
  const resolvedCount = studentComplaints.filter((c) => c.status === 'Resolved').length;
  const pendingConfirmationComplaints = studentComplaints.filter(
    (c) => c.status === 'Resolved' && !c.resolutionConfirmedByStudent
  );
  const reopenedCount = studentComplaints.filter((c) => c.status === 'Reopened').length;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner in VIT-AP Crimson & Obsidian */}
      <div className="bg-gradient-to-r from-red-950 via-slate-950 to-red-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-red-900/40">
        {/* VIT-AP Campus subtle background image */}
        <img
          src={ASSETS.VIT_AP_AERIAL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay pointer-events-none"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-red-200 text-xs backdrop-blur-xs border border-white/10">
              <span className="font-semibold">{currentUser?.department || 'SCOPE · Computer Science'}</span>
              <span>·</span>
              <span>{currentUser?.yearOfStudy || '3rd Year B.Tech'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {currentUser?.name?.split(' ')[0] || 'Student'}
            </h1>

            <p className="text-sm text-slate-300 max-w-xl">
              Report campus and hostel facility issues, track real-time technician assignments across VIT-AP, and verify fixes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('report-issue')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-700 text-white font-bold text-sm rounded-xl hover:bg-red-800 transition-all shadow-md active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              Report New Issue
            </button>
          </div>
        </div>
      </div>

      {/* ACTION REQUIRED: Pending student confirmation banner */}
      {pendingConfirmationComplaints.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900">
                Action Required: {pendingConfirmationComplaints.length} issue(s) marked resolved by staff
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Please verify if the problem has actually been fixed before we close the ticket, or reopen it if incomplete.
              </p>
              <div className="mt-2 text-xs font-medium text-slate-800">
                Ticket: <span className="font-mono">{pendingConfirmationComplaints[0].id}</span> — {pendingConfirmationComplaints[0].title}
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('track-complaint', pendingConfirmationComplaints[0].id)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded-lg hover:bg-amber-900 transition-colors whitespace-nowrap shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            Verify Resolution
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Reported</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalSubmitted}
            </span>
            <span className="text-xs text-slate-400">lifetime</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">In Progress</span>
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-red-700">
              {inProgressCount}
            </span>
            <span className="text-xs text-slate-400">active jobs</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {resolvedCount}
            </span>
            <span className="text-xs text-slate-400">completed</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Reopened</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-600">
              {reopenedCount}
            </span>
            <span className="text-xs text-slate-400">reviewing</span>
          </div>
        </div>
      </div>

      {/* Main split: Recent Active Complaints + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Complaints List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Recent Complaint Activity
              </h2>
              <p className="text-xs text-slate-500">
                Real-time progress of your campus facility requests
              </p>
            </div>

            <button
              onClick={() => setCurrentView('my-complaints')}
              className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1"
            >
              View all ({studentComplaints.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100">
            {studentComplaints.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No complaints reported yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Have an issue in your hostel room, lab, or washroom? Report it in seconds.
                </p>
                <button
                  onClick={() => setCurrentView('report-issue')}
                  className="px-4 py-2 bg-red-700 text-white text-xs font-semibold rounded-lg hover:bg-red-800"
                >
                  Report First Issue
                </button>
              </div>
            ) : (
              studentComplaints.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCurrentView('track-complaint', c.id)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-500">
                        {c.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-medium text-slate-600">
                        {c.category}
                      </span>
                      <span className="text-slate-300">·</span>
                      <PriorityBadge priority={c.priority} />
                    </div>

                    <StatusBadge status={c.status} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 group-hover:text-red-700 transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 truncate max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {c.specificLocation || c.building}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(c.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-red-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>Track Progress</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Widgets (1 col) */}
        <div className="space-y-4">
          {/* Student Profile Quick Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Registered VIT-AP Residence
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{currentUser?.name}</h4>
                <p className="text-xs text-red-700 font-mono font-semibold">{currentUser?.studentId}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Hostel Block:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {currentUser?.hostelBlock || 'LH-1 (Ladies Hostel 1)'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Room Number:</span>
                <span className="font-bold text-slate-900">{currentUser?.roomNumber || 'Room 302'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Contact:</span>
                <span className="font-mono text-slate-700">{currentUser?.phone}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('student-profile')}
              className="mt-4 w-full py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              Edit Profile Details
            </button>
          </div>

          {/* SLA / Campus Maintenance Guarantee */}
          <div className="bg-slate-950 text-white rounded-xl p-5 shadow-md border border-red-950/40">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VIT-AP Resolution SLA</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Guaranteed Turnaround Times
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Directly routed to Mahatma Gandhi Block facilities depot.
            </p>
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3 font-mono">
              <div className="flex justify-between text-red-400">
                <span>Urgent (Leak/Fire/Spark):</span>
                <span>&lt; 2 Hours</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>High (Wi-Fi/Power):</span>
                <span>&lt; 6 Hours</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Standard (Carpentry):</span>
                <span>&lt; 24 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
