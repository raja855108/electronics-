import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  token: string | null;
  adminUser: AdminUser | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'bin_admin_auth_token';
const ADMIN_USER_KEY = 'bin_admin_auth_user';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (newToken: string, user: AdminUser) => {
    setToken(newToken);
    setAdminUser(user);
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    } catch {}
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    } catch {}
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        adminUser,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
