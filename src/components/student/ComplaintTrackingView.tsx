import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { ComplaintStatus } from '../../types';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Star,
  MessageSquare,
  ShieldCheck,
  Wrench,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const TRACKING_STEPS: { status: ComplaintStatus; label: string; desc: string }[] = [
  {
    status: 'Submitted',
    label: 'Submitted',
    desc: 'Ticket logged in campus queue',
  },
  {
    status: 'Under Review',
    label: 'Under Review',
    desc: 'Estate office assessing urgency',
  },
  {
    status: 'Assigned',
    label: 'Staff Assigned',
    desc: 'Technician dispatched',
  },
  {
    status: 'In Progress',
    label: 'Work In Progress',
    desc: 'On-site repair active',
  },
  {
    status: 'Resolved',
    label: 'Issue Resolved',
    desc: 'Work verified by management',
  },
];

export const ComplaintTrackingView: React.FC = () => {
  const {
    complaints,
    selectedComplaintId,
    setCurrentView,
    confirmResolution,
    reopenComplaint,
  } = useApp();

  // Pick target complaint or default to first one
  const complaint =
    complaints.find((c) => c.id === selectedComplaintId) ||
    complaints[0];

  // Feedback form state
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState('');
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  if (!complaint) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-sm font-semibold text-slate-800">No complaint selected.</p>
        <button
          onClick={() => setCurrentView('my-complaints')}
          className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-lg"
        >
          View My Complaints
        </button>
      </div>
    );
  }

  // Calculate current step index
  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return 0;
      case 'Under Review':
        return 1;
      case 'Assigned':
        return 2;
      case 'In Progress':
        return 3;
      case 'Resolved':
        return 4;
      case 'Reopened':
        return 3; // Put in active state
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(complaint.status);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const handleConfirm = () => {
    confirmResolution(complaint.id, rating, feedback.trim());
    setConfirmSuccess(true);
  };

  const handleReopen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    reopenComplaint(complaint.id, reopenReason.trim());
    setReopenModalOpen(false);
    setReopenReason('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Back Nav & Quick switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => setCurrentView('my-complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Complaints</span>
        </button>

        {/* Complaint selector dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">View other ticket:</span>
          <select
            value={complaint.id}
            onChange={(e) => setCurrentView('track-complaint', e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-red-600"
          >
            {complaints.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                {complaint.id}
              </span>
              <span className="text-xs text-slate-500 font-medium">{complaint.category}</span>
              <span className="text-slate-300">·</span>
              <PriorityBadge priority={complaint.priority} />
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {complaint.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {complaint.specificLocation} ({complaint.building})
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono tabular-nums">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Reported {formatDate(complaint.createdAt)}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <StatusBadge status={complaint.status} size="md" />
          </div>
        </div>

        {/* PROGRESS TIMELINE BAR */}
        <div className="py-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Live Resolution Pipeline
          </h3>

          {/* Stepper */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {TRACKING_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx && complaint.status !== 'Reopened';
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step.status}
                    className="flex md:flex-col items-center md:text-center gap-3 md:gap-2"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-red-700 text-white ring-4 ring-red-100 shadow-xs'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-red-700'
                            : isPassed
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-tight hidden md:block mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* REOPENED WARNING CALLOUT */}
        {complaint.status === 'Reopened' && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-semibold text-rose-950">
                Ticket Reopened by Student
              </h4>
              <p className="mt-1 text-rose-800">
                <strong>Reason:</strong> {complaint.reopenedReason || 'Issue remains unresolved.'}
              </p>
              <p className="mt-1 text-rose-600 text-[11px]">
                Estate administration has been alerted for re-assignment.
              </p>
            </div>
          </div>
        )}

        {/* RESOLUTION VERIFICATION BOX (Section 11 requirement) */}
        {complaint.status === 'Resolved' && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/60 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                    Technician Resolution Summary
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400">
                    Marked resolved on {formatDate(complaint.resolvedAt || complaint.updatedAt)}
                  </p>
                </div>
              </div>

              {complaint.resolutionConfirmedByStudent && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified by Student
                </span>
              )}
            </div>

            {/* Remarks from Maintenance */}
            {complaint.resolutionRemarks && (
              <div className="p-3.5 bg-white/80 rounded-xl border border-emerald-100 text-xs text-slate-700">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  Resolution Notes:
                </span>
                {complaint.resolutionRemarks}
              </div>
            )}

            {/* Student confirmation form or completed state */}
            {!complaint.resolutionConfirmedByStudent ? (
              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Has this problem been fixed satisfactorily?
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Fixora 2-Way Student Verification
                  </span>
                </div>

                {/* Rating Stars */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Rate Resolution Quality:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            starVal <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-medium text-slate-600">
                      {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : 'Poor'}
                    </span>
                  </div>
                </div>

                {/* Optional Feedback */}
                <div>
                  <input
                    type="text"
                    placeholder="Optional feedback: e.g. Prompt fix, technician was polite..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReopenModalOpen(true)}
                    className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Problem not fixed? Reopen complaint
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Resolution & Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Your Verification: </span>
                  <span>Rated {complaint.studentRating || 5} ★</span>
                  {complaint.studentFeedback && (
                    <span className="italic text-slate-500"> — "{complaint.studentFeedback}"</span>
                  )}
                </div>
                <button
                  onClick={() => setReopenModalOpen(true)}
                  className="text-xs text-slate-500 hover:text-rose-600 transition-colors"
                >
                  Reopen if recurring
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reopen Modal */}
        {reopenModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-2.5 text-rose-600">
                <RotateCcw className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  Reopen Ticket {complaint.id}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the technician's repair did not resolve the problem or the issue has recurred, describe what remains broken. This will notify the senior campus administrator immediately.
              </p>

              <form onSubmit={handleReopen} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why the issue is still active..."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReopenModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors"
                  >
                    Confirm Reopen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2-Column: Details & Assigned Staff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Details & Photos */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reported Description & Evidence
            </h3>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              {complaint.description}
            </p>

            {complaint.images.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                  Attached Photographs ({complaint.images.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {complaint.images.map((img, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100"
                    >
                      <img
                        src={img}
                        alt={`Attachment ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Assigned Staff & Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Maintenance Personnel
            </h3>

            {complaint.assignedStaffName ? (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm shrink-0">
                    <Wrench className="w-5 h-5 text-red-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {complaint.assignedStaffName}
                    </h4>
                    <p className="text-[11px] text-red-700 font-semibold">
                      {complaint.assignedStaffSpecialty || 'Maintenance Specialist'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{complaint.assignedStaffPhone || '+91 94140 00000'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>On campus shift: Morning (8 AM - 4 PM)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">Awaiting Staff Assignment</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Estate manager is reviewing staff schedule for this building.
                </p>
              </div>
            )}

            {/* Student info stamp */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Reporting Student Details
              </span>
              <p className="font-medium text-slate-800">{complaint.studentName}</p>
              <p className="text-slate-500 font-mono text-[11px]">
                {complaint.studentId} · {complaint.studentEmail}
              </p>
            </div>
          </div>
        </div>

        {/* AUDIT LOG TIMELINE */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Official Audit Trail & Activity Log ({complaint.timeline.length} updates)
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {complaint.timeline.map((event) => (
              <div key={event.id} className="relative">
                {/* Node icon */}
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-red-700 shrink-0" />

                <div className="text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">{event.title}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 text-[11px] font-mono tabular-nums">
                      {formatDate(event.timestamp)}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      by {event.actorName} ({event.actorRole})
                    </span>
                  </div>

                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
