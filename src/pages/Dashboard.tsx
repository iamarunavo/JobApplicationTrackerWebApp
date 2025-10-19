import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useJobContext } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { Header } from '../components/Header';
import { ImportExport } from '../components/ImportExport';
import { Alert } from '../components/Alert';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { jobs } = useJobContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

  // Handler for notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort jobs by date (newest first)
  const sortedJobs = [...filteredJobs].sort((a, b) => 
    new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  );

  // Stats for status counts
  const statusCounts = {
    Applied: jobs.filter(job => job.status === 'Applied').length,
    Interviewing: jobs.filter(job => job.status === 'Interviewing').length,
    Offer: jobs.filter(job => job.status === 'Offer').length,
    Rejected: jobs.filter(job => job.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Notification */}
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <Alert
              type={notification.type}
              message={notification.message}
              onClose={clearNotification}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-7 mb-8 relative"
        >
          {/* Animated gradient line at top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/40 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-h2 font-display text-purple-400">ARCANE JOBS</h1>
            <ImportExport 
              onSuccess={(msg) => showNotification('success', msg)} 
              onError={(msg) => showNotification('error', msg)} 
            />
          </div>
          
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
            {Object.entries(statusCounts).map(([status, count]) => {
              let colorClasses, glowColor, borderColor, textColor;
              switch(status) {
                case 'Applied': 
                  colorClasses = 'bg-gradient-to-br from-purple-900/20 to-purple-800/10'; 
                  glowColor = 'shadow-purple-400/20';
                  borderColor = 'border-purple-400/30';
                  textColor = 'text-purple-300';
                  break;
                case 'Interviewing': 
                  colorClasses = 'bg-gradient-to-br from-violet-900/20 to-violet-800/10';
                  glowColor = 'shadow-violet-500/20';
                  borderColor = 'border-violet-600/30';
                  textColor = 'text-violet-300';
                  break;
                case 'Offer': 
                  colorClasses = 'bg-gradient-to-br from-green-900/20 to-green-800/10';
                  glowColor = 'shadow-green-400/20';
                  borderColor = 'border-green-500/30';
                  textColor = 'text-green-300';
                  break;
                case 'Rejected': 
                  colorClasses = 'bg-gradient-to-br from-red-900/20 to-red-800/10';
                  glowColor = 'shadow-red-500/20';
                  borderColor = 'border-red-500/30';
                  textColor = 'text-red-300';
                  break;
                default: 
                  colorClasses = 'bg-gradient-to-br from-neutral-900/20 to-neutral-800/10';
                  glowColor = 'shadow-neutral-400/20';
                  borderColor = 'border-neutral-700';
                  textColor = 'text-neutral-300';
              }
              
              return (
                <motion.div 
                  key={status}
                  whileHover={{ scale: 1.03, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`${colorClasses} rounded-xl border ${borderColor} shadow-lg ${glowColor} backdrop-blur-md p-5 flex flex-col items-center justify-center relative overflow-hidden`}
                >
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-b from-white/5 to-transparent"></div>
                  {/* Top border glow */}
                  <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  
                  <p className={`text-3xl font-bold font-mono ${textColor}`}>{count}</p>
                  <h3 className="text-ui-label mt-1 text-neutral-400">{status}</h3>
                </motion.div>
              );
            })}
          </div>
          
          {/* Search and Filter - Arcane Neo Style */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center relative flex-1">
              {/* Search icon removed */}
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full"
                aria-label="Search jobs"
              />
              <div className="absolute right-3 top-[13px] text-xs opacity-60 font-mono">⌘ + K</div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input sm:w-40 appearance-none pr-8 relative"
              style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, 
                       backgroundRepeat: 'no-repeat', 
                       backgroundPosition: 'right 8px center'}}
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Job Listings */}
        {sortedJobs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {sortedJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-16 text-center relative overflow-hidden"
          >
            {/* Glowing background effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-transparent opacity-50"></div>
            <div className="absolute -top-[150px] -left-[150px] w-[300px] h-[300px] bg-purple-400/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-[100px] -right-[100px] w-[250px] h-[250px] bg-purple-600/5 rounded-full blur-3xl"></div>
            
            {/* Animated top line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/40 to-transparent"></div>
            
            <div className="relative">
              <h3 className="text-2xl font-display mb-3 text-neutral-100">No jobs found</h3>
              <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                {jobs.length === 0 
                  ? "You haven't added any job applications yet. Start your career journey now."
                  : "No jobs match your search criteria. Try adjusting your filters."
                }
              </p>
              
              {jobs.length === 0 && (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block"
                >
                  <Link to="/add" className="btn-primary inline-flex items-center py-4 px-10 text-lg relative overflow-hidden group">
                    {/* Pulse effect removed */}
                    
                    {/* Glowing border effect */}
                    <span className="absolute inset-0 w-full h-full border-2 border-purple-400/0 group-hover:border-purple-400/30 transition-colors duration-500"></span>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Your First Job
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};