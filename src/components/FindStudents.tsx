import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, YEARS, POPULAR_SKILLS } from '../data/mockData';
import { StudentAvatar } from './StudentAvatar';
import { ProjectPost } from '../types';
import {
  Search,
  Filter,
  X,
  Send,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Users,
  Briefcase,
  Layers,
  FolderPlus
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

export const FindStudents: React.FC = () => {
  const {
    allStudents,
    currentStudent,
    projectPosts,
    applyToProjectPost,
    setSelectedStudentForModal,
    setRequestModalRecipient,
    hasPendingRequestWith
  } = useApp();

  // Primary toggle: SkillMates Directory vs Campus Projects
  const [activeView, setActiveView] = useState<'students' | 'projects'>('students');

  // Student directory filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('All Skills');
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');

  // Project discovery filters
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProjectDept, setSelectedProjectDept] = useState('All Departments');

  // Modal: Apply / Request to join a project
  const [applyingPost, setApplyingPost] = useState<ProjectPost | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [pitchMessage, setPitchMessage] = useState('');

  // 1. Filter students
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesDept = student.department.toLowerCase().includes(q);
        const matchesBio = student.bio.toLowerCase().includes(q);
        const matchesSkills = student.skills.some((s) => s.toLowerCase().includes(q));
        const matchesInterests = student.interests.some((i) => i.toLowerCase().includes(q));

        if (!matchesName && !matchesDept && !matchesBio && !matchesSkills && !matchesInterests) {
          return false;
        }
      }

      if (selectedSkill !== 'All Skills') {
        const hasSkill = student.skills.some(
          (s) => s.toLowerCase() === selectedSkill.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      if (selectedDept !== 'All Departments') {
        if (student.department !== selectedDept) return false;
      }

      if (selectedYear !== 'All Years') {
        if (student.year !== selectedYear) return false;
      }

      return true;
    });
  }, [allStudents, searchQuery, selectedSkill, selectedDept, selectedYear]);

  // 2. Filter campus projects
  const filteredProjects = useMemo(() => {
    return projectPosts.filter((post) => {
      if (selectedCategory !== 'All Categories' && post.category !== selectedCategory) {
        return false;
      }

      if (
        selectedProjectDept !== 'All Departments' &&
        post.authorDepartment !== selectedProjectDept
      ) {
        return false;
      }

      if (projectSearchQuery.trim()) {
        const q = projectSearchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesDesc = post.description.toLowerCase().includes(q);
        const matchesAuthor = post.authorName.toLowerCase().includes(q);
        const matchesSkills = post.skillsRequired.some((s) => s.toLowerCase().includes(q));
        const matchesRoles = post.rolesNeeded.some((r) => r.toLowerCase().includes(q));
        return matchesTitle || matchesDesc || matchesAuthor || matchesSkills || matchesRoles;
      }

      return true;
    });
  }, [projectPosts, projectSearchQuery, selectedCategory, selectedProjectDept]);

  const hasActiveStudentFilters =
    searchQuery.trim() !== '' ||
    selectedSkill !== 'All Skills' ||
    selectedDept !== 'All Departments' ||
    selectedYear !== 'All Years';

  const clearAllStudentFilters = () => {
    setSearchQuery('');
    setSelectedSkill('All Skills');
    setSelectedDept('All Departments');
    setSelectedYear('All Years');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingPost) return;

    applyToProjectPost(applyingPost.id, selectedRole, pitchMessage);
    setApplyingPost(null);
    setSelectedRole('');
    setPitchMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Kamaladevi College · Talent &amp; Project Network
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            SkillMates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover peer students across departments or explore open campus projects to find your next team collaborator.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg shrink-0">
          <button
            onClick={() => setActiveView('students')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeView === 'students'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>SkillMates Profiles ({allStudents.length})</span>
          </button>
          <button
            onClick={() => setActiveView('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeView === 'projects'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Campus Projects ({projectPosts.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SKILLMATES STUDENT PROFILES */}
      {activeView === 'students' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, skill (e.g. React, Python), interest, or keyword..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 bg-slate-50 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter by:</span>
              </div>

              {/* Department */}
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              {/* Academic Year */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>

              {/* Skill */}
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
              >
                <option value="All Skills">All Skills</option>
                {POPULAR_SKILLS.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>

              {hasActiveStudentFilters && (
                <button
                  onClick={clearAllStudentFilters}
                  className="text-xs text-blue-700 hover:text-blue-900 font-medium underline ml-auto"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Quick Skill Filter Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-slate-400 font-medium shrink-0">Popular:</span>
              {POPULAR_SKILLS.slice(0, 7).map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(selectedSkill === skill ? 'All Skills' : skill)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors shrink-0 ${
                    selectedSkill === skill
                      ? 'bg-blue-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Student Cards Grid */}
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStudents.map((student) => {
                const isCurrentUser = currentStudent?.id === student.id;
                const relationship = hasPendingRequestWith(student.id);

                return (
                  <div
                    key={student.id}
                    className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                      isCurrentUser
                        ? 'border-blue-300 ring-1 ring-blue-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Info Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <StudentAvatar name={student.name} size="md" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3
                                onClick={() => setSelectedStudentForModal(student)}
                                className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer text-sm tracking-tight"
                              >
                                {student.name}
                              </h3>
                              {isCurrentUser && (
                                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {student.department}
                            </p>
                            <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded mt-1">
                              {student.year}
                            </span>
                          </div>
                        </div>

                        {student.lookingForPartner && !isCurrentUser && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {student.bio}
                      </p>

                      {/* Skills */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Technical Skills
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {student.skills.slice(0, 5).map((sk) => (
                            <span
                              key={sk}
                              className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                                selectedSkill.toLowerCase() === sk.toLowerCase()
                                  ? 'bg-blue-800 text-white'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {sk}
                            </span>
                          ))}
                          {student.skills.length > 5 && (
                            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                              +{student.skills.length - 5}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Past Projects Preview */}
                      {student.projects && student.projects.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Featured Project
                          </span>
                          <p className="text-xs text-slate-700 font-medium truncate">
                            {student.projects[0].title}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedStudentForModal(student)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1.5"
                      >
                        View Profile
                      </button>

                      {!isCurrentUser && (
                        <>
                          {relationship === 'partner' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Project Partner</span>
                            </span>
                          ) : relationship === 'sent' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Request Sent</span>
                            </span>
                          ) : relationship === 'received' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Request Received</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => setRequestModalRecipient(student)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Send Request</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No students found</h3>
              <p className="text-xs text-slate-500">
                No students match your filter criteria. Try adjusting your search query or reset filters.
              </p>
              <button
                onClick={clearAllStudentFilters}
                className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CAMPUS PROJECTS DISCOVERY */}
      {activeView === 'projects' && (
        <div className="space-y-6">
          {/* Project Search & Filter Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  placeholder="Search campus projects by title, skill (e.g. React, Python), role or lead..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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

                <select
                  value={selectedProjectDept}
                  onChange={(e) => setSelectedProjectDept(e.target.value)}
                  className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                {(selectedCategory !== 'All Categories' ||
                  selectedProjectDept !== 'All Departments' ||
                  projectSearchQuery.trim()) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All Categories');
                      setSelectedProjectDept('All Departments');
                      setProjectSearchQuery('');
                    }}
                    className="text-xs text-blue-700 hover:text-blue-900 font-medium underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Project Post Cards Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredProjects.map((post) => {
                const isAuthor = currentStudent && post.authorId === currentStudent.id;
                const hasApplied = currentStudent && post.interestedStudentIds.includes(currentStudent.id);
                const authorStudent = allStudents.find((s) => s.id === post.authorId);
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
                      {/* Category & Status Bar */}
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
                          Looking For SkillMates:
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

                      {/* Desired Skills */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Key Technologies / Skills:
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

                    {/* Card Footer: Author Info & Action Buttons */}
                    <div className="pt-5 mt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Author badge */}
                      <div className="flex items-center gap-2.5">
                        <StudentAvatar name={post.authorName} size="sm" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              {post.authorName}
                            </span>
                            {isAuthor && (
                              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {post.authorDepartment} · {post.authorYear}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        {authorStudent && !isAuthor && (
                          <button
                            onClick={() => setSelectedStudentForModal(authorStudent)}
                            className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1"
                          >
                            Profile
                          </button>
                        )}

                        {isAuthor ? (
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                            Your Project Post
                          </span>
                        ) : hasApplied ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Applied to Join</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setApplyingPost(post);
                              setSelectedRole(post.rolesNeeded[0] || 'Team Collaborator');
                              setPitchMessage('');
                            }}
                            disabled={post.status === 'closed'}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Request to Join</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No campus projects found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No project openings match your current search and filter selections.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Apply to Project / Request as SkillMate */}
      {applyingPost && currentStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Request to Join Team
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Apply as a SkillMate for "{applyingPost.title}"
                </p>
              </div>
              <button
                onClick={() => setApplyingPost(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg text-xs space-y-1">
              <div className="font-bold text-blue-950">
                Project Lead: {applyingPost.authorName} ({applyingPost.authorDepartment} · {applyingPost.authorYear})
              </div>
              <div className="text-blue-800">
                Category: {applyingPost.category}
              </div>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Role You Want to Fill *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                >
                  {applyingPost.rolesNeeded.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="General Contributor">General Contributor / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pitch Note to {applyingPost.authorName}
                </label>
                <textarea
                  rows={4}
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  placeholder={`Hi ${applyingPost.authorName}, I would love to collaborate on ${applyingPost.title}. I have experience with ${currentStudent.skills.slice(0, 3).join(', ')}...`}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 resize-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  This sends a formal project partnership request directly to their SkillMate Requests inbox.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setApplyingPost(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request to Join</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
