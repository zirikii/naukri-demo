export interface JobAlert {
  id: string;
  keyword: string;
  location: string;
  experience: string;
  frequency: "Daily" | "Weekly";
  createdAt: string;
}

export interface JobPreferences {
  desiredRoles: string[];
  preferredLocations: string[];
  industries: string[];
  expectedSalary: number;
  workMode: string;
  availabilityToJoin: string;
}

export interface NotificationSettings {
  recruiterMessages: boolean;
  jobRecommendations: boolean;
  applicationUpdates: boolean;
  promotions: boolean;
}

export interface PrivacySettings {
  /** Visibility of the profile to recruiters. */
  profileVisibility: "Visible to all recruiters" | "Limited" | "Not visible";
  showContactDetails: boolean;
  showSalaryDetails: boolean;
}

export interface AccountSettings {
  email: string;
}

export interface Settings {
  jobPreferences: JobPreferences;
  account: AccountSettings;
  alerts: JobAlert[];
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}
