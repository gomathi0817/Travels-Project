import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { isSupabaseConfigured } from '../supabase/supabaseClient';

export const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all credentials.");
      return;
    }

    setLoading(true);
    try {
      if (forgotPassword) {
        // Simulate Forgot Password trigger
        toast.success("Password reset email sent. Please check your inbox!");
        setForgotPassword(false);
        setLoading(false);
        return;
      }

      if (isLogin) {
        // Verify Admin Login constraints if selected
        if (isAdminMode && email.toLowerCase() !== 'admin@dheeran.com') {
          throw new Error("Invalid admin credentials. Use admin@dheeran.com for administrative privileges.");
        }
        
        const userObj = await login(email, password);
        toast.success(`Welcome back, ${userObj.name || 'User'}!`);
        
        if (userObj.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        if (!name || !phone) {
          throw new Error("Full name and phone number are required for registration.");
        }
        await signup(email, password, name, phone);
        toast.success("Account created successfully! Dashboard loaded.");
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || "Authentication failed. Check your network or credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@dheeran.com');
      setPassword('admin123');
      setIsAdminMode(true);
      setIsLogin(true);
    } else {
      setEmail('customer@dheeran.com');
      setPassword('customer123');
      setIsAdminMode(false);
      setIsLogin(true);
    }
  };

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Graphic */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 filter blur-sm scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4 py-8"
      >
        <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl space-y-6">
          
          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 font-display text-xl font-bold text-slate-900 mb-2">
              D
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-widest text-white uppercase">
              {forgotPassword ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-xs text-slate-400">
              {forgotPassword 
                ? "Enter your email to receive recovery instructions." 
                : isLogin 
                  ? "Access your bookings and dashboard." 
                  : "Register to calculate custom fare estimates."}
            </p>
          </div>

          {/* Role selector tab (Only shown on Login and when not resetting password) */}
          {isLogin && !forgotPassword && (
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  !isAdminMode 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 ${
                  isAdminMode 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield size={12} />
                <span>Admin</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field (Signup only) */}
            {!isLogin && !forgotPassword && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-amber-500" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Phone Number Field (Signup only) */}
            {!isLogin && !forgotPassword && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 text-amber-500" size={14} />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-amber-500" size={14} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            {!forgotPassword && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setForgotPassword(true)}
                      className="text-[10px] text-amber-500 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-amber-500" size={14} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <>
                  <span>
                    {forgotPassword 
                      ? "Send Instructions" 
                      : isLogin 
                        ? `Sign In as ${isAdminMode ? 'Admin' : 'Customer'}` 
                        : "Create Account"}
                  </span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup Options */}
          <div className="border-t border-slate-800/80 pt-4 text-center">
            {forgotPassword ? (
              <button
                onClick={() => setForgotPassword(false)}
                className="text-xs text-amber-500 hover:underline"
              >
                Back to Sign In
              </button>
            ) : (
              <p className="text-xs text-slate-400">
                {isLogin ? "New to Dheeran Travels?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-amber-500 font-bold hover:underline"
                >
                  {isLogin ? "Register Now" : "Sign In"}
                </button>
              </p>
            )}
          </div>

          {/* Demo Autofill Section (Only active in simulated local-mode or for quick testing) */}
          {!isSupabaseConfigured && (
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 space-y-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                Demo Accounts Quick-Fill
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => autofillDemo('customer')}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-bold py-2 rounded-lg text-slate-300"
                >
                  Customer Demo
                </button>
                <button
                  onClick={() => autofillDemo('admin')}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-bold py-2 rounded-lg text-amber-500"
                >
                  Admin Demo
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
export default Login;
