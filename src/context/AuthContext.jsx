import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_USERS_KEY = 'system_zero_users';
const STORAGE_SESSION_KEY = 'system_zero_session';

const INITIAL_USERS = [
  {
    id: 'usr_architect',
    name: 'Sarah Connor',
    email: 'sarah@systemzero.io',
    password: 'Password123!',
    role: 'Chief Architect',
    avatar: 'SC',
    createdAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'usr_student',
    name: 'Alex Rivera',
    email: 'student@systemzero.io',
    password: 'Password123!',
    role: 'CS Student',
    avatar: 'AR',
    createdAt: '2026-02-10T11:30:00.000Z',
  },
  {
    id: 'usr_admin',
    name: 'Chief Admin',
    email: 'admin@systemzero.io',
    password: 'AdminPassword1!',
    role: 'System Administrator',
    avatar: 'CA',
    createdAt: '2026-02-20T14:15:00.000Z',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [toast, setToast] = useState(null);

  // Initialize users and active session from localStorage on mount
  useEffect(() => {
    try {
      // 1. Ensure seed users exist in localStorage
      const storedUsersRaw = localStorage.getItem(STORAGE_USERS_KEY);
      if (!storedUsersRaw) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      } else {
        // Ensure initial demo users exist even if storage has other entries
        try {
          const currentList = JSON.parse(storedUsersRaw);
          let modified = false;
          INITIAL_USERS.forEach((seedUser) => {
            if (!currentList.some((u) => u.email.toLowerCase() === seedUser.email.toLowerCase())) {
              currentList.push(seedUser);
              modified = true;
            }
          });
          if (modified) {
            localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(currentList));
          }
        } catch {
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
        }
      }

      // 2. Check for active session in localStorage
      const activeSessionRaw = localStorage.getItem(STORAGE_SESSION_KEY);
      if (activeSessionRaw) {
        const sessionData = JSON.parse(activeSessionRaw);
        if (sessionData && sessionData.email) {
          setUser(sessionData);
        }
      }
    } catch (err) {
      console.error('Error reading auth state from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev?.id ? null : prev));
    }, 3800);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Login handler
  const login = useCallback(
    ({ email, password, rememberMe = true }) => {
      const normalizedEmail = (email || '').trim().toLowerCase();

      try {
        const storedUsersRaw = localStorage.getItem(STORAGE_USERS_KEY);
        const users = storedUsersRaw ? JSON.parse(storedUsersRaw) : INITIAL_USERS;

        const foundUser = users.find(
          (u) => u.email.toLowerCase() === normalizedEmail
        );

        if (!foundUser) {
          return {
            success: false,
            error: 'No account registered with this email address.',
          };
        }

        if (foundUser.password !== password) {
          return {
            success: false,
            error: 'Incorrect password. Check your credentials or try quick demo login.',
          };
        }

        const sessionUser = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role || 'CS Student',
          avatar: foundUser.avatar || foundUser.name.slice(0, 2).toUpperCase(),
          sessionStart: new Date().toISOString(),
          rememberMe,
        };

        if (rememberMe) {
          localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
        } else {
          sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
          localStorage.removeItem(STORAGE_SESSION_KEY);
        }

        setUser(sessionUser);
        setIsAuthModalOpen(false);
        showToast(`Welcome back, ${sessionUser.name.split(' ')[0]}! Session authenticated.`);
        return { success: true, user: sessionUser };
      } catch (err) {
        console.error('Login error:', err);
        return {
          success: false,
          error: 'An unexpected error occurred while authenticating. Please try again.',
        };
      }
    },
    [showToast]
  );

  // Register handler
  const register = useCallback(
    ({ name, email, password, role = 'CS Student' }) => {
      const trimmedName = (name || '').trim();
      const normalizedEmail = (email || '').trim().toLowerCase();

      try {
        const storedUsersRaw = localStorage.getItem(STORAGE_USERS_KEY);
        const users = storedUsersRaw ? JSON.parse(storedUsersRaw) : [...INITIAL_USERS];

        const existing = users.find(
          (u) => u.email.toLowerCase() === normalizedEmail
        );

        if (existing) {
          return {
            success: false,
            error: 'An account with this email already exists. Please sign in instead.',
          };
        }

        const initials =
          trimmedName
            .split(' ')
            .filter(Boolean)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'SZ';

        const newUser = {
          id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          name: trimmedName,
          email: normalizedEmail,
          password,
          role: role || 'CS Student',
          avatar: initials,
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

        // Auto login on registration
        const sessionUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          sessionStart: new Date().toISOString(),
          rememberMe: true,
        };

        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        setIsAuthModalOpen(false);
        showToast(`Account created! Welcome to System Zero, ${sessionUser.name.split(' ')[0]}!`);
        return { success: true, user: sessionUser };
      } catch (err) {
        console.error('Registration error:', err);
        return {
          success: false,
          error: 'Failed to create account due to storage error. Please try again.',
        };
      }
    },
    [showToast]
  );

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
    setUser(null);
    showToast('Signed out successfully. Session closed.', 'info');
  }, [showToast]);

  // Demo account quick login
  const quickDemoLogin = useCallback(
    (accountKey = 'student') => {
      const demoAccounts = {
        student: { email: 'student@systemzero.io', password: 'Password123!' },
        architect: { email: 'sarah@systemzero.io', password: 'Password123!' },
        admin: { email: 'admin@systemzero.io', password: 'AdminPassword1!' },
      };

      const creds = demoAccounts[accountKey] || demoAccounts.student;
      return login({ ...creds, rememberMe: true });
    },
    [login]
  );

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    quickDemoLogin,
    toast,
    showToast,
    dismissToast,
    demoAccounts: INITIAL_USERS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
