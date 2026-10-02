import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, YEARS } from '../data/mockData';
import { AcademicYear } from '../types';
import {
  LogIn,
  UserPlus,
  AlertCircle,
  GraduationCap,
  Layers,
  Search,
  Send,
  UserCheck,
  Code2,
  Cpu,
  Database,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form with simple student / student123 credentials
  const [loginId, setLoginId] = useState('student');
  const [loginPassword, setLoginPassword] = useState('student123');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science');
  const [regYear, setRegYear] = useState<AcademicYear>('3rd Year');
  const [regCollege, setRegCollege] = useState('Kamaladevi College');
  const [regSkills, setRegSkills] = useState('');
  const [regBio, setRegBio] = useState('');

  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim()) {
      setError('Please enter your Student ID.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    const success = login(loginId, loginPassword);
    if (!success) {
      setError('Invalid credentials. Use ID: student and Password: student123 (or your registered email).');
    } else {
      setError('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Please provide a valid college email address.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    const skillsArray = regSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const success = register({
      name: regName,
      email: regEmail,
      department: regDepartment,
      year: regYear,
      college: regCollege.trim() || 'Kamaladevi College',
      skills: skillsArray.length > 0 ? skillsArray : undefined,
      bio: regBio
    });

    if (success) {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-xs tracking-wider">
              SM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  SkillMate
                </span>
                <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                  Campus Platform
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium block leading-none mt-0.5">
                Kamaladevi College · Student Skills &amp; Project Partners
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span>B.Sc. Computer Science Mini Project</span>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (Why, What, How & Tech Stack) - 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mission Hero Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>Student Collaboration Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Connect by skills. <br />
                Build stronger college project teams.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
                SkillMate is an academic collaboration hub built for students of <span className="font-semibold text-slate-800">Kamaladevi College</span> to discover peer talent, exchange project requests, and form balanced project teams.
              </p>
            </div>

            {/* Section 1: WHY */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-xs">
                  01
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Why was SkillMate made?
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                During semester mini projects, capstones, and hackathons, students frequently struggle to find partners with complementary technical skills. Most teams form randomly or purely within immediate friend circles, leaving projects with duplicate skills (e.g. four frontend developers and no backend lead) or abandoned codebases.
              </p>
              <div className="bg-slate-50 border-l-4 border-blue-700 p-3 rounded-r-lg text-xs text-slate-700 font-medium">
                SkillMate bridges this campus divide by allowing students to discover collaborators based on proven technical competencies, department strengths, and shared project vision.
              </div>
            </div>

            {/* Section 2: WHAT */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-xs">
                  02
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  What does SkillMate do?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 mb-1">
                    <Search className="w-4 h-4 text-blue-700" />
                    <span>Skill-Based Discovery</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Search and filter students across Computer Science, Data Science, IT, and ECE by programming language, framework, or academic year.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 mb-1">
                    <Send className="w-4 h-4 text-blue-700" />
                    <span>Partnership Requests</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Send structured proposals stating your project concept, the specific role needed, and custom collaboration notes.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 mb-1">
                    <UserCheck className="w-4 h-4 text-blue-700" />
                    <span>Mutual Team Formation</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Once a request is accepted, students automatically form a confirmed project partnership with contact channels.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 mb-1">
                    <Layers className="w-4 h-4 text-blue-700" />
                    <span>Project Workspace</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Track live project statuses (Planning, In Progress, Completed), record team meeting logs, and milestone deadlines.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: HOW (TECH STACK) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-xs">
                    03
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    How is it built? (Tech Stack)
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  B.Sc. CS Mini Project
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Frontend Core
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Code2 className="w-3.5 h-3.5 text-blue-700" />
                    React 19 + Vite
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Type Safety
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-700" />
                    TypeScript
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Design System
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Layers className="w-3.5 h-3.5 text-blue-700" />
                    Tailwind CSS
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Persistence
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Database className="w-3.5 h-3.5 text-blue-700" />
                    LocalStorage State
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Symbols &amp; Icons
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                    Lucide React
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Architecture
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                    Single Student RBAC
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Simple ID & Password Login) - 5 Columns */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Card Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Student Sign In
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your credentials to access the SkillMate student portal.
                </p>
              </div>

              {/* Segmented Auth Mode Switch */}
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'login'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'register'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register Student
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form: Sign In */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student ID / Email *
                    </label>
                    <input
                      type="text"
                      required
                      value={loginId}
                      onChange={(e) => {
                        setLoginId(e.target.value);
                        setError('');
                      }}
                      placeholder="student"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="student123"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 group"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In &amp; Enter Dashboard</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Form: Register */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      College Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rahul.sharma@kamaladevi.edu"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department *
                      </label>
                      <select
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                      >
                        {DEPARTMENTS.filter((d) => d !== 'All Departments').map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Academic Year *
                      </label>
                      <select
                        value={regYear}
                        onChange={(e) => setRegYear(e.target.value as AcademicYear)}
                        className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                      >
                        {YEARS.filter((y) => y !== 'All Years').map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      College Name
                    </label>
                    <input
                      type="text"
                      value={regCollege}
                      onChange={(e) => setRegCollege(e.target.value)}
                      placeholder="Kamaladevi College"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={regSkills}
                      onChange={(e) => setRegSkills(e.target.value)}
                      placeholder="React, Python, PostgreSQL, Machine Learning"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Brief Bio (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="State what projects you want to build or what skills you contribute..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 resize-none"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Register &amp; Enter Dashboard</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SkillMate</span>
            <span aria-hidden="true">·</span>
            <span>Student Skills &amp; Project Partners</span>
            <span aria-hidden="true">·</span>
            <span>Kamaladevi College</span>
          </div>
          <div className="text-slate-400">
            Designed for B.Sc. Computer Science Mini Project Evaluation
          </div>
        </div>
      </footer>
    </div>
  );
};
