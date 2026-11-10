import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  ListTodo,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  BarChart3,
  Building2,
  ArrowRight,
  ShieldAlert,
  Flame,
  Wrench,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, complaints, staff, setCurrentView } = useApp();

  const totalComplaints = complaints.length;
  const newComplaints = complaints.filter((c) => c.status === 'Submitted').length;
  const underReviewComplaints = complaints.filter((c) => c.status === 'Under Review').length;
  const inProgressComplaints = complaints.filter(
    (c) => c.status === 'In Progress' || c.status === 'Assigned'
  ).length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
  const reopenedComplaints = complaints.filter((c) => c.status === 'Reopened').length;
  const urgentComplaints = complaints.filter(
    (c) => (c.priority === 'Urgent' || c.priority === 'High') && c.status !== 'Resolved'
  );

  // Group by category
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  // Group by building
  const buildingCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    buildingCounts[c.building] = (buildingCounts[c.building] || 0) + 1;
  });
  const sortedBuildings = Object.entries(buildingCounts).sort((a, b) => b[1] - a[1]);

  const resolutionRate =
    totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100)
      : 100;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 text-xs font-semibold mb-2 border border-red-500/30">
              <span>{currentUser?.department || 'Campus Facilities Office'}</span>
              <span>·</span>
              <span>{currentUser?.designation || 'Head Administrator'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              VIT-AP Facilities & Estate Management Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              Centralized oversight of all university complaints, technician dispatch rosters, and resolution verification audits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('admin-complaints')}
              className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              <ListTodo className="w-4 h-4" />
              <span>Manage Complaints</span>
            </button>
            <button
              onClick={() => setCurrentView('admin-staff')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-colors border border-slate-700 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Staff Roster</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC SUMMARY CARDS (6 Key Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Tickets</span>
            <ListTodo className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {totalComplaints}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">All registered</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>New / Unreviewed</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-amber-600">
            {newComplaints}
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">Awaiting triage</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>In-Progress</span>
            <Wrench className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-red-800">
            {inProgressComplaints}
          </div>
          <div className="mt-1 text-[11px] text-red-700">Under repair</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-600">
            {resolvedComplaints}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">{resolutionRate}% resolved</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Reopened</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-rose-600">
            {reopenedComplaints}
          </div>
          <div className="mt-1 text-[11px] text-rose-700 font-medium">Needs review</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-rose-200 bg-rose-50/30 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 text-xs font-medium">
            <span>Urgent / High</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-rose-700">
            {urgentComplaints.length}
          </div>
          <div className="mt-1 text-[11px] text-rose-700 font-semibold">Priority dispatch</div>
        </div>
      </div>

      {/* 2-Column: High Priority Dispatch Queue + Building Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent & High Priority Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900">
                High Priority & Urgent Queue ({urgentComplaints.length})
              </h2>
            </div>

            <button
              onClick={() => setCurrentView('admin-complaints')}
              className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1"
            >
              Open all complaints <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
            {urgentComplaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-medium text-slate-700">No urgent pending issues</p>
                <p className="text-slate-400 mt-0.5">All critical hazards have been resolved.</p>
              </div>
            ) : (
              urgentComplaints.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCurrentView('admin-complaints', c.id)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold text-slate-600">
                        {c.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <PriorityBadge priority={c.priority} />
                      <span className="text-slate-300">·</span>
                      <StatusBadge status={c.status} />
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-red-700 transition-colors truncate">
                      {c.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{c.building}</span>
                      <span>·</span>
                      <span className="truncate">{c.specificLocation}</span>
                      <span>·</span>
                      <span>Reported by {c.studentName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[11px]">Assigned to:</span>
                      <span className="font-semibold text-slate-700">
                        {c.assignedStaffName || 'Not Assigned'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentView('admin-complaints', c.id);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Category Volume Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Complaints Volume by Category
            </h3>
            <div className="space-y-3">
              {sortedCategories.map(([catName, count]) => {
                const pct = Math.round((count / totalComplaints) * 100);
                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{catName}</span>
                      <span className="font-mono tabular-nums text-slate-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-700 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets (1 col): Hotspots & Staff Availability */}
        <div className="space-y-4">
          {/* Building Concentration */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Building Hotspots
              </h3>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {sortedBuildings.map(([bldgName, count], idx) => (
                <div
                  key={bldgName}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[11px] font-bold text-slate-400 w-4">
                      0{idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 truncate">
                      {bldgName}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100 shrink-0">
                    {count} tickets
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Crew Availability Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Staff On Duty ({staff.length})
              </h3>
              <button
                onClick={() => setCurrentView('admin-staff')}
                className="text-xs text-red-700 hover:underline font-semibold"
              >
                View Roster
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {staff.slice(0, 4).map((member) => (
                <div key={member.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-900">{member.name}</h4>
                    <p className="text-[11px] text-slate-500">{member.specialty}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-slate-700 font-semibold block">
                      {member.activeTaskCount} active
                    </span>
                    <span className="text-[10px] text-emerald-600">
                      ★ {member.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
