
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// Fixed casing in imports to match the files already included in the compilation set (lowercase versions).
import Login from './pages/login.tsx';
import Home from './pages/home.tsx';
import Explore from './pages/explore.tsx';
import Orders from './pages/orders.tsx';
import Profile from './pages/profile.tsx';
import Filters from './pages/filters.tsx';
import Bag from './pages/bag.tsx';
import AdminSeed from './pages/AdminSeed.tsx';
import { UserDoc, AppState } from './types';
import { getLocalUser, setLocalUser } from './lib/db.ts';
import Layout from './components/layout/Layout.tsx';

import { ThemeProvider } from './lib/ThemeContext.tsx';
import { BagProvider } from './lib/BagContext.tsx';

// ... (other imports)

const AuthContext = createContext<{
  user: UserDoc | null;
  isGuest: boolean;
  login: (userData: UserDoc) => void;
  logout: () => void;
  continueAsGuest: () => void;
  loading: boolean;
}>({
  user: null,
  isGuest: false,
  login: () => { },
  logout: () => { },
  continueAsGuest: () => { },
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

// Main App Component
const AppContent: React.FC = () => {
  // Moved theme logic to ThemeProvider
  const [user, setUser] = useState<UserDoc | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getLocalUser();
    const guestFlag = localStorage.getItem('cr_guest') === 'true';

    if (savedUser) {
      setUser(savedUser);
    } else if (guestFlag) {
      setIsGuest(true);
    }
    setLoading(false);
  }, []);

  const login = (userData: UserDoc) => {
    setUser(userData);
    setIsGuest(false);
    setLocalUser(userData);
    localStorage.removeItem('cr_guest');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    localStorage.setItem('cr_guest', 'true');
    localStorage.removeItem('cr_user');
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('cr_user');
    localStorage.removeItem('cr_guest');
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, isGuest, login, logout, continueAsGuest, loading }}>
      <BrowserRouter>
        <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
          <Routes>
            <Route path="/login" element={user || isGuest ? <Navigate to="/" /> : <Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/filters" element={<ProtectedRoute><Filters /></ProtectedRoute>} />
            <Route path="/bag" element={<ProtectedRoute><Bag /></ProtectedRoute>} />
            <Route path="/admin/seed" element={<AdminSeed />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BagProvider>
        <AppContent />
      </BagProvider>
    </ThemeProvider>
  );
}


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const location = useLocation();
  if (!user && !isGuest) return <Navigate to="/login" state={{ from: location }} />;
  return <Layout>{children}</Layout>;
};

export default App;
