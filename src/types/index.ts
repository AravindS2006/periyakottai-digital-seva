export type Language = 'ta' | 'en';
export type TextScale = 'normal' | 'large' | 'huge';

export type ServiceCategory =
  | 'revenue'
  | 'land'
  | 'civil_supplies'
  | 'social_security'
  | 'agriculture'
  | 'women_welfare'
  | 'identity'
  | 'health_education';

export interface LocalizedString {
  ta: string;
  en: string;
}

export interface LocalizedArray {
  ta: string[];
  en: string[];
}

export interface Service {
  id: string;
  name: LocalizedString;
  category: ServiceCategory;
  department: LocalizedString;
  description: LocalizedString;
  eligibility: LocalizedArray;
  documents: LocalizedArray;
  fee: LocalizedString;
  timeEstimate: LocalizedString;
  officialPortal: string;
  offlineProcedure: LocalizedString;
  verified: boolean;
  lastVerified: string;
  popular?: boolean;
  keywords: string[];
}

export interface SchemeRule {
  occupations?: string[];
  minAge?: number;
  maxAge?: number;
  landRequired?: boolean;
  maxLandAcres?: number;
  gender?: 'all' | 'female' | 'male';
  maxAnnualIncome?: number;
  requiresDisability?: boolean;
  studentOnly?: boolean;
}

export interface Scheme {
  id: string;
  name: LocalizedString;
  category: string;
  sponsor: 'Central' | 'Tamil Nadu State' | 'Joint';
  benefit: LocalizedString;
  description: LocalizedString;
  targetAudience: LocalizedString;
  rules: SchemeRule;
  documents: LocalizedArray;
  howToApply: LocalizedString;
  officialLink: string;
  centreAssistance: boolean;
  deadline?: string;
  featured?: boolean;
}

export type RequestStatus =
  | 'Submitted'
  | 'Under Review'
  | 'In Progress'
  | 'Ready for Citizen'
  | 'Completed'
  | 'Cancelled';

export interface TimelineNote {
  date: string;
  author: string;
  message: string;
}

export interface RequestTicket {
  id: string;
  citizenName: string;
  phoneNumber: string;
  village: string;
  serviceId: string;
  serviceName: string;
  description?: string;
  priority: 'Normal' | 'Urgent';
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes: TimelineNote[];
}

export type GrievanceCategory =
  | 'drinking_water'
  | 'street_light'
  | 'road_repair'
  | 'drainage'
  | 'sanitation'
  | 'ration_shop'
  | 'agriculture'
  | 'burial_ground'
  | 'health_sanitation'
  | 'stray_animals'
  | 'revenue_land'
  | 'community_infra'
  | 'other';

export type GrievanceStatus =
  | 'Received'
  | 'Forwarded to Official'
  | 'Action Pending'
  | 'Resolved'
  | 'Closed';

export interface GrievanceTicket {
  id: string;
  citizenName: string;
  phoneNumber: string;
  village: string;
  category: GrievanceCategory;
  description: string;
  location: string;
  status: GrievanceStatus;
  createdAt: string;
  updatedAt: string;
  timeline: {
    date: string;
    status: GrievanceStatus;
    note: string;
  }[];
}

export interface ContactItem {
  id: string;
  title: LocalizedString;
  category: 'emergency' | 'administration' | 'health' | 'police' | 'agriculture' | 'centre';
  phone: string;
  alternatePhone?: string;
  email?: string;
  address: LocalizedString;
  timing?: LocalizedString;
  verified: boolean;
  mapUrl?: string;
}

export interface PlatformSettings {
  centreStatus: 'open' | 'closed' | 'camp' | 'temp_closed';
  statusNote: LocalizedString;
  operatingHours: LocalizedString;
  primaryPhone: string;
  alternatePhone: string;
  email: string;
  googleMapUrl: string;
  marketWhatsAppUrl: string;
  marketNotice: LocalizedString;
  announcementBanner: {
    enabled: boolean;
    text: LocalizedString;
    type: 'info' | 'warning' | 'alert';
  };
  lastUpdated: string;
}

export interface VillageNotice {
  id: string;
  title: LocalizedString;
  content: LocalizedString;
  date: string;
  expiryDate?: string;
  category: 'camp' | 'subsidy' | 'panchayat' | 'urgent';
  important?: boolean;
  source?: string;
}

export interface CropPrice {
  cropName: LocalizedString;
  variety?: string;
  unit: LocalizedString;
  priceRange: string;
  trend: 'up' | 'stable' | 'down';
  market: string;
  updatedDate: string;
}

export type NewsCategory = 'all' | 'vision' | 'agri' | 'jobs' | 'district' | 'national';

export interface NewsItem {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  content: LocalizedString;
  category: 'vision' | 'agri' | 'jobs' | 'district' | 'national';
  categoryLabel: LocalizedString;
  source: string;
  sourceUrl?: string;
  publishDate: string;
  important: boolean;
  featured?: boolean;
  tags: string[];
  isLiveRss?: boolean;
}

