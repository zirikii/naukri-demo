export interface EmploymentEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  grade: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ItSkillEntry {
  id: string;
  name: string;
  version: string;
  lastUsedYear: string;
  experienceMonths: number;
}

export interface PersonalDetails {
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  phone: string;
  address: string;
  languages: string[];
}

export interface CareerProfile {
  preferredLocations: string[];
  industries: string[];
  roles: string[];
  expectedSalary: number;
  noticePeriod: string;
  workMode: string;
  employmentType: string;
}

export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experienceYears: number;
  currentRole: string;
  currentCompany: string;
  avatarHue: number;
  headline: string;
  keySkills: string[];
  employment: EmploymentEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  itSkills: ItSkillEntry[];
  personal: PersonalDetails;
  career: CareerProfile;
}
