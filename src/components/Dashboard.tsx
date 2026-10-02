import React from 'react';
import { useApp } from '../context/AppContext';
import { StudentAvatar } from './StudentAvatar';
import {
  Compass,
  Edit3,
  Inbox,
  UserCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  FolderPlus
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    currentStudent,
    setActiveTab,
    getReceivedRequests,
    getSentRequests,
    getMyPartners,
    acceptRequest,
    rejectRequest,
    setSelectedStudentForModal
  } = useApp();

  if (!currentStudent) return null;

  const receivedRequests = getReceivedRequests();
  const pendingReceived = receivedRequests.filter((r) => r.status === 'pending');
  const sentRequests = getSentRequests();
  const partners = getMyPartners();

  // Profile completion calculation
  const checks = [
    { label: 'Short bio written', done: Boolean(currentStudent.bio && currentStudent.bio.length > 20) },
    { label: 'At least 3 skills listed', done: currentStudent.skills.length >= 3 },
    { label: 'Areas of interest added', done: currentStudent.interests.length >= 1 },
    { label: 'Previous project added', done: currentStudent.projects && currentStudent.projects.length >= 1 },
    { label: 'Contact information verified', done: Boolean(currentStudent.contact?.email) }
  ];
  const completedCount = checks.filter((c) => c.done).length;
  const completionPercentage = Math.round((completedCount / checks.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Welcome Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start gap-4 sm:gap-5">
          <StudentAvatar name={currentStudent.name} size="xl" className="rounded-xl" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                SkillMate Student Portal
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">{currentStudent.college}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Welcome back, {currentStudent.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {currentStudent.department} · {currentStudent.year} · Kamaladevi College
            </p>
          </div>
        </div>

        {/* Quick Primary Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('project-board')}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Project Board</span>
          </button>
          <button
            onClick={() => setActiveTab('find-students')}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>SkillMates</span>
          </button>
          <button
            onClick={() => setActiveTab('my-profile')}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => setActiveTab('my-profile')}
          className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">My Skills</span>
            <Layers className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {currentStudent.skills.length}
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {currentStudent.skills.slice(0, 3).join(', ')}...
          </p>
        </div>

        <div
          onClick={() => setActiveTab('requests')}
          className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Received Requests</span>
            <Inbox className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {pendingReceived.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {pendingReceived.length === 1 ? '1 pending review' : `${pendingReceived.length} pending review`}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('requests')}
          className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Sent Requests</span>
            <Inbox className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {sentRequests.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {sentRequests.filter((r) => r.status === 'accepted').length} accepted
          </p>
        </div>

        <div
          onClick={() => setActiveTab('partners')}
          className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Project Partners</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {partners.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Active team collaborators</p>
        </div>
      </div>

      {/* 3. Main Dashboard Body: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols wide on desktop): Requests & Partners */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Requests Needing Attention */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Project Partnership Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Students requesting to team up with you for projects
                </p>
              </div>
              <button
                onClick={() => setActiveTab('requests')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingReceived.length > 0 ? (
              <div className="space-y-4">
                {pendingReceived.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <StudentAvatar name={req.senderName} size="md" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {req.senderName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {req.senderDepartment} · {req.senderYear}
                          </div>
                          <div className="text-xs font-semibold text-blue-800 mt-1">
                            Project: {req.projectTitle}
                          </div>
                          <div className="text-xs text-slate-600 font-medium mt-0.5">
                            Role: {req.roleNeeded}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                        Pending
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 bg-white p-2.5 rounded border border-slate-200 leading-relaxed italic">
                      "{req.message}"
                    </p>

                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => rejectRequest(req.id)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => acceptRequest(req.id)}
                        className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Form Team</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No pending received requests</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  When other students discover your skills and invite you, proposals will appear here.
                </p>
                <button
                  onClick={() => setActiveTab('find-students')}
                  className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 bg-white border border-slate-200 rounded shadow-xs"
                >
                  Browse Campus Students
                </button>
              </div>
            )}
          </div>

          {/* Current Project Partners */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Current Project Partners
                </h3>
                <p className="text-xs text-slate-500">
                  Active student collaborations and capstone project teams
                </p>
              </div>
              <button
                onClick={() => setActiveTab('partners')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <span>Manage Teams</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {partners.length > 0 ? (
              <div className="space-y-3">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <StudentAvatar name={partner.partnerStudent.name} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {partner.partnerStudent.name}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500">
                            {partner.partnerStudent.department}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-blue-800 mt-0.5">
                          {partner.projectTitle}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {partner.partnerStudent.skills.slice(0, 3).map((sk) => (
                            <span
                              key={sk}
                              className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {partner.status}
                      </span>
                      <button
                        onClick={() => setSelectedStudentForModal(partner.partnerStudent)}
                        className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No project partners yet</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Discover students with complementary skills and send partnership requests!
                </p>
                <button
                  onClick={() => setActiveTab('find-students')}
                  className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 bg-white border border-slate-200 rounded shadow-xs"
                >
                  Find Project Partners
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile Completion & My Skills */}
        <div className="space-y-6">
          {/* Profile Completion Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Profile Completion</h3>
              <span className="text-xs font-bold text-blue-700 tabular-nums">
                {completionPercentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-blue-700 h-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="space-y-2">
              {checks.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className={item.done ? 'text-slate-700' : 'text-slate-400'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {completionPercentage < 100 && (
              <button
                onClick={() => setActiveTab('my-profile')}
                className="mt-4 w-full py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Complete Profile
              </button>
            )}
          </div>

          {/* My Skills Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">My Listed Skills</h3>
              <button
                onClick={() => setActiveTab('my-profile')}
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {currentStudent.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2">My Areas of Interest</h4>
              <div className="flex flex-wrap gap-1.5">
                {currentStudent.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-50 border border-blue-100 rounded-md"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mini Project Campus Workflow Guide */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>Campus Project Flow</span>
            </div>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Keep your profile, skills, and past work updated.</li>
              <li>Filter students by skills your project requires.</li>
              <li>Send a polite project request describing the scope.</li>
              <li>Once accepted, collaborate and manage team status.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
