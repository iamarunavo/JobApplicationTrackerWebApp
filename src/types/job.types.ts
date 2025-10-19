export type JobStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  status: JobStatus;
  appliedDate: string;
  notes?: string;
  location?: string;
  salary?: string;
  contactEmail?: string;
  contactName?: string;
  url?: string;
  lastUpdated: string;
}

export interface JobContextType {
  jobs: JobApplication[];
  addJob: (job: Omit<JobApplication, 'id' | 'lastUpdated'>) => void;
  updateJob: (job: JobApplication) => void;
  deleteJob: (id: string) => void;
  getJob: (id: string) => JobApplication | undefined;
  exportJobs: () => {success: boolean, message: string};
  importJobs: (jobs: any, mergeWithExisting?: boolean) => {success: boolean, message: string};
}