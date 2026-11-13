import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS, VIT_AP_CAMPUS_INFO } from '../../constants/assets';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Wifi,
  Droplets,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  ChevronRight,
  Search,
  MessageSquare,
  HelpCircle,
  Star,
  Users,
  MapPin,
  Flame,
  PhoneCall,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (role?: 'student' | 'admin' | 'warden') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { complaints, setCurrentView } = useApp();
  const [trackSearchId, setTrackSearchId] = useState('');
  const [trackResult, setTrackResult] = useState<string | null>(null);
  const [activeRoleTab, setActiveRoleTab] = useState<'student' | 'admin'>('student');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackSearchId.trim()) return;
    const found = complaints.find(
      (c) => c.id.toLowerCase() === trackSearchId.trim().toLowerCase()
    );
    if (found) {
      setCurrentView('track-complaint', found.id);
    } else {
      setTrackResult(`No complaint record found matching ID "${trackSearchId.trim()}". Check ID or report a new issue.`);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6">
              {/* Co-Branded Official Pill */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                <img
                  src={ASSETS.VIT_AP_LOGO}
                  alt="VIT-AP"
                  className="w-4 h-4 object-contain"
                />
                <span>Dedicated to VIT-AP University, Amaravati</span>
                <span className="text-red-300">·</span>
                <span className="text-red-700 font-bold">Report • Track • Fix</span>
              </div>

              {/* Bold Black & Red Typography */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.15]">
                Fixora at <span className="text-red-700">VIT-AP.</span> <br />
                Every campus issue. <br />
                <span className="text-red-700">Resolved fast.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Say goodbye to unread WhatsApp messages and forgotten paper registers. Fixora empowers VIT-AP hostellers across LH-1 to LH-3, MH-1 to MH-7, and Day Scholars across all Academic Blocks and campus facilities to report problems with photos, track technicians in real-time, and verify fixes before tickets close.
              </p>

              {/* CTAs in VIT-AP Red and Black */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenAuth('student')}
                  className="px-6 py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report an Issue (Student Demo)</span>
                </button>

                <button
                  onClick={() => onOpenAuth('admin')}
                  className="px-6 py-3.5 bg-slate-950 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm border border-transparent dark:border-slate-700 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-red-400" />
                  <span>Warden & Admin Portal</span>
                </button>
              </div>

              {/* Quick Tracker Search Widget */}
              <div className="pt-3 max-w-lg">
                <form
                  onSubmit={handleQuickTrack}
                  className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 dark:focus-within:ring-red-900/40 transition-all"
                >
                  <Search className="w-4 h-4 text-slate-400 ml-2" />
                  <input
                    type="text"
                    placeholder="Track Complaint ID (e.g. FIX-2026-8412)"
                    value={trackSearchId}
                    onChange={(e) => {
                      setTrackSearchId(e.target.value);
                      setTrackResult(null);
                    }}
                    className="flex-1 text-xs bg-transparent focus:outline-none font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-2xs"
                  >
                    Track Live
                  </button>
                </form>
                {trackResult && (
                  <p className="text-xs text-red-600 mt-1.5 ml-2 font-medium">{trackResult}</p>
                )}
              </div>
            </div>

            {/* Right Column: VIT-AP University Aerial Landmark Photo */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 bg-slate-900 group">
                <img
                  src={ASSETS.VIT_AP_AERIAL}
                  alt="VIT-AP University Amaravati Campus Aerial View"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Campus Tag top left */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>VIT-AP Amaravati Campus</span>
                </div>

                {/* Overlay Card: Live Activity Indicator */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-lg text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Campus Operations · 2026
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-red-700">All Blocks Active</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1.5 border-t border-slate-100 font-mono">
                    <div>
                      <span className="text-xs font-black text-slate-950 block">
                        {complaints.filter((c) => c.status === 'Resolved').length}
                      </span>
                      <span className="text-[10px] text-slate-500">Campus Fixes</span>
                    </div>
                    <div>
                      <span className="text-xs font-black text-red-700 block">
                        {complaints.length}
                      </span>
                      <span className="text-[10px] text-slate-500">Total Logged</span>
                    </div>
                    <div>
                      <span className="text-xs font-black text-emerald-700 block">
                        {complaints.length > 0
                          ? `${Math.round(
                              (complaints.filter((c) => c.status === 'Resolved').length /
                                complaints.length) *
                                100
                            )}%`
                          : '0%'}
                      </span>
                      <span className="text-[10px] text-slate-500">Resolution Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VIT-AP CAMPUS LANDMARK SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-red-800 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-red-700" />
            <span>Campus Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Dedicated Facilities Across <span className="text-red-700">VIT-AP</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Fixora directly connects every hostel block, academic quad, and laboratory complex with the university estate maintenance office.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Landmark 1: Main Gate */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all group">
            <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
              <img
                src={ASSETS.VIT_AP_GATE}
                alt="VIT-AP University Main Entrance Gate"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Main Entrance
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Main Campus Gateway</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Security checkpoint, estate vehicle bay, and university visitor entrance on Amaravati highway.
              </p>
            </div>
          </div>

          {/* Landmark 2: Central Block at Night */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all group">
            <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
              <img
                src={ASSETS.VIT_AP_NIGHT}
                alt="VIT-AP Mahatma Gandhi Block Illumination"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[133.34%] -rotate-90 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                Mahatma Gandhi Block (MGB)
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Mahatma Gandhi Block</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Central administrative hub, auditorium, amphitheater, and evening student activity plazas.
              </p>
            </div>
          </div>

          {/* Landmark 3: Quadrangle Flagpole & Sunset */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all group">
            <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
              <img
                src={ASSETS.VIT_AP_SUNSET_FLAG}
                alt="VIT-AP Flagpole Campus Sunset"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Quadrangle
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Academic Quadrangle</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Central university green lawn flanked by AB-1 (Sarvepalli Radhakrishnan) and AB-2 (Newton Block).
              </p>
            </div>
          </div>

          {/* Landmark 4: Aerial Panorama */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all group">
            <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
              <img
                src={ASSETS.VIT_AP_AERIAL}
                alt="VIT-AP Aerial Campus Master Plan"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Hostels & Mess
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Hostels & Dining Blocks</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Covering LH-1 to LH-3, MH-1 through MH-7, dining complexes, transport bays, and campus Wi-Fi network hubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM WE SOLVE */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700">
            The Campus Reality
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Why Traditional Campus & Hostel Registers Fail
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Students face recurring infrastructure roadblocks, while maintenance administrators struggle with chaotic WhatsApp records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Buried in WhatsApp Groups</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complaints sent to warden WhatsApp chats or informal hostel groups get drowned within minutes. No tracking IDs, no accountability, and zero status visibility.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Physical Paper Logbooks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students have to walk to the block manager office between classes to fill paper registers. Maintenance staff miss urgent leaks, and students are left guessing.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Premature "Closed" Status</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Third-party contractors mark tickets resolved without the student verifying the tap, AC or router was actually fixed. Fixora enforces student confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS: 3 SIMPLE STEPS */}
      <section id="how-it-works" className="bg-slate-950 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-y border-red-950/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Transparent 3-Step Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              How Fixora Works at <span className="text-red-500">VIT-AP</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              From snapping a smartphone photo to verified sign-off in three streamlined stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative space-y-4">
              <span className="font-mono text-3xl font-extrabold text-red-500 block">
                01
              </span>
              <h3 className="text-lg font-bold text-white">1. Report with Photo & Location</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Select your block (e.g. MH-1, LH-1, AB-1) and room number, choose the category (Wi-Fi, Water, Power, AC, Cleanliness), attach photos, and hit submit.
              </p>
              <div className="text-[11px] text-red-400 flex items-center gap-1 font-mono">
                Unique Tracking ID Generated
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative space-y-4">
              <span className="font-mono text-3xl font-extrabold text-red-500 block">
                02
              </span>
              <h3 className="text-lg font-bold text-white">2. Warden Triage & Staff Dispatch</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Block wardens and estate supervisors inspect urgency and dispatch dedicated campus electricians, plumbers, or network engineers with audited contact numbers.
              </p>
              <div className="text-[11px] text-red-400 flex items-center gap-1 font-mono">
                Live Status Updates on Dashboard
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative space-y-4">
              <span className="font-mono text-3xl font-extrabold text-red-500 block">
                03
              </span>
              <h3 className="text-lg font-bold text-white">3. Verified Resolution by Student</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The student tests the repair and confirms resolution with a 1–5 star rating. If incomplete, 1-click reopening prevents ticket closure and escalates to the senior warden.
              </p>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                Mandatory Student Sign-Off
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DUAL PERSPECTIVE: STUDENTS VS ADMINISTRATORS */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700">
            Tailored Workspaces
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Purpose-Built for Students & Wardens
          </h2>
        </div>

        {/* Segmented Tab Controller in Red and Slate */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveRoleTab('student')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
                activeRoleTab === 'student'
                  ? 'bg-white text-red-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>For Hostellers & Day Scholars</span>
            </button>
            <button
              onClick={() => setActiveRoleTab('admin')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
                activeRoleTab === 'admin'
                  ? 'bg-white text-red-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>For Wardens & Administrators</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeRoleTab === 'student' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-950">Rapid Photo Reporting</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Snap photos from your phone. Category and block presets (LH-1 to LH-3, MH-1 to MH-7, Academic Blocks & Bus Bay) make logging take under 45 seconds.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-950">Live Stage Tracker</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                See exactly when your complaint is reviewed, which technician is assigned, their phone contact, and their ETA.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-950">Resolution Confirmation</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                You have the final say. If the technician did not fix the problem, 1-click reopening prevents ticket closure.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-950">Priority Triage & Urgent Alerts</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter by urgency, block, or category. Electrical sparks and major water leaks trigger immediate red priority alerts for emergency dispatch.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-950">Staff Dispatch & Roster</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect electricians, plumbers, and carpenters on duty with active job counts. Prevent technician overload and track turnaround SLAs.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-950">Building Hotspot Analytics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Spot recurring infrastructure defects in specific hostel blocks or academic wings before they become university-wide issues.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 6. SAMPLE COMPLAINTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">
              Live Queue Showcase
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Recent Complaints Logged at VIT-AP
            </h2>
          </div>

          <button
            onClick={() => onOpenAuth('student')}
            className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1"
          >
            Explore all in interactive dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">
              Live Queue Connected · 0 Active Tickets
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All mock sample tickets have been cleared for live production use. Sign in to report a campus issue and watch updates stream in real time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {complaints.slice(0, 3).map((c) => (
              <div
                key={c.id}
                onClick={() => setCurrentView('track-complaint', c.id)}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-red-400 hover:shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-slate-500">{c.id}</span>
                    <span className="font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {c.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-950 group-hover:text-red-700 transition-colors line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {c.description}
                  </p>
                  <div className="mt-2 text-[11px] font-medium text-slate-600 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{c.building}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{c.status}</span>
                  <span className="text-red-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Track progress <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="bg-slate-50 py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">
              Verified Campus Feedback
            </span>
            <h2 className="text-2xl font-black text-slate-950">
              Trusted by VIT-AP Residents & Wardens
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "In LH-1, our corridor Wi-Fi optical cable dropped right before semester exam submissions. Logging it via Fixora took 30 seconds with a photo, and the technician was dispatched within an hour. The two-way confirmation ensures nothing is closed prematurely."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
                  PS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Priya Sharma (22BCE1084)</h4>
                  <p className="text-[11px] text-slate-400">LH-1 Resident · 3rd Year B.Tech CSE, SCOPE</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "Fixora brings transparent governance to VIT-AP campus facilities. Every maintenance worker has an accountable active task roster, urgent plumbing and electrical tickets trigger immediate alerts, and turnaround SLA has improved by 60%."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-bold flex items-center justify-center text-xs">
                  RK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dr. Rajesh Kulkarni</h4>
                  <p className="text-[11px] text-slate-400">Director of Campus Infrastructure & Chief Warden, VIT-AP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700">
            Support & Information
          </span>
          <h2 className="text-2xl font-black text-slate-950">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
            <h4 className="font-bold text-slate-950">
              Which buildings at VIT-AP are covered by Fixora?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              All facilities across campus for both Hostellers and Day Scholars: Ladies Hostels (LH-1, LH-2, LH-3), Men's Hostels (MH-1 through MH-7), Mahatma Gandhi Block (Central Block), Academic Block 1 (AB-1), Academic Block 2 (AB-2), Central Library, Dining Halls, Student Activity Center (SAC), and Campus Bus Bay & Parking.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
            <h4 className="font-bold text-slate-950">
              What happens if a technician marks my issue resolved, but it is still broken?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Fixora requires student verification. You will be prompted to test and rate the fix. If the problem persists, simply tap "Reopen Complaint" with a note, which immediately escalates to the senior hostel warden.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
            <h4 className="font-bold text-slate-950">
              How do I use this prototype for demonstration?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              You can explore with 1-click demo accounts for Student, Warden, or Administrator, or sign in securely with Firebase Google Authentication.
            </p>
          </div>
        </div>
      </section>

      {/* 9. CO-BRANDED FOOTER */}
      <footer className="border-t border-slate-200 pt-12 pb-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
            {/* Logos */}
            <div className="flex items-center gap-3">
              <img
                src={ASSETS.FIXORA_LOGO}
                alt="Fixora"
                className="h-9 w-auto object-contain rounded"
              />
              <div className="h-6 w-px bg-slate-300" />
              <div className="flex items-center gap-2">
                <img
                  src={ASSETS.VIT_AP_LOGO}
                  alt="VIT-AP"
                  className="h-9 w-auto object-contain"
                />
                <div>
                  <span className="font-black text-slate-950 text-sm block leading-none">
                    VIT-AP University
                  </span>
                  <span className="text-[10px] text-red-700 font-semibold uppercase">
                    Amaravati, Andhra Pradesh
                  </span>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 justify-center">
              <span>{VIT_AP_CAMPUS_INFO.campusLocation}</span>
              <span>·</span>
              <span className="font-mono text-red-700 font-semibold">{VIT_AP_CAMPUS_INFO.helpline}</span>
              <span>·</span>
              <span>{VIT_AP_CAMPUS_INFO.facilitiesEmail}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>
              © {new Date().getFullYear()} Fixora × VIT-AP University. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Report It. Track It. Fix It.</span>
              <span>·</span>
              <span>Cloud Firestore Persistent System</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
