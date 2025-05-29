import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { toast } from '../../hooks/use-toast';
import { User, UserDetails } from '../authUtils';
import { formatUserData, getErrorMessage } from '../authUtils';
import { AuthContext } from './context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      if (token) {
        try {
          console.log('Fetching user profile with token...');
          const response = await apiClient.get('/auth/me');
          console.log('User profile response:', response.data);
          
          // Extract user data from response
          const userData = response.data;
          
          // Create user object from response data using utility function
          const user = formatUserData(userData);
          
          setUser(user);
          console.log('User authenticated:', user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      // Extract data from response based on the backend format
      const { access_token, email: userEmail, role, user_id, subscription_plan, subscription_end_date } = response.data;
      
      // Create user object from response data
      const userData: User = {
        id: user_id,
        email: userEmail,
        role: role,
        subscriptionPlan: subscription_plan,
        subscriptionEndDate: subscription_end_date,
        isActive: true,
        // Add empty fields for other properties
        firstName: undefined,
        lastName: undefined,
        companyName: undefined,
        profilePictureUrl: undefined,
        oauthProvider: undefined,
        oauthId: undefined
      };
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      return true;
    } catch (error: Error | unknown) {
    const err = error as { response?: { data?: { detail?: string }, status?: number } };
      console.error('Login error:', error);
      const errorMessage = getErrorMessage(error, "Invalid credentials. Please try again");
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  };

  const register = async (email: string, password: string, subscriptionPlan: string, userDetails?: UserDetails): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/register', { 
        email, 
        password, 
        confirm_password: password, // Add confirm_password field
        subscription_plan: subscriptionPlan,
        first_name: userDetails?.firstName,
        last_name: userDetails?.lastName,
        company_name: userDetails?.companyName
      });
      
      console.log('Registration response:', response.data);
      
      // Extract data from response based on the backend format
      const { access_token, email: userEmail, role, user_id, subscription_plan, subscription_end_date } = response.data;
      
      // Create user object from response data
      const userData: User = {
        id: user_id,
        email: userEmail,
        role: role,
        firstName: userDetails?.firstName,
        lastName: userDetails?.lastName,
        companyName: userDetails?.companyName,
        subscriptionPlan: subscription_plan,
        subscriptionEndDate: subscription_end_date,
        isActive: true,
        // Add empty fields for other properties
        profilePictureUrl: undefined,
        oauthProvider: undefined,
        oauthId: undefined
      };
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      
      return true;
    } catch (error: Error | unknown) {
    const err = error as { response?: { data?: { detail?: string }, status?: number } };
      console.error('Registration error:', error);
      const errorMessage = getErrorMessage(error, "Registration failed. Please try again.");
      
      // Handle specific error cases
      if (err.response?.status === 409) {
        toast({
          title: "Registration Failed", 
          description: "Email already registered. Please use a different email or try logging in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed", 
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };
  
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const response = await apiClient.put('/auth/profile', data);
      setUser(prev => prev ? { ...prev, ...response.data } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      return true;
    } catch (error: Error | unknown) {
    const err = error as { response?: { data?: { detail?: string }, status?: number } };
      toast({
        title: "Update Failed",
        description: err.response?.data?.detail || "Failed to update profile",
        variant: "destructive",
      });
      return false;
    }
  };

  // Compute authentication status
  const isAuthenticated = !!user && !!token;

  // Add a function to verify token validity
  const verifyToken = async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      const response = await apiClient.get('/auth/me');
      return !!response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      // Clear invalid token
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      return false;
    }
  };

  // Handle OAuth callback
  const handleOAuthCallback = async (provider: string, code: string, state: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/oauth/callback', {
        provider,
        code,
        state
      });
      
      const { access_token, user_data } = response.data;
      
      if (access_token && user_data) {
        localStorage.setItem('token', access_token);
        setToken(access_token);
        
        // Create user object using utility function and override oauthProvider
        const userData = {
          ...formatUserData(user_data),
          oauthProvider: provider
        };
        
        setUser(userData);
        
        toast({
          title: "Success",
          description: `Logged in with ${provider} successfully!`,
        });
        
        return true;
      }
      
      return false;
    } catch (error: Error | unknown) {
    const err = error as { response?: { data?: { detail?: string }, status?: number } };
      console.error(`${provider} OAuth error:`, error);
      toast({
        title: "Authentication Failed",
        description: err.response?.data?.detail || `Failed to authenticate with ${provider}`,
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      loading, 
      updateProfile, 
      isAuthenticated,
      verifyToken,
      handleOAuthCallback
    }}>
      {children}
    </AuthContext.Provider>
  );
};
