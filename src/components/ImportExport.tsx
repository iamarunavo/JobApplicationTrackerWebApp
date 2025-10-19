import React from 'react';
import { useJobContext } from '../context/JobContext';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';

interface ImportExportProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({ onSuccess, onError }) => {
  const { exportJobs, importJobs } = useJobContext();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsedData = JSON.parse(result);
        
        // Extract jobs array from different possible formats
        let jobsData;
        if (Array.isArray(parsedData)) {
          // Direct array of jobs format
          jobsData = parsedData;
        } else if (typeof parsedData === 'object' && parsedData !== null) {
          if ('jobs' in parsedData && Array.isArray(parsedData.jobs)) {
            // New format with metadata
            jobsData = parsedData.jobs;
          } else if ('applications' in parsedData && Array.isArray(parsedData.applications)) {
            // Format with applications array
            jobsData = parsedData.applications.map((job: any) => ({
              id: job.id || String(Date.now() + Math.random()),
              companyName: job.company || job.companyName,
              jobTitle: job.title || job.jobTitle || job.position,
              status: job.status,
              appliedDate: job.appliedDate || job.dateApplied,
              notes: job.notes,
              lastUpdated: job.lastUpdated || new Date().toISOString()
            }));
          } else {
            throw new Error('Invalid data format. Could not find jobs array.');
          }
        } else {
          throw new Error('Invalid data format. Expected an array of jobs or an object with jobs.');
        }
        
        // Confirm with the user before replacing all data
        const shouldReplace = window.confirm(
          "Do you want to replace all existing job data? Click 'OK' to replace all jobs, or 'Cancel' to merge with existing jobs."
        );
        
        // Import the data with the user's merge preference
        const importResult = importJobs(parsedData, !shouldReplace);
        
        if (importResult.success) {
          onSuccess(importResult.message);
        } else {
          onError(`Import failed: ${importResult.message}`);
        }
      } catch (error) {
        onError(`Failed to import: ${error instanceof Error ? error.message : 'Invalid file format'}`);
      }
    };
    
    reader.onerror = () => {
      onError('Failed to read file');
    };
    
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const handleExport = () => {
    const result = exportJobs();
    if (result && result.success) {
      onSuccess(result.message);
    } else {
      onSuccess('Jobs exported successfully!');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button variant="secondary" onClick={handleImport}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        Import
      </Button>
      <Button variant="secondary" onClick={handleExport}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Export
      </Button>
    </div>
  );
};