import { JobStatus } from '../types/job.types';

// Format date to a readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Get status color for badges and indicators
export const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case 'Applied':
      return 'status-applied';
    case 'Interviewing':
      return 'status-interviewing';
    case 'Offer':
      return 'status-offer';
    case 'Rejected':
      return 'status-rejected';
    default:
      return 'bg-neutral-900/50 text-neutral-400 border-neutral-700/50';
  }
};

// Get status border color for cards
export const getStatusBorderColor = (status: JobStatus): string => {
  switch (status) {
    case 'Applied':
      return 'border-l-purple-400/80'; /* Soft Lavender */
    case 'Interviewing':
      return 'border-l-violet-600/80'; /* Deep Violet */
    case 'Offer':
      return 'border-l-green-500/80'; /* Emerald Glow */
    case 'Rejected':
      return 'border-l-red-500/80'; /* Crimson Veil */
    default:
      return 'border-l-neutral-300';
  }
};

// Format relative time (e.g. "2 days ago")
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

// Validate form input for job application
export const validateJobInput = (
  companyName: string,
  jobTitle: string,
  appliedDate: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!companyName.trim()) {
    errors.companyName = 'Company name is required';
  }
  
  if (!jobTitle.trim()) {
    errors.jobTitle = 'Job title is required';
  }
  
  if (!appliedDate.trim()) {
    errors.appliedDate = 'Application date is required';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(appliedDate)) {
      errors.appliedDate = 'Invalid date format (YYYY-MM-DD)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Helper function for file import validation
export const validateImportedJobs = (data: any): boolean => {
  if (!Array.isArray(data)) {
    return false;
  }
  
  return data.every(job => 
    typeof job === 'object' &&
    typeof job.id === 'string' &&
    typeof job.companyName === 'string' &&
    typeof job.jobTitle === 'string' &&
    ['Applied', 'Interviewing', 'Offer', 'Rejected'].includes(job.status) &&
    typeof job.appliedDate === 'string'
  );
};