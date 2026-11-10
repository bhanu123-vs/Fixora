import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueCategory, PriorityLevel } from '../../types';
import { CAMPUS_BUILDINGS } from '../../data/mockData';
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Building,
  MapPin,
  HelpCircle,
} from 'lucide-react';

const CATEGORIES: IssueCategory[] = [
  'Wi-Fi / Internet',
  'Electricity',
  'Water Supply',
  'Cleanliness',
  'Plumbing',
  'Furniture',
  'Classroom Infrastructure',
  'Hostel Maintenance',
  'Other',
];

import { uploadComplaintImageToStorage } from '../../services/firebaseService';

export const ReportIssueView: React.FC = () => {
  const { currentUser, submitComplaint, setCurrentView } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Wi-Fi / Internet');
  const [building, setBuilding] = useState(
    currentUser?.hostelBlock || CAMPUS_BUILDINGS[0]
  );
  const [specificLocation, setSpecificLocation] = useState(
    currentUser?.roomNumber || ''
  );
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Handle genuine file upload to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setIsUploadingImage(true);
    setUploadProgress(`Uploading ${files.length} file(s) to Firebase Storage...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}...`);
        const url = await uploadComplaintImageToStorage(file, 'vitap_issue');
        if (url) {
          setImages((prev) => [...prev, url]);
        }
      }
    } catch (err: any) {
      console.error('File upload error', err);
      setErrorMsg('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      setUploadProgress('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a clear complaint title.');
      return;
    }
    if (!specificLocation.trim()) {
      setErrorMsg('Please enter specific room, floor, or classroom location.');
      return;
    }
    if (!description.trim() || description.trim().length < 15) {
      setErrorMsg('Please provide a detailed description (at least 15 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const newId = await submitComplaint({
        title: title.trim(),
        category,
        description: description.trim(),
        building,
        specificLocation: specificLocation.trim(),
        priority,
        images,
      });

      setIsSubmitting(false);
      setSubmittedId(newId);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to submit complaint to Firestore');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Report a Campus or Hostel Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Submit details and photos. Fixora generates a live tracking ID and routes to the appropriate facility maintenance team.
        </p>
      </div>

      {/* Success Modal / Banner */}
      {submittedId && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 animate-in zoom-in-95">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Complaint Successfully Registered
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-emerald-950 mt-1">
                Tracking ID: <span className="font-mono text-red-700">{submittedId}</span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                Your ticket has been logged into the central facility queue. It is now visible to hostel wardens and campus administrators for assignment.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button
                  onClick={() => setCurrentView('track-complaint', submittedId)}
                  className="px-5 py-2.5 bg-red-700 text-white font-medium text-xs sm:text-sm rounded-xl hover:bg-red-800 transition-colors shadow-xs flex items-center gap-2"
                >
                  <span>Track Complaint Live</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSubmittedId(null);
                    setTitle('');
                    setDescription('');
                    setImages([]);
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Submit Another Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      {!submittedId && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Complaint Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wi-Fi router red light in 3rd floor corridor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Summarize the primary problem in 5–10 words.
            </p>
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Issue Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
              >
                <option value="Low">Low (Minor cosmetic / non-urgent)</option>
                <option value="Medium">Medium (Affecting single room or routine study)</option>
                <option value="High">High (Affecting multiple rooms / connectivity)</option>
                <option value="Urgent">Urgent (Safety risk, active flood, electrical sparks)</option>
              </select>
            </div>
          </div>

          {/* Building & Specific Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Campus Building / Hostel *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                >
                  {CAMPUS_BUILDINGS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Specific Location Details *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 302, 3rd Floor East Wing or Classroom 401"
                  value={specificLocation}
                  onChange={(e) => setSpecificLocation(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Provide context: When did it start? How severe is the issue? Has anyone else attempted to fix it?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Minimum 15 characters required</span>
              <span className="font-mono tabular-nums">{description.length} chars</span>
            </div>
          </div>

          {/* Photographs Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800">
                Upload Photographs of Issue (Multiple Allowed)
              </label>
              <span className="text-[11px] text-slate-400">
                {images.length} photo(s) selected
              </span>
            </div>

            {/* Firebase Cloud Storage Connection Info */}
            <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-950">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-700 shrink-0" />
                <span>
                  <strong>Cloud Storage:</strong> Photos upload directly to Firebase Storage bucket for estate records
                </span>
              </div>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-red-200 text-red-800 font-bold shrink-0 self-start sm:self-auto">
                Firebase Storage Live
              </span>
            </div>

            {/* Upload progress indicator */}
            {isUploadingImage && (
              <div className="p-3 bg-white rounded-xl border border-red-200 text-xs flex items-center gap-2.5 text-red-700 animate-pulse">
                <span className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-semibold">{uploadProgress}</span>
              </div>
            )}

            {/* Drop / File Input Zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-red-400 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-red-700 hover:underline">
                    Click to browse files
                  </span>{' '}
                  or drag and drop images here
                </div>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG, or WEBP up to 10MB each
                </p>
              </label>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video"
                  >
                    <img
                      src={imgUrl}
                      alt={`Issue photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-slate-900/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Profile Stamp */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <div>
              Reporting as: <strong className="text-slate-800">{currentUser?.name || 'Student'}</strong> (
              <span className="font-mono text-red-700 font-semibold">{currentUser?.studentId || '22BCE1084'}</span>)
            </div>
            <span className="text-[11px] text-slate-400">
              Auto-timestamps on submission
            </span>
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentView('student-dashboard')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <span>Submit Complaint</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
