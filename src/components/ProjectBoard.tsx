import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StudentAvatar } from './StudentAvatar';
import { DEPARTMENTS } from '../data/mockData';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Briefcase,
  X,
  Layers,
  AlertCircle,
  FolderPlus,
  Inbox,
  UserCheck,
  XCircle,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Capstone Mini Project',
  'Semester Course Mini Project',
  'Research Project',
  'Hardware & IoT Mini Project',
  'Final Year Capstone',
  'Hackathon & Competition'
];

interface ProjectBoardProps {
  initialTab?: 'my-posts' | 'received-requests' | 'sent-requests';
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ initialTab }) => {
  const {
    projectPosts,
    currentStudent,
    createProjectPost,
    deleteProjectPost,
    toggleProjectPostStatus,
    getReceivedRequests,
    getSentRequests,
    acceptRequest,
    rejectRequest,
    setActiveTab,
    setSelectedStudentForModal,
    allStudents
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'my-posts' | 'received-requests' | 'sent-requests'
  >(initialTab || 'my-posts');

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Modal: Upload / Create Project Post
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[1]);
  const [newDescription, setNewDescription] = useState('');
  const [newRoles, setNewRoles] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newTeamSize, setNewTeamSize] = useState(3);
  const [uploadError, setUploadError] = useState('');

  if (!currentStudent) return null;

  const receivedRequests = getReceivedRequests();
  const sentRequests = getSentRequests();
  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'pending').length;

  // Filter my uploaded posts
  const myPosts = projectPosts.filter((post) => post.authorId === currentStudent.id);
  const filteredMyPosts = myPosts.filter((post) => {
    if (selectedCategory !== 'All Categories' && post.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(q);
      const matchesDesc = post.description.toLowerCase().includes(q);
      const matchesSkills = post.skillsRequired.some((s) => s.toLowerCase().includes(q));
      const matchesRoles = post.rolesNeeded.some((r) => r.toLowerCase().includes(q));
      return matchesTitle || matchesDesc || matchesSkills || matchesRoles;
    }

    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setUploadError('Please provide a project title.');
      return;
    }
    if (!newDescription.trim() || newDescription.trim().length < 20) {
      setUploadError('Please describe your project idea in at least 20 characters.');
      return;
    }
    if (!newRoles.trim()) {
      setUploadError('Please specify at least one role needed (e.g. Frontend Dev, ML Engineer).');
      return;
    }

    const rolesArr = newRoles
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const skillsArr = newSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createProjectPost({
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      rolesNeeded: rolesArr,
      skillsRequired: skillsArr.length > 0 ? skillsArr : ['General Problem Solving'],
      teamSize: Number(newTeamSize) || 2
    });

    // Reset and close
    setNewTitle('');
    setNewDescription('');
    setNewRoles('');
    setNewSkills('');
    setNewTeamSize(3);
    setUploadError('');
    setShowUploadModal(false);
    setActiveSubTab('my-posts');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Upload CTA */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Campus Project Board
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Kamaladevi College</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Project Board
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Upload your project requests to recruit skillmates and manage incoming and sent partnership requests.
          </p>
        </div>

        <button
          onClick={() => {
            setUploadError('');
            setShowUploadModal(true);
          }}
          className="px-5 py-2.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg shadow-xs transition-colors flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Upload Project Request</span>
        </button>
      </div>

      {/* Main Navigation Sub-Tab Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Sub-tab 1: My Uploaded Projects */}
          <button
            onClick={() => setActiveSubTab('my-posts')}
            className={`flex items-center gap-2 py-2 px-3 sm:px-4 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'my-posts'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>My Uploaded Requests</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeSubTab === 'my-posts'
                  ? 'bg-blue-900 text-blue-100'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {myPosts.length}
            </span>
          </button>

          {/* Sub-tab 2: Received Requests */}
          <button
            onClick={() => setActiveSubTab('received-requests')}
            className={`flex items-center gap-2 py-2 px-3 sm:px-4 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'received-requests'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Received Requests</span>
            {pendingReceivedCount > 0 ? (
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full tabular-nums">
                {pendingReceivedCount} pending
              </span>
            ) : (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeSubTab === 'received-requests'
                    ? 'bg-blue-900 text-blue-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {receivedRequests.length}
              </span>
            )}
          </button>

          {/* Sub-tab 3: Sent Requests */}
          <button
            onClick={() => setActiveSubTab('sent-requests')}
            className={`flex items-center gap-2 py-2 px-3 sm:px-4 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'sent-requests'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sent Requests</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeSubTab === 'sent-requests'
                  ? 'bg-blue-900 text-blue-100'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {sentRequests.length}
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MY UPLOADED REQUESTS */}
      {activeSubTab === 'my-posts' && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter your requests by title, role or skill..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {(selectedCategory !== 'All Categories' || searchQuery.trim()) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All Categories');
                      setSearchQuery('');
                    }}
                    className="text-xs text-blue-700 hover:text-blue-900 font-medium underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* My Uploaded Cards Grid */}
          {filteredMyPosts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredMyPosts.map((post) => {
                const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-4">
                      {/* Top Bar: Category & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                          {post.category}
                        </span>

                        <div className="flex items-center gap-2">
                          {post.status === 'open' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Recruiting</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                              <span>Closed</span>
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">{formattedDate}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {post.description}
                        </p>
                      </div>

                      {/* Roles Needed */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Roles Needed:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {post.rolesNeeded.map((role) => (
                            <span
                              key={role}
                              className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md flex items-center gap-1"
                            >
                              <Briefcase className="w-3 h-3 text-blue-700" />
                              <span>{role}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Required Skills */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Skills &amp; Tech Stack:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {post.skillsRequired.map((skill) => (
                            <span
                              key={skill}
                              className="text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer: Capacity info and management buttons */}
                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Team Target: </span>
                        <span>{post.teamSize} Students</span>
                        {post.interestedStudentIds.length > 0 && (
                          <span className="ml-2 font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {post.interestedStudentIds.length} interested
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleProjectPostStatus(post.id)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                        >
                          {post.status === 'open' ? 'Mark Closed' : 'Re-open'}
                        </button>
                        <button
                          onClick={() => deleteProjectPost(post.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Project Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <FolderPlus className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">
                {myPosts.length === 0 ? 'No uploaded project requests yet' : 'No matching project requests'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {myPosts.length === 0
                  ? "Upload your project idea to start recruiting skillmates across Kamaladevi College."
                  : 'Try changing or resetting your search and category filters.'}
              </p>
              <button
                onClick={() => {
                  setUploadError('');
                  setShowUploadModal(true);
                }}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Upload New Project Request</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: RECEIVED REQUESTS */}
      {activeSubTab === 'received-requests' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Received Project Requests</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review partnership requests and applications sent to you by fellow students.
              </p>
            </div>
            {pendingReceivedCount > 0 && (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                {pendingReceivedCount} awaiting response
              </span>
            )}
          </div>

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
                  {/* Top Row: Sender Info & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <StudentAvatar name={req.senderName} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{req.senderName}</h3>
                          {sender && (
                            <button
                              onClick={() => setSelectedStudentForModal(sender)}
                              className="text-xs text-blue-700 hover:text-blue-900 font-medium"
                            >
                              View Profile
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {req.senderDepartment} · {req.senderYear}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {req.senderSkills.map((sk) => (
                            <span
                              key={sk}
                              className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start">
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Response</span>
                        </span>
                      )}
                      {req.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accepted Partner</span>
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-100">
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Declined</span>
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{formattedDate}</span>
                    </div>
                  </div>

                  {/* Proposed Project & Message Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Proposed Project: </span>
                        <span className="font-bold text-slate-900">{req.projectTitle}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Role Needed: </span>
                        <span className="font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                          {req.roleNeeded}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-slate-200/60">
                      "{req.message}"
                    </p>
                  </div>

                  {/* Accept / Reject Action Bar */}
                  {req.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => rejectRequest(req.id)}
                        className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => acceptRequest(req.id)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Accept &amp; Form Partner Team</span>
                      </button>
                    </div>
                  ) : req.status === 'accepted' ? (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setActiveTab('partners')}
                        className="text-xs text-blue-800 hover:text-blue-950 font-bold inline-flex items-center gap-1"
                      >
                        <span>Open in My Partners Workspace</span>
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
              <h3 className="text-base font-bold text-slate-900">No received requests yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                When fellow students request to join your project ideas or send direct collaboration invitations, they will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: SENT REQUESTS */}
      {activeSubTab === 'sent-requests' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Sent Project Requests</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track status of collaboration proposals you sent to other students or project posts.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Total Sent: {sentRequests.length}
            </span>
          </div>

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
                          <h3 className="text-sm font-bold text-slate-900">
                            Sent to: {req.recipientName}
                          </h3>
                          {recipient && (
                            <button
                              onClick={() => setSelectedStudentForModal(recipient)}
                              className="text-xs text-blue-700 hover:text-blue-900 font-medium"
                            >
                              View Profile
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {recipient?.department} · {recipient?.year}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start">
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Awaiting Response</span>
                        </span>
                      )}
                      {req.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accepted</span>
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-100">
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Declined</span>
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{formattedDate}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Target Project: </span>
                        <span className="font-bold text-slate-900">{req.projectTitle}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Applied Role: </span>
                        <span className="font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                          {req.roleNeeded}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-slate-200/60">
                      "{req.message}"
                    </p>
                  </div>

                  {req.status === 'accepted' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setActiveTab('partners')}
                        className="text-xs text-blue-800 hover:text-blue-950 font-bold inline-flex items-center gap-1"
                      >
                        <span>Open in My Partners Workspace</span>
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
              <h3 className="text-base font-bold text-slate-900">No sent requests yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore SkillMates to discover peers and open campus projects to send your first collaboration proposal.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Upload Project Request */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upload Project &amp; Request SkillMates
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kamaladevi College · Campus Collaboration Board
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Automated Campus Attendance via Face Recognition"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Team Size (Students)
                  </label>
                  <select
                    value={newTeamSize}
                    onChange={(e) => setNewTeamSize(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                  >
                    <option value={2}>2 Members (Pair)</option>
                    <option value={3}>3 Members (Standard Mini Project)</option>
                    <option value={4}>4 Members (Capstone Group)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SkillMates &amp; Roles Needed (Comma Separated) *
                </label>
                <input
                  type="text"
                  required
                  value={newRoles}
                  onChange={(e) => setNewRoles(e.target.value)}
                  placeholder="e.g. UI/UX Designer, FastAPI Backend Specialist, Computer Vision Engineer"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Specify the functional roles you are looking to recruit into your team.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Desired Technical Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="e.g. Python, OpenCV, React, PostgreSQL"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Concept &amp; Collaboration Pitch *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe your project goals, what parts are underway, and what kind of commitment you expect from teammates..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Campus Board</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
