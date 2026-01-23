// Common Types

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Session {
  user: User;
  expiresAt: Date;
}

// Community Types
export interface Community {
  id: number;
  name: string;
  leader: string;
  area: string;
  members: number;
  meetingDay: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

// Testimonial Types
export interface Testimonial {
  id: number;
  name: string;
  community: string;
  content: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

// Post Types
export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  authorId: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: number;
    name: string;
    email: string;
  };
  _count?: {
    comments: number;
    likes: number;
  };
}

// Comment Types
export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  createdAt: Date;
  author?: {
    id: number;
    name: string;
  };
}

// Ministry Types
export interface Pastor {
  id: number;
  name: string;
  position: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export interface MinistryTeam {
  id: number;
  name: string;
  description: string;
  activities: string[];
  icon: string;
  order: number;
  isActive: boolean;
}

export interface MinistryInfo {
  id: number;
  key: string;
  title: string;
  content: Record<string, any>;
}

// Site Content Types
export interface SiteContent {
  id: number;
  section: string;
  title: string;
  content: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

// Slide Types
export interface Slide {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  order: number;
  isActive: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// Event Types
export interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
}

export interface PastEvent {
  title: string;
  date: string;
  description: string;
  participants?: number;
}
