import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, YEARS, POPULAR_SKILLS } from '../data/mockData';
import { AcademicYear, PastProject } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  Edit3,
  Save,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  MessageSquare,
  Phone,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const MyProfile: React.FC = () => {
  const { currentStudent, updateProfile } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  // Form states initialized with currentStudent
  const [name, setName] = useState(currentStudent?.name || '');
  const [department, setDepartment] = useState(currentStudent?.department || DEPARTMENTS[1]);
  const [year, setYear] = useState<AcademicYear>(currentStudent?.year || '3rd Year');
  const [college, setCollege] = useState(currentStudent?.college || 'Kamaladevi College');
  const [bio, setBio] = useState(currentStudent?.bio || '');
  const [skills, setSkills] = useState<string[]>(currentStudent?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>(currentStudent?.interests || []);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [projects, setProjects] = useState<PastProject[]>(currentStudent?.projects || []);

  // Contact fields
  const [email, setEmail] = useState(currentStudent?.contact?.email || '');
  const [phone, setPhone] = useState(currentStudent?.contact?.phone || '');
  const [github, setGithub] = useState(currentStudent?.contact?.github || '');
  const [linkedin, setLinkedin] = useState(currentStudent?.contact?.linkedin || '');
  const [discord, setDiscord] = useState(currentStudent?.contact?.discord || '');

  // Add project modal/form toggle
  const [showAddProject, setShowAddProject] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projRole, setProjRole] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projLink, setProjLink] = useState('');

  if (!currentStudent) return null;

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddInterest = (interestToAdd: string) => {
    const trimmed = interestToAdd.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const newProj: PastProject = {
      id: `proj-${Date.now()}`,
      title: projTitle.trim(),
      role: projRole.trim() || 'Contributor',
      description: projDesc.trim() || 'Academic project implementation.',
      techStack: projTech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      link: projLink.trim() || undefined
    };

    setProjects([...projects, newProj]);
    setProjTitle('');
    setProjRole('');
    setProjDesc('');
    setProjTech('');
    setProjLink('');
    setShowAddProject(false);
  };

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: name.trim(),
      department,
      year,
      college: college.trim(),
      bio: bio.trim(),
      skills,
      interests,
      projects,
      contact: {
        email: email.trim(),
        phone: phone.trim() || undefined,
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        discord: discord.trim() || undefined
      }
    });
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    // Reset to current state
    setName(currentStudent.name);
    setDepartment(currentStudent.department);
    setYear(currentStudent.year);
    setCollege(currentStudent.college);
    setBio(currentStudent.bio);
    setSkills(currentStudent.skills);
    setInterests(currentStudent.interests);
    setProjects(currentStudent.projects || []);
    setEmail(currentStudent.contact.email);
    setPhone(currentStudent.contact.phone || '');
    setGithub(currentStudent.contact.github || '');
    setLinkedin(currentStudent.contact.linkedin || '');
    setDiscord(currentStudent.contact.discord || '');
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar with View/Edit toggle */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">My Student Profile</h1>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Active Profile
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Keep your skills, projects, and contact details up to date for Kamaladevi College peers.
          </p>
        </div>

        <div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelEditing}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Form / View */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
        {/* Section 1: Basic Information */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100">
            Student Information
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Alphabet Avatar Card */}
            <div className="w-full md:w-52 shrink-0 flex flex-col items-center p-5 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <StudentAvatar name={name || currentStudent.name} size="xl" className="w-20 h-20 text-2xl mb-3 shadow-sm" />
              <span className="text-xs font-bold text-slate-800">{name || currentStudent.name}</span>
              <span className="text-[11px] text-slate-500 mt-0.5">{department}</span>
              <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded mt-2">
                Kamaladevi College
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-sm font-medium text-slate-900 border border-slate-100">
                    {name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / Institution
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-sm font-medium text-slate-900 border border-slate-100">
                    {college}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department *
                </label>
                {isEditing ? (
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                  >
                    {DEPARTMENTS.filter((d) => d !== 'All Departments').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-sm font-medium text-slate-900 border border-slate-100">
                    {department}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year *
                </label>
                {isEditing ? (
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value as AcademicYear)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                  >
                    {YEARS.filter((y) => y !== 'All Years').map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-sm font-medium text-slate-900 border border-slate-100">
                    {year}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Bio / Academic Summary *
                </label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly state your academic focus, preferred project topics, and what strengths you bring to a project partner..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700 resize-none"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-100 leading-relaxed whitespace-pre-line">
                    {bio || 'No bio provided yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Skills Tag Manager */}
        <div>
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Skills ({skills.length})
              </h2>
              <p className="text-xs text-slate-500">
                Display skills as clean tags/chips for other students to search
              </p>
            </div>
          </div>

          {/* Current Skills Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3 min-h-[38px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-md shadow-2xs"
              >
                <span>{skill}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {skills.length === 0 && (
              <span className="text-xs text-slate-400 self-center">No skills added yet.</span>
            )}
          </div>

          {/* Add skill input & suggestions when editing */}
          {isEditing && (
            <div className="space-y-3 pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(newSkillInput);
                    }
                  }}
                  placeholder="Type a skill (e.g. Flutter, Docker, PyTorch) and press Enter..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(newSkillInput)}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Add Skill
                </button>
              </div>

              {/* Suggestions */}
              <div>
                <span className="text-[11px] text-slate-400 mr-2">Suggestions:</span>
                <div className="inline-flex flex-wrap gap-1 mt-1">
                  {POPULAR_SKILLS.filter((s) => !skills.includes(s))
                    .slice(0, 8)
                    .map((sk) => (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleAddSkill(sk)}
                        className="px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded hover:border-blue-400 hover:text-blue-700 transition-colors"
                      >
                        + {sk}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Areas of Interest */}
        <div>
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Areas of Interest ({interests.length})
              </h2>
              <p className="text-xs text-slate-500">
                Subjects and project domains you are enthusiastic about
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3 min-h-[38px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
            {interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded-md"
              >
                <span>{interest}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-blue-500 hover:text-rose-600 p-0.5 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {interests.length === 0 && (
              <span className="text-xs text-slate-400 self-center">No interests added yet.</span>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest(newInterestInput);
                  }
                }}
                placeholder="Type an interest (e.g. Internet of Things, Computer Vision) and press Enter..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
              />
              <button
                type="button"
                onClick={() => handleAddInterest(newInterestInput)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Add Interest
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Projects Worked On */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Projects Worked On ({projects.length})
              </h2>
              <p className="text-xs text-slate-500">
                Showcase past semester course projects, hackathons, or personal coding tools
              </p>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowAddProject(!showAddProject)}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddProject ? 'Close Form' : 'Add Project'}</span>
              </button>
            )}
          </div>

          {/* New Project Form */}
          {showAddProject && isEditing && (
            <form
              onSubmit={handleAddProject}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4 space-y-3"
            >
              <h3 className="text-xs font-bold text-slate-800">Add New Project Entry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g. Student Attendance QR Scanner"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Your Role in Team
                  </label>
                  <input
                    type="text"
                    value={projRole}
                    onChange={(e) => setProjRole(e.target.value)}
                    placeholder="e.g. Full-Stack Lead, Backend Developer"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Explain what the project did and key challenges tackled..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    placeholder="React, Node.js, SQLite"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Project Link / Repository (Optional)
                  </label>
                  <input
                    type="url"
                    value={projLink}
                    onChange={(e) => setProjLink(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-2xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          )}

          {/* List of Projects */}
          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">Role: {proj.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </a>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{proj.description}</p>

                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {projects.length === 0 && (
              <div className="py-6 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">No past projects listed yet.</p>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowAddProject(true)}
                    className="mt-2 text-xs font-semibold text-blue-700 hover:underline"
                  >
                    + Add your first project
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Contact Information */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>College Email *</span>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg text-sm font-medium text-slate-800 border border-slate-100">
                  {email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone / WhatsApp</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg text-sm text-slate-800 border border-slate-100">
                  {phone || 'Not specified'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-400" />
                <span>GitHub Profile URL</span>
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg text-sm text-slate-800 border border-slate-100 truncate">
                  {github ? (
                    <a
                      href={github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      {github}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                <span>LinkedIn Profile URL</span>
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg text-sm text-slate-800 border border-slate-100 truncate">
                  {linkedin ? (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      {linkedin}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Discord Handle / Student Group ID</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  placeholder="username#1234 or campus discord username"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-700"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg text-sm text-slate-800 border border-slate-100">
                  {discord || 'Not specified'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        {isEditing && (
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelEditing}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
