import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  src?: string;
  name?: string;
  sizeClass?: string;
  textSizeClass?: string;
  className?: string;
}

const isDemoPlaceholderAvatar = (url?: string): boolean => {
  if (!url) return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  return (
    trimmed.includes('/src/assets/images/avatar_') ||
    trimmed.includes('avatar_student_lead_') ||
    trimmed.includes('avatar_maintenance_staff_')
  );
};

const getInitials = (name?: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  sizeClass = 'w-10 h-10',
  textSizeClass = 'text-xs',
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const showImage = !isDemoPlaceholderAvatar(src) && !imgFailed;
  const initials = getInitials(name);

  if (showImage) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={`${sizeClass} rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={name || 'User'}
      className={`${sizeClass} rounded-full bg-red-700 dark:bg-red-800 text-white font-bold flex items-center justify-center border border-red-800/30 dark:border-red-700/60 select-none shrink-0 ${textSizeClass} ${className}`}
    >
      {initials ? initials : <User className="w-1/2 h-1/2" />}
    </div>
  );
};
