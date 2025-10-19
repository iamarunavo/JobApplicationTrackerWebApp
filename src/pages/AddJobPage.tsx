import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJobContext } from '../context/JobContext';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Alert } from '../components/Alert';
import { JobStatus } from '../types/job.types';
import { validateJobInput } from '../utils/helpers';

export const AddJobPage: React.FC = () => {
  const { addJob } = useJobContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    status: 'Applied' as JobStatus,
    appliedDate: new Date().toISOString().slice(0, 10),
    notes: '',
    location: '',
    salary: '',
    contactEmail: '',
    contactName: '',
    url: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
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
      // Add the job to context
      addJob(formData);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Job application added successfully!',
      });
      
      // Reset form
      setFormData({
        companyName: '',
        jobTitle: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().slice(0, 10),
        notes: '',
        location: '',
        salary: '',
        contactEmail: '',
        contactName: '',
        url: '',
      });
      
      // Clear any errors
      setErrors({});
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to add job application. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-6 px-4 sm:px-6 max-w-3xl mx-auto w-full">
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert 
              type={notification.type} 
              message={notification.message} 
              onClose={() => setNotification(null)}
            />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 md:p-8"
        >
          <h1 className="text-h2 font-display mb-6">Add New Job Application</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InputField
                id="companyName"
                label="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                required
                error={errors.companyName}
              />
              
              <InputField
                id="jobTitle"
                label="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Enter job title"
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
            </div>
            
            <InputField
              id="notes"
              label="Notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional information about this application..."
              isTextarea
              rows={5}
              className="mt-2"
            />
            
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <Button 
                variant="secondary" 
                type="button" 
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
              >
                Add Job
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};