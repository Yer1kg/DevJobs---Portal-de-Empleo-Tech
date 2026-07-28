// src/types/job.ts
export type JobLocation = 'Remoto' | 'Híbrido' | 'Presencial';

export type JobData = {
  title: string;
  company: string;
  location: JobLocation;
  tags: string[];
  description: string;
  salaryRange?: [number, number]; 
  company_logo?: string;
};

export type JobSystemInfo = {
  id: number;
};

export type Job = JobData & JobSystemInfo;