import React from 'react';

interface StudentAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const COLOR_PALETTE = [
  { bg: 'bg-blue-800', text: 'text-white' },
  { bg: 'bg-teal-700', text: 'text-white' },
  { bg: 'bg-slate-700', text: 'text-white' },
  { bg: 'bg-amber-700', text: 'text-white' },
  { bg: 'bg-cyan-800', text: 'text-white' },
  { bg: 'bg-emerald-800', text: 'text-white' },
  { bg: 'bg-blue-700', text: 'text-white' },
  { bg: 'bg-emerald-700', text: 'text-white' }
];

export const getInitials = (name: string): string => {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

export const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  name,
  size = 'md',
  className = ''
}) => {
  const initials = getInitials(name);
  const color = getAvatarColor(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs sm:text-sm',
    lg: 'w-13 h-13 text-base',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-xl font-bold'
  };

  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center font-bold select-none tracking-wider shadow-2xs ${color.bg} ${color.text} ${sizeClasses[size]} ${className}`}
      aria-label={`${name}'s avatar (${initials})`}
    >
      {initials}
    </div>
  );
};
