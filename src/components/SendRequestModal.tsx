import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentAvatar } from './StudentAvatar';
import { Send, X, AlertCircle } from 'lucide-react';

export const SendRequestModal: React.FC = () => {
  const { requestModalRecipient, setRequestModalRecipient, sendRequest } = useApp();
  const [projectTitle, setProjectTitle] = useState('');
  const [roleNeeded, setRoleNeeded] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!requestModalRecipient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      setError('Please provide a project title or idea.');
      return;
    }
    if (!roleNeeded.trim()) {
      setError('Please specify the role or skill you need collaboration on.');
      return;
    }
    if (!message.trim() || message.trim().length < 15) {
      setError('Please write a brief message (at least 15 characters) introducing your project.');
      return;
    }

    const success = sendRequest({
      recipientId: requestModalRecipient.id,
      projectTitle,
      roleNeeded,
      message
    });

    if (success) {
      setProjectTitle('');
      setRoleNeeded('');
      setMessage('');
      setError('');
      setRequestModalRecipient(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Send Project Partnership Request
            </h3>
            <p className="text-xs text-slate-500">
              Propose forming a project team with this student
            </p>
          </div>
          <button
            onClick={() => {
              setError('');
              setRequestModalRecipient(null);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient Snapshot */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <StudentAvatar name={requestModalRecipient.name} size="md" />
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {requestModalRecipient.name}
            </div>
            <div className="text-xs text-slate-500">
              {requestModalRecipient.department} · {requestModalRecipient.year} · Kamaladevi College
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Title / Concept *
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => {
                setProjectTitle(e.target.value);
                setError('');
              }}
              placeholder="e.g. Smart Campus Waste Tracker, Medical Diagnosis AI"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role or Skill Contribution Needed *
            </label>
            <input
              type="text"
              value={roleNeeded}
              onChange={(e) => {
                setRoleNeeded(e.target.value);
                setError('');
              }}
              placeholder="e.g. Backend API Lead (FastAPI), UI/UX Designer, ML Specialist"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message to Student *
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError('');
              }}
              placeholder="Introduce your project idea, mention what skills you bring, and explain why you'd like to collaborate..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setError('');
                setRequestModalRecipient(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
