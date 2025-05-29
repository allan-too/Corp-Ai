// Authentication types

export interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  subscriptionPlan?: string;
  subscriptionEndDate?: string;
  profilePictureUrl?: string;
  isActive: boolean;
  oauthProvider?: string;
  oauthId?: string;
}

export interface UserDetails {
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, subscriptionPlan: string, userDetails?: UserDetails) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  verifyToken: () => Promise<boolean>;
  handleOAuthCallback: (provider: string, code: string, state: string) => Promise<boolean>;
}

export type SubscriptionPlan = 'basic' | 'professional' | 'enterprise';

export interface ToolAccess {
  name: string;
  requiredPlans: SubscriptionPlan[];
}

// Tool access configuration
export const TOOL_ACCESS: Record<string, SubscriptionPlan[]> = {
  // Basic tools (all plans)
  crm: ['basic', 'professional', 'enterprise'],
  marketing: ['basic', 'professional', 'enterprise'],
  analytics: ['basic', 'professional', 'enterprise'],
  finance: ['basic', 'professional', 'enterprise'],
  
  // Professional tools
  hr: ['professional', 'enterprise'],
  reviews: ['professional', 'enterprise'],
  'social-media': ['professional', 'enterprise'],
  'chat-support': ['professional', 'enterprise'],
  'sales-forecast': ['professional', 'enterprise'],
  
  // Enterprise tools
  'legal-crm': ['enterprise'],
  'supply-chain': ['enterprise'],
  contracts: ['enterprise'],
  inventory: ['enterprise']
};
