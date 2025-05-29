// Utility functions for authentication context

// User interface definition
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

// User details interface
export interface UserDetails {
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

// Format user data from API response
export const formatUserData = (userData: {
  user_id?: string;
  id?: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  subscription_plan?: string;
  subscription_end_date?: string;
  profile_picture_url?: string;
  oauth_provider?: string;
  oauth_id?: string;
}): User => {
  return {
    id: userData.user_id || userData.id,
    email: userData.email,
    role: userData.role,
    firstName: userData.first_name,
    lastName: userData.last_name,
    companyName: userData.company_name,
    subscriptionPlan: userData.subscription_plan,
    subscriptionEndDate: userData.subscription_end_date,
    profilePictureUrl: userData.profile_picture_url,
    oauthProvider: userData.oauth_provider,
    oauthId: userData.oauth_id,
    isActive: true
  };
};

// Check if a user has access to a specific tool based on subscription plan
export const hasToolAccess = (
  user: User | null,
  requiredPlans: string[]
): boolean => {
  if (!user) return false;
  
  // Admin always has access
  if (user.role === 'admin') return true;
  
  // Check if user's subscription plan is in the required plans list
  return user.subscriptionPlan ? requiredPlans.includes(user.subscriptionPlan) : false;
};

// Get error message from API error
export const getErrorMessage = (
  error: unknown, 
  defaultMessage: string
): string => {
  const err = error as { response?: { data?: { detail?: string } } };
  return err.response?.data?.detail || defaultMessage;
};
