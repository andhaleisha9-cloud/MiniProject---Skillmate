import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentAvatar } from './StudentAvatar';
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const ProjectRequests: React.FC = () => {
  const {
    getReceivedRequests,
    getSentRequests,
    acceptRequest,
    rejectRequest,
    setActiveTab,
    setSelectedStudentForModal,
    allStudents
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'received' | 'sent'>('received');

  const receivedRequests = getReceivedRequests();
  const sentRequests = getSentRequests();

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Requests</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage partnership proposals received from peers and track requests you sent
        </p>
      </div>

      {/* Segmented Sub-Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-sm">
        <button
          onClick={() => setActiveSubTab('received')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
            activeSubTab === 'received'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Received</span>
          {pendingReceivedCount > 0 && (
            <span className="text-[11px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full tabular-nums">
              {pendingReceivedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('sent')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
            activeSubTab === 'sent'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Sent</span>
          <span className="text-[11px] font-medium text-slate-500 tabular-nums">
            ({sentRequests.length})
          </span>
        </button>
      </div>

      {/* Content Area */}
      {activeSubTab === 'received' ? (
        <div className="space-y-4">
          {receivedRequests.length > 0 ? (
            receivedRequests.map((req) => {
              const sender = allStudents.find((s) => s.id === req.senderId);
              const formattedDate = new Date(req.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <StudentAvatar name={req.senderName} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{req.senderName}</h3>
                          {sender && (
                            <button
                              onClick={() => setSelectedStudentForModal(sender)}
                              className="text-xs text-blue-700 hover:underline font-medium"
                            >
                              View Profile
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {req.senderDepartment} · {req.senderYear}
                        </p>

                        {/* Skills Chips */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {req.senderSkills.map((sk) => (
                            <span
                              key={sk}
                              className="text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Status / Timestamp */}
                    <div className="sm:text-right shrink-0">
                      {req.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending Response</span>
                        </span>
                      ) : req.status === 'accepted' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Accepted (In Partners)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>Declined</span>
                        </span>
                      )}
                      <div className="text-[11px] text-slate-400 mt-1">{formattedDate}</div>
                    </div>
                  </div>

                  {/* Proposal Details */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <div className="font-semibold text-slate-900">
                        Project Concept: <span className="text-blue-800 font-bold">{req.projectTitle}</span>
                      </div>
                      <div className="text-slate-600">
                        Requested Role: <span className="font-medium text-slate-800">{req.roleNeeded}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-slate-200/60 whitespace-pre-line">
                      "{req.message}"
                    </p>
                  </div>

                  {/* Action Buttons for Pending */}
                  {req.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => rejectRequest(req.id)}
                        className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Decline Request
                      </button>
                      <button
                        onClick={() => acceptRequest(req.id)}
                        className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Form Team</span>
                      </button>
                    </div>
                  ) : req.status === 'accepted' ? (
                    <div className="flex items-center justify-end pt-1">
                      <button
                        onClick={() => setActiveTab('partners')}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                      >
                        <span>Open in My Partners</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <Inbox className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No requests received yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Make sure your skills and bio are up to date on your profile so other students can discover you!
              </p>
              <button
                onClick={() => setActiveTab('my-profile')}
                className="mt-4 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Review Profile Skills
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Sent Requests Tab */
        <div className="space-y-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => {
              const recipient = allStudents.find((s) => s.id === req.recipientId);
              const formattedDate = new Date(req.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <StudentAvatar name={req.recipientName} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{req.recipientName}</h3>
                          {recipient && (
                            <button
                              onClick={() => setSelectedStudentForModal(recipient)}
                              className="text-xs text-blue-700 hover:underline font-medium"
                            >
                              View Profile
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {recipient?.department} · {recipient?.year}
                        </p>
                        <div className="text-xs font-semibold text-blue-800 mt-1">
                          Proposed Project: {req.projectTitle}
                        </div>
                        <div className="text-xs text-slate-600 font-medium mt-0.5">
                          Role: {req.roleNeeded}
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      {req.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Status: Pending</span>
                        </span>
                      ) : req.status === 'accepted' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Status: Accepted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>Status: Rejected</span>
                        </span>
                      )}
                      <div className="text-[11px] text-slate-400 mt-1">{formattedDate}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-700 border border-slate-100 leading-relaxed italic">
                    "{req.message}"
                  </div>

                  {req.status === 'accepted' && (
                    <div className="flex items-center justify-end pt-1">
                      <button
                        onClick={() => setActiveTab('partners')}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                      >
                        <span>Collaborate in My Partners</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <Send className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No requests sent yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Browse peer students on the discovery page and propose teaming up for course mini projects or hackathons.
              </p>
              <button
                onClick={() => setActiveTab('find-students')}
                className="mt-4 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Find Students
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
