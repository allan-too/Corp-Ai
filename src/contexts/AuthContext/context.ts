import { createContext } from 'react';
import { AuthContextType } from '../authUtils';

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
