export interface UserAccount {
  id: string;
  name: string;
  email: string;
  experienceYears: number;
  currentLocation: string;
  keySkills: string[];
  createdAt: string;
}

/** Minimal user info carried inside the signed session cookie. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
}
