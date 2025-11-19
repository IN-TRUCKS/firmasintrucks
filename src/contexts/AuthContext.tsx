import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getNowCertsUser, clearAuth, getLastWordFromDisplayName } from '@/lib/nowcerts';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userDisplayName: string | null;
  userTeamTag: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userTeamTag, setUserTeamTag] = useState<string | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const user = getNowCertsUser();
    if (user) {
      setIsAuthenticated(true);
      setUserEmail(user.user_email);
      setUserDisplayName(user.userDisplayName);
      setUserTeamTag(user.userTeamTag);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('https://api.nowcerts.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Credenciales inválidas');
      } else if (response.status === 403) {
        throw new Error('Acceso denegado');
      } else {
        throw new Error('Error al iniciar sesión. Intenta nuevamente');
      }
    }

    const data = await response.json();

    // Save to localStorage
    const teamTag = getLastWordFromDisplayName(data.userDisplayName);
    localStorage.setItem('nowcerts_token', data.access_token);
    localStorage.setItem('user_email', data.userName);
    localStorage.setItem('userDisplayName', data.userDisplayName);
    localStorage.setItem('userTeamTag', teamTag);

    // Update state
    setIsAuthenticated(true);
    setUserEmail(data.userName);
    setUserDisplayName(data.userDisplayName);
    setUserTeamTag(teamTag);
  };

  const logout = () => {
    clearAuth();
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserDisplayName(null);
    setUserTeamTag(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userDisplayName,
        userTeamTag,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
