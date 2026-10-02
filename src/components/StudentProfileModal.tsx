import React from 'react';
import { useApp } from '../context/AppContext';
import { StudentAvatar } from './StudentAvatar';
import {
  X,
  Mail,
  Github,
  Linkedin,
  MessageSquare,
  Phone,
  Briefcase,
  BookOpen,
  Calendar,
  Send,
  UserCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const StudentProfileModal: React.FC = () => {
  const {
    selectedStudentForModal,
    setSelectedStudentForModal,
    currentStudent,
    hasPendingRequestWith,
    setRequestModalRecipient
  } = useApp();

  if (!selectedStudentForModal) return null;

  const student = selectedStudentForModal;
  const isMe = currentStudent?.id === student.id;
  const relation = hasPendingRequestWith(student.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-start gap-4">
            <StudentAvatar name={student.name} size="xl" className="w-16 h-16 text-xl shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {student.name}
                </h2>
                {isMe && (
                  <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    You
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-600 mt-0.5">
                {student.department} · {student.year}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Kamaladevi College</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {student.joinedDate}</span>
                {student.lookingForPartner && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-medium">Looking for Partner</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedStudentForModal(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* About / Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              {student.bio || 'No bio provided yet.'}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Skills & Expertise
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Areas of Interest
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {student.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-50/80 border border-blue-100 rounded-md"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Previous Projects */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Projects Worked On ({student.projects?.length || 0})
            </h4>
            {student.projects && student.projects.length > 0 ? (
              <div className="space-y-3">
                {student.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-semibold text-slate-900">{proj.title}</h5>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Role: {proj.role}</p>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {proj.description}
                    </p>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
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
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No previous projects listed yet.</p>
            )}
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Contact Channels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href={`mailto:${student.contact.email}`}
                className="flex items-center gap-2 p-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors truncate"
              >
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{student.contact.email}</span>
              </a>

              {student.contact.github && (
                <a
                  href={student.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors truncate"
                >
                  <Github className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{student.contact.github.replace('https://', '')}</span>
                </a>
              )}

              {student.contact.linkedin && (
                <a
                  href={student.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors truncate"
                >
                  <Linkedin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{student.contact.linkedin.replace('https://', '')}</span>
                </a>
              )}

              {student.contact.discord && (
                <div className="flex items-center gap-2 p-2 rounded-md border border-slate-200 text-slate-700 truncate">
                  <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{student.contact.discord}</span>
                </div>
              )}

              {student.contact.phone && (
                <div className="flex items-center gap-2 p-2 rounded-md border border-slate-200 text-slate-700 truncate">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{student.contact.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => setSelectedStudentForModal(null)}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>

          {!isMe && (
            <div>
              {relation === 'partner' ? (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-lg">
                  <UserCheck className="w-4 h-4" />
                  <span>Already Project Partners</span>
                </div>
              ) : relation === 'sent' ? (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Partnership Request Pending</span>
                </div>
              ) : relation === 'received' ? (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                  <span>They Sent You a Request (Check Requests tab)</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedStudentForModal(null);
                    setRequestModalRecipient(student);
                  }}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Project Request</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
