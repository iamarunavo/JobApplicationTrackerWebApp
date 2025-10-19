import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobContext } from '../context/JobContext';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import { InputField } from '../components/InputField';
import { formatDate, validateJobInput } from '../utils/helpers';
import { JobStatus } from '../types/job.types';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getJob, updateJob, deleteJob } = useJobContext();
  const navigate = useNavigate();

  const job = getJob(id!);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    id: job?.id || '',
    companyName: job?.companyName || '',
    jobTitle: job?.jobTitle || '',
    status: job?.status || 'Applied' as JobStatus,
    appliedDate: job?.appliedDate || '',
    notes: job?.notes || '',
    location: job?.location || '',
    salary: job?.salary || '',
    contactEmail: job?.contactEmail || '',
    contactName: job?.contactName || '',
    url: job?.url || '',
    lastUpdated: job?.lastUpdated || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if job not found
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 px-4 sm:px-6 max-w-3xl mx-auto w-full">
          <div className="glass-card p-8 text-center">
            <h1 className="text-h2 font-display mb-4">Job Not Found</h1>
            <p className="text-neutral-700 mb-6">
              The job application you're looking for doesn't exist or may have been deleted.
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleEditToggle = () => {
    // If exiting edit mode, reset form data
    if (isEditMode) {
      setFormData({
        id: job.id,
        companyName: job.companyName,
        jobTitle: job.jobTitle,
        status: job.status,
        appliedDate: job.appliedDate,
        notes: job.notes || '',
        location: job.location || '',
        salary: job.salary || '',
        contactEmail: job.contactEmail || '',
        contactName: job.contactName || '',
        url: job.url || '',
        lastUpdated: job.lastUpdated,
      });
      setErrors({});
    }
    setIsEditMode(!isEditMode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    // Validate form
    const validation = validateJobInput(
      formData.companyName,
      formData.jobTitle,
      formData.appliedDate
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      updateJob(formData);
      setIsEditMode(false);
      setNotification({
        type: 'success',
        message: 'Job application updated successfully!',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update job application.',
      });
    }
  };

  const handleDelete = () => {
    try {
      deleteJob(job.id);
      setIsDeleteModalOpen(false);
      setNotification({
        type: 'success',
        message: 'Job application deleted successfully!',
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to delete job application.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-6 px-4 sm:px-6 max-w-3xl mx-auto w-full">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Alert
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation and action buttons */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => navigate('/')} 
            className="text-neutral-700 hover:text-primary-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
          
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              onClick={handleEditToggle}
              className={isEditMode ? 'border-danger text-danger hover:text-danger hover:border-danger' : ''}
            >
              {isEditMode ? 'Cancel' : 'Edit'}
            </Button>
            {isEditMode ? (
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                className="border-danger text-danger hover:text-danger hover:border-danger"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Job Details Card */}
        <div className="glass-card p-6 md:p-8">
          {/* Header Section */}
          <div className="border-b border-neutral-200 pb-6 mb-6">
            {isEditMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField
                  id="companyName"
                  label="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  error={errors.companyName}
                />
                
                <InputField
                  id="jobTitle"
                  label="Job Title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                  error={errors.jobTitle}
                />
                
                <div className="mb-4">
                  <label 
                    htmlFor="status" 
                    className="block mb-1.5 font-ui-label text-neutral-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                
                <InputField
                  id="appliedDate"
                  label="Applied Date"
                  type="date"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  required
                  error={errors.appliedDate}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h1 className="text-h1 font-display mb-2 md:mb-0">{job.jobTitle}</h1>
                  <StatusBadge status={job.status} />
                </div>
                <h2 className="text-xl font-medium mb-4">{job.companyName}</h2>
                <div className="flex items-center text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="font-mono text-small">Applied: {formatDate(job.appliedDate)}</span>
                </div>
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Left Column */}
            <div>
              {isEditMode ? (
                <>
                  <InputField
                    id="location"
                    label="Location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State or Remote"
                  />
                  
                  <InputField
                    id="salary"
                    label="Salary Range"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. $60,000 - $80,000"
                  />
                  
                  <InputField
                    id="url"
                    label="Job Posting URL"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-ui-label text-neutral-700 mb-1">Location</h3>
                    <p>{job.location || "Not specified"}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-ui-label text-neutral-700 mb-1">Salary Range</h3>
                    <p>{job.salary || "Not specified"}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-ui-label text-neutral-700 mb-1">Job Posting URL</h3>
                    {job.url ? (
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline break-all"
                      >
                        {job.url}
                      </a>
                    ) : (
                      <p>Not specified</p>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Right Column */}
            <div>
              {isEditMode ? (
                <>
                  <InputField
                    id="contactName"
                    label="Contact Name"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Recruiter or hiring manager"
                  />
                  
                  <InputField
                    id="contactEmail"
                    label="Contact Email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                  />
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-ui-label text-neutral-700 mb-1">Contact Name</h3>
                    <p>{job.contactName || "Not specified"}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-ui-label text-neutral-700 mb-1">Contact Email</h3>
                    {job.contactEmail ? (
                      <a 
                        href={`mailto:${job.contactEmail}`} 
                        className="text-primary-600 hover:underline"
                      >
                        {job.contactEmail}
                      </a>
                    ) : (
                      <p>Not specified</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-ui-label text-neutral-700 mb-1">Last Updated</h3>
                    <p className="font-mono text-small">{formatDate(job.lastUpdated)}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-2">
            <h3 className="font-ui-label text-neutral-700 mb-1">Notes</h3>
            {isEditMode ? (
              <InputField
                id="notes"
                label=""
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional information about this application..."
                isTextarea
                rows={5}
              />
            ) : (
              <div className="bg-white/50 rounded-md p-4 border border-neutral-200">
                <p className="whitespace-pre-wrap">{job.notes || "No notes added yet."}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p className="mb-6">Are you sure you want to delete this job application? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="secondary"
            className="border-danger text-danger hover:text-danger hover:border-danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};