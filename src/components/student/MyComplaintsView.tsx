import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { ComplaintStatus, IssueCategory } from '../../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const MyComplaintsView: React.FC = () => {
  const { currentUser, complaints, setCurrentView } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter complaints for current student
  const studentComplaints = complaints.filter(
    (c) =>
      c.studentUid === currentUser?.uid ||
      (currentUser?.studentId && c.studentId === currentUser.studentId) ||
      (currentUser?.email && c.studentEmail === currentUser.email)
  );

  const filteredComplaints = studentComplaints
    .filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.specificLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'All' || c.status === selectedStatus;

      const matchesCategory =
        selectedCategory === 'All' || c.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My Complaints History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track, review technician updates, and confirm resolutions for all submitted tickets.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('report-issue')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, keyword, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
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

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
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

          {/* Sort & View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex-1 px-3 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-1 text-slate-700"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>

            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'cards' ? 'bg-white shadow-2xs text-red-700' : 'text-slate-500'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'table' ? 'bg-white shadow-2xs text-red-700' : 'text-slate-500'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter chips bar */}
        {(searchTerm || selectedStatus !== 'All' || selectedCategory !== 'All') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing {filteredComplaints.length} of {studentComplaints.length} complaints
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('All');
                setSelectedCategory('All');
              }}
              className="text-red-700 hover:underline font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No matching complaints found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting filters to see previous reports.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('All');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              onClick={() => setCurrentView('track-complaint', c.id)}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-red-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {c.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-1">
                  {c.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                {/* Metadata list */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.specificLocation} ({c.building})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {c.assignedStaffName
                          ? `${c.assignedStaffName} (${c.assignedStaffSpecialty})`
                          : 'Awaiting assignment'}
                      </span>
                    </div>

                    <span className="font-mono tabular-nums text-[11px] text-slate-400">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {c.status === 'Resolved' && !c.resolutionConfirmedByStudent ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Needs confirmation
                  </span>
                ) : (
                  <span className="text-slate-400">
                    {c.timeline.length} timeline event(s)
                  </span>
                )}

                <span className="text-red-700 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Track Progress <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Title & Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setCurrentView('track-complaint', c.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-red-700 whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{c.category}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[180px] truncate">
                      {c.specificLocation}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {c.assignedStaffName || (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-400 text-right whitespace-nowrap">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
