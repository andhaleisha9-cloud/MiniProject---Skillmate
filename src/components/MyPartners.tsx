import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectPartnerStatus } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  UserCheck,
  Mail,
  Github,
  Linkedin,
  MessageSquare,
  Phone,
  Edit2,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const MyPartners: React.FC = () => {
  const {
    getMyPartners,
    updatePartnerProject,
    setSelectedStudentForModal,
    setActiveTab
  } = useApp();

  const partners = getMyPartners();

  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const handleStartEditNotes = (partnerId: string, currentNotes: string = '') => {
    setEditingNotesId(partnerId);
    setTempNotes(currentNotes);
  };

  const handleSaveNotes = (partnerId: string, currentStatus: ProjectPartnerStatus) => {
    updatePartnerProject(partnerId, currentStatus, tempNotes);
    setEditingNotesId(null);
  };

  const handleStatusChange = (
    partnerId: string,
    newStatus: ProjectPartnerStatus,
    currentNotes?: string
  ) => {
    updatePartnerProject(partnerId, newStatus, currentNotes);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Project Partners & Teams
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Confirmed student teammates formed via accepted project partnership requests
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Active Collaborations:{' '}
          <span className="font-bold text-slate-900 tabular-nums">{partners.length}</span>
        </div>
      </div>

      {/* Partners List */}
      {partners.length > 0 ? (
        <div className="space-y-6">
          {partners.map((partner) => {
            const student = partner.partnerStudent;
            const isEditingNote = editingNotesId === partner.id;

            return (
              <div
                key={partner.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 hover:border-slate-300 transition-colors"
              >
                {/* Header: Partner Profile Details & Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <StudentAvatar name={student.name} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                        <button
                          onClick={() => setSelectedStudentForModal(student)}
                          className="text-xs text-blue-700 hover:underline font-medium"
                        >
                          View Full Profile
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {student.department} · {student.year} · Kamaladevi College
                      </p>

                      {/* Partner Skills */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {student.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project Status Selector */}
                  <div className="sm:text-right shrink-0">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Project Status
                    </label>
                    <select
                      value={partner.status}
                      onChange={(e) =>
                        handleStatusChange(
                          partner.id,
                          e.target.value as ProjectPartnerStatus,
                          partner.notes
                        )
                      }
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        partner.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : partner.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <div className="flex items-center sm:justify-end gap-1 text-[11px] text-slate-400 mt-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>Formed {partner.formedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Project Brief Container */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div className="font-semibold text-slate-900">
                      Project Title: <span className="text-blue-800 font-bold">{partner.projectTitle}</span>
                    </div>
                    {partner.roleDescription && (
                      <div className="text-slate-600">
                        Collaborative Role: <span className="font-medium text-slate-800">{partner.roleDescription}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes / Progress Log */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Team Notes & Milestones
                      </span>
                      {!isEditingNote && (
                        <button
                          onClick={() => handleStartEditNotes(partner.id, partner.notes)}
                          className="text-[11px] text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Notes</span>
                        </button>
                      )}
                    </div>

                    {isEditingNote ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Record repository links, meeting days, or upcoming milestone deadlines..."
                          className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(partner.id, partner.status)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Save Notes</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        {partner.notes || 'No project notes recorded yet. Click "Edit Notes" to write project details.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct Contact Channels */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <span className="text-slate-400 font-medium">Direct Contact:</span>

                  <a
                    href={`mailto:${student.contact.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-700 hover:border-slate-300 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Send Email</span>
                  </a>

                  {student.contact.github && (
                    <a
                      href={student.contact.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-700 hover:border-slate-300 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5 text-slate-400" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {student.contact.linkedin && (
                    <a
                      href={student.contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-700 hover:border-slate-300 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {student.contact.discord && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>Discord: {student.contact.discord}</span>
                    </div>
                  )}

                  {student.contact.phone && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Phone: {student.contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <UserCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No project partners yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            When you accept a project proposal or another student accepts your request, your collaboration team will appear here.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setActiveTab('find-students')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
            >
              Discover Students
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Check Requests
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
