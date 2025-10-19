import React from 'react';
import { JobStatus } from '../types/job.types';
import { getStatusColor } from '../utils/helpers';

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const colorClasses = getStatusColor(status);
  
  return (
    <span className={`status-badge ${colorClasses} ${className}`}>
      {status}
    </span>
  );
};