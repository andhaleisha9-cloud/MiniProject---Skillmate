import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  Users,
  Compass,
  Inbox,
  UserCheck,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  FolderPlus
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentStudent,
    allStudents,
    activeTab,
    setActiveTab,
    getReceivedRequests,
    getMyPartners,
    switchStudent,
    logout
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingReceivedCount = getReceivedRequests().filter((r) => r.status === 'pending').length;
  const partnerCount = getMyPartners().length;

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <Users className="w-4 h-4" /> },
    {
      tab: 'project-board',
      label: 'Project Board',
      icon: <FolderPlus className="w-4 h-4" />,
      badge: pendingReceivedCount > 0 ? pendingReceivedCount : undefined
    },
    { tab: 'find-students', label: 'SkillMates', icon: <Compass className="w-4 h-4" /> },
    {
      tab: 'partners',
      label: 'My Partners',
      icon: <UserCheck className="w-4 h-4" />,
      badge: partnerCount > 0 ? partnerCount : undefined
    },
    { tab: 'my-profile', label: 'My Profile', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-800 flex items-center justify-center text-white font-bold text-base shadow-sm tracking-wider">
                SM
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-800 transition-colors block leading-tight">
                  SkillMate
                </span>
                <span className="text-[11px] font-medium text-slate-500 block leading-none">
                  Kamaladevi College · Project Partners
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors relative whitespace-nowrap ${
                    isActive
                      ? 'text-blue-800 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${
                        item.tab === 'requests'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: User actions / Switcher */}
          <div className="flex items-center gap-3">
            {currentStudent ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  aria-expanded={isUserMenuOpen}
                >
                  <StudentAvatar name={currentStudent.name} size="sm" />
                  <div className="text-left hidden sm:block max-w-[130px] truncate">
                    <span className="text-xs font-semibold text-slate-900 block truncate leading-tight">
                      {currentStudent.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate leading-none">
                      {currentStudent.department}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-slate-200 shadow-xl py-2 z-30">
                      <div className="px-3.5 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {currentStudent.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{currentStudent.email}</p>
                        <p className="text-[11px] text-blue-800 font-medium mt-0.5">
                          {currentStudent.department} · {currentStudent.year}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Kamaladevi College</p>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setActiveTab('my-profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>View My Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : null}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-blue-800 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
