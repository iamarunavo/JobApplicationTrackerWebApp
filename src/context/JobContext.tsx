import React, { createContext, useState, useContext, useEffect } from 'react';
import { JobApplication, JobContextType, JobStatus } from '../types/job.types';

// Create context with default value
const JobContext = createContext<JobContextType | undefined>(undefined);

// Custom hook for using the job context
export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};

// Provider component
export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const savedJobs = localStorage.getItem('jobApplications');
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (error) {
        console.error('Failed to parse saved jobs', error);
        // Initialize with empty array if parsing fails
        setJobs([]);
      }
    }
  }, []);

  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem('jobApplications', JSON.stringify(jobs));
  }, [jobs]);

  // Add a new job
  const addJob = (jobData: Omit<JobApplication, 'id' | 'lastUpdated'>) => {
    const newJob: JobApplication = {
      ...jobData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    
    setJobs(prevJobs => [...prevJobs, newJob]);
  };

  // Update an existing job
  const updateJob = (updatedJob: JobApplication) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === updatedJob.id 
          ? { ...updatedJob, lastUpdated: new Date().toISOString() }
          : job
      )
    );
  };

  // Delete a job
  const deleteJob = (id: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
  };

  // Get a job by ID
  const getJob = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  // Export jobs to a JSON file
  const exportJobs = () => {
    // Add metadata to the exported file
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        appName: 'ARCANE JOBS',
        jobCount: jobs.length
      },
      jobs: jobs
    };
    
    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcane-jobs-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    return {
      success: true,
      message: `Successfully exported ${jobs.length} jobs`
    };
  };

  // Import jobs from a JSON file with validation and merge options
  const importJobs = (importedData: any, mergeWithExisting: boolean = false): {success: boolean, message: string} => {
    try {
      // Handle both old format (array of jobs) and new format (object with metadata and jobs)
      let importedJobs: any[];
      
      if (Array.isArray(importedData)) {
        // Old format - direct array of jobs
        importedJobs = importedData;
      } else if (typeof importedData === 'object' && importedData !== null && 'jobs' in importedData && Array.isArray(importedData.jobs)) {
        // New format with metadata
        importedJobs = importedData.jobs;
      } else {
        throw new Error('Invalid import format');
      }
      
      // Validate imported data structure
      const isValidStructure = importedJobs.every(job => 
        typeof job === 'object' && 
        job !== null &&
        'companyName' in job && 
        'jobTitle' in job && 
        'status' in job && 
        'appliedDate' in job
      );

      if (!isValidStructure) {
        throw new Error('Invalid job data structure');
      }

      // Validate status values
      const validStatuses: JobStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
      const hasValidStatuses = importedJobs.every(job => 
        validStatuses.includes(job.status as JobStatus)
      );

      if (!hasValidStatuses) {
        throw new Error('Invalid job status values');
      }

      // Process the imported jobs
      const processedJobs = importedJobs.map(job => ({
        ...job,
        id: job.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        lastUpdated: job.lastUpdated || new Date().toISOString()
      }));

      // Update the jobs state
      if (mergeWithExisting) {
        // Merge with existing jobs, avoiding duplicates by ID
        const existingIds = new Set(jobs.map(job => job.id));
        const newJobs = processedJobs.filter(job => !existingIds.has(job.id));
        setJobs([...jobs, ...newJobs]);
        return { 
          success: true, 
          message: `Successfully imported ${newJobs.length} new jobs (${processedJobs.length - newJobs.length} duplicates skipped)`
        };
      } else {
        // Replace all existing jobs
        setJobs(processedJobs);
        return {
          success: true,
          message: `Successfully imported ${processedJobs.length} jobs`
        };
      }
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown import error'
      };
    }
  };

  const value: JobContextType = {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    getJob,
    exportJobs,
    importJobs
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};