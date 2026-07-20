import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/supabaseClient';
import { mockDB } from '../services/mockDB';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize simulated or real session
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Supabase Session Handler
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          fetchSupabaseProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session) {
            await fetchSupabaseProfile(session.user);
          } else {
            setUser(null);
            setLoading(false);
          }
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // 2. Mock Session Handler
      const storedSession = localStorage.getItem("dtt_session");
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
      setLoading(false);
    }
  }, []);

  const fetchSupabaseProfile = async (authObj) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authObj.id)
        .single();

      if (error) throw error;
      setUser({ ...authObj, ...data });
    } catch (err) {
      console.error("Error fetching Supabase profile:", err.message);
      // Fallback if profile doesn't exist yet
      setUser({
        id: authObj.id,
        email: authObj.email,
        name: authObj.user_metadata?.name || 'Customer',
        role: authObj.user_metadata?.role || 'Customer',
        phone: authObj.user_metadata?.phone || '',
        photo: authObj.user_metadata?.photo || ''
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        setLoading(false);
        throw error;
      }
      return data;
    } else {
      // Mock Authentication
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let role = "Customer";
          let name = "Pranav Kumar";
          let phone = "+91 98765 43210";
          let photo = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

          // Admin trigger
          if (email.toLowerCase() === "admin@dheeran.com") {
            role = "Admin";
            name = "Dheeran Admin";
            phone = "+91 94444 88888";
            photo = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80";
          } else if (email.toLowerCase() === "customer@dheeran.com") {
            name = "Pranav Kumar";
          } else {
            name = email.split('@')[0].toUpperCase();
          }

          const mockUser = {
            id: `usr-${Date.now()}`,
            email,
            name,
            role,
            phone,
            photo
          };

          localStorage.setItem("dtt_session", JSON.stringify(mockUser));
          setUser(mockUser);
          setLoading(false);
          resolve(mockUser);
        }, 800);
      });
    }
  };

  const signup = async (email, password, name, phone) => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role: 'Customer'
          }
        }
      });
      if (error) {
        setLoading(false);
        throw error;
      }
      return data;
    } else {
      // Mock Signup
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = {
            id: `usr-${Date.now()}`,
            email,
            name,
            role: "Customer",
            phone,
            photo: ""
          };
          localStorage.setItem("dtt_session", JSON.stringify(mockUser));
          setUser(mockUser);
          setLoading(false);
          resolve(mockUser);
        }, 800);
      });
    }
  };

  const logout = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem("dtt_session");
      setUser(null);
    }
    setLoading(false);
  };

  const updateProfile = async (updates) => {
    if (isSupabaseConfigured && supabase && user) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      setUser(prev => ({ ...prev, ...updates }));
    } else {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem("dtt_session", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
