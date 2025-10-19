import React from 'react';
import { motion } from 'framer-motion';
import { JobApplication } from '../types/job.types';
import { formatDate, getStatusBorderColor } from '../utils/helpers';
import { StatusBadge } from './StatusBadge';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: JobApplication;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const borderColorClass = getStatusBorderColor(job.status);
  
  // Map status to glow color for the card
  const getStatusGlow = (status: string) => {
    switch(status) {
      case 'Applied': return 'shadow-purple-400/5';
      case 'Interviewing': return 'shadow-violet-600/5';
      case 'Offer': return 'shadow-green-500/5';
      case 'Rejected': return 'shadow-red-500/5';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card border-l-4 ${borderColorClass} mb-5 group ${getStatusGlow(job.status)}`}
      whileHover={{ y: -3, x: 0 }}
    >
      <Link to={`/job/${job.id}`} className="block p-6 relative overflow-hidden">
        {/* Static gradient instead of animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* Top subtle gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 relative z-10">
          <div>
            <h3 className="text-lg font-semibold font-display mb-1 text-neutral-100 group-hover:text-purple-400 transition-colors duration-300">
              {job.jobTitle}
            </h3>
            <p className="text-neutral-400 mb-2">{job.companyName}</p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <StatusBadge status={job.status} />
            <span className="text-xs font-mono text-neutral-500 group-hover:text-neutral-400 transition-colors duration-300">
              Applied: {formatDate(job.appliedDate)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};