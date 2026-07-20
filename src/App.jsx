import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Fleet } from './pages/Fleet';
import { Services } from './pages/Services';
import { Booking } from './pages/Booking';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Components
import LoadingScreen from './components/LoadingScreen';

// Navigation Auth Guard Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized for the role, redirect to corresponding dashboard or home
    if (user.role === 'Admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Application Layout (Shared header, footer, floating buttons) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="fleet" element={<Fleet />} />
              <Route path="services" element={<Services />} />
              <Route path="booking" element={<Booking />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              
              {/* Customer Dashboard Portal - Guarded to Customer role */}
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['Customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Admin Portal - Guarded to Admin role (Standalone sidebar layout) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Notification System */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0F172A',
                color: '#FFFFFF',
                border: '1px solid rgba(245,158,11,0.15)',
                fontSize: '12px',
                borderRadius: '12px'
              }
            }} 
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
