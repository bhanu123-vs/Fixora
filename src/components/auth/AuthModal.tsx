import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_BUILDINGS } from '../../data/mockData';
import { ASSETS } from '../../constants/assets';
import { UserRole } from '../../types';
import {
  X,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  Wrench,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'student',
}) => {
  const {
    login,
    loginGoogle,
    loginEmailPassword,
    registerEmailPassword,
    isFirebaseConnected,
  } = useApp();

  const [tab, setTab] = useState<'demo' | 'login' | 'register'>('demo');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Custom login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regYear, setRegYear] = useState('2nd Year (B.Tech)');
  const [regHostel, setRegHostel] = useState(CAMPUS_BUILDINGS[0]);
  const [regRoom, setRegRoom] = useState('Room 214');
  const [regPhone, setRegPhone] = useState('+91 98765 00000');
  const [regSpecialty, setRegSpecialty] = useState('Electrician');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      await loginGoogle();
      onClose();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setIsLoading(true);
    setAuthError('');
    try {
      await loginEmailPassword(loginEmail.trim(), loginPassword);
      onClose();
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setAuthError(
          'Account not found. Please click "Register" tab to create your credentials or use 1-Click Demo.'
        );
      } else {
        setAuthError(err.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAuthError('Please fill in name, email, and password');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await registerEmailPassword(regEmail.trim(), regPassword, {
        role: selectedRole,
        name: regName.trim(),
        department: regDept,
        studentId: selectedRole === 'student' ? regStudentId : undefined,
        yearOfStudy: selectedRole === 'student' ? regYear : undefined,
        hostelBlock: regHostel,
        roomNumber: regRoom,
        phone: regPhone,
        specialty: selectedRole === 'maintenance_staff' ? regSpecialty : undefined,
      });
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please sign in instead.');
      } else {
        setAuthError(err.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img src={ASSETS.FIXORA_LOGO} alt="Fixora" className="h-8 w-auto object-contain" />
            <div className="h-6 w-px bg-slate-200" />
            <img src={ASSETS.VIT_AP_LOGO} alt="VIT-AP University" className="h-8 w-auto object-contain" />
            <div>
              <span className="text-sm font-black tracking-tight text-slate-950 block leading-tight">
                VIT-AP Portal
              </span>
              <span className="text-[10px] text-red-700 font-bold tracking-wide">Report It. Track It. Fix It.</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
            Firebase Live
          </span>
        </div>

        {/* Google One-Tap / Firebase Auth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full mb-4 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:border-slate-400"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google (@vitap.ac.in)</span>
        </button>

        <div className="relative flex py-1.5 items-center mb-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400">
            or sign in with email / demo
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setTab('demo');
              setAuthError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'demo'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            1-Click Demo
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setAuthError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setAuthError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Register
          </button>
        </div>

        {/* TAB 1: 1-Click Evaluator Demo */}
        {tab === 'demo' && (
          <div className="space-y-3">
            <div className="p-3 bg-red-50/70 rounded-xl border border-red-100 text-xs text-slate-700 leading-relaxed">
              <strong className="text-red-950 font-bold block mb-0.5">
                VIT-AP Evaluation Test Credentials
              </strong>
              One-click access to explore Student, Hostel Warden, and Admin roles.
            </div>

            {/* Student card */}
            <div
              onClick={() => {
                login('student');
                onClose();
              }}
              className="group p-3.5 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                      Priya Sharma (22BCE1084)
                    </h3>
                    <span className="text-[10px] font-semibold bg-red-100 text-red-800 px-1.5 py-0.2 rounded">
                      Student
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    3rd Year CSE · LH-1 Ladies Hostel (Room 302)
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-700 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Warden card */}
            <div
              onClick={() => {
                login('warden');
                onClose();
              }}
              className="group p-3.5 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                      Prof. S. N. Joshi
                    </h3>
                    <span className="text-[10px] font-semibold bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded">
                      Hostel Warden
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assigned: LH-1 & LH-2 Ladies Hostels
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Admin card */}
            <div
              onClick={() => {
                login('admin');
                onClose();
              }}
              className="group p-3.5 rounded-xl border border-slate-200 hover:border-red-700 hover:bg-red-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-950 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                      Dr. Rajesh Kulkarni
                    </h3>
                    <span className="text-[10px] font-semibold bg-red-100 text-red-800 px-1.5 py-0.2 rounded">
                      Estate Officer
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Estate & Campus Facilities Office · Central Block
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-700 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        )}

        {/* TAB 2: Real Firebase Email Sign In */}
        {tab === 'login' && (
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email (@vitap.ac.in)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name.22bce1084@vitap.ac.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In via Firebase Auth</span>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: Student Registration */}
        {tab === 'register' && (
          <form onSubmit={handleCustomRegister} className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            <div className="flex items-center gap-2 mb-1">
              <label className="text-xs font-semibold text-slate-700">Account Type:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="px-2 py-1 text-xs bg-slate-100 rounded-md font-medium text-slate-700 border border-slate-200"
              >
                <option value="student">Student / Resident</option>
                <option value="warden">Hostel Warden</option>
                <option value="maintenance_staff">Maintenance Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ananya Sen"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name.22bce1084@vitap.ac.in"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password (min. 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            {selectedRole === 'student' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student ID (Reg. No.)
                  </label>
                  <input
                    type="text"
                    placeholder="22BCE1084"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    placeholder="Room 214"
                    value={regRoom}
                    onChange={(e) => setRegRoom(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hostel / Residence Block
              </label>
              <select
                value={regHostel}
                onChange={(e) => setRegHostel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-600"
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
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Creating Firebase Account...' : 'Register in Firebase'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
