import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Bell, User, LogOut, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { mockDB } from '../services/mockDB';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Sync notifications and scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const fetchNotifs = () => {
      setNotifications(mockDB.getNotifications());
    };

    window.addEventListener('scroll', handleScroll);
    fetchNotifs();

    // Check for updates every 15s to simulate real-time notification polling
    const interval = setInterval(fetchNotifs, 15000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    mockDB.markAllNotificationsRead();
    setNotifications(mockDB.getNotifications());
  };

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Fleet', path: '/fleet' },
    { label: 'Services', path: '/services' },
    { label: 'Booking', path: '/booking' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-panel py-3 shadow-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Branding */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 font-display text-lg font-bold text-slate-900 shadow-md">
              D
            </div>
            <div className="flex flex-col">
              <span className={`font-display text-lg font-extrabold tracking-wider ${isScrolled || theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
                DHEERAN
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-amber-500 uppercase">
                Tours & Travels
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  isActive(item.path)
                    ? 'text-amber-500'
                    : isScrolled || theme === 'dark'
                    ? 'text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400'
                    : 'text-slate-200 hover:text-amber-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Action Icons & User Profiles */}
          <div className="flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isScrolled || theme === 'dark'
                  ? 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className={`p-2 rounded-full relative transition-colors ${
                    isScrolled || theme === 'dark'
                      ? 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 mt-3 w-80 rounded-xl bg-white p-4 shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                      <h4 className="font-display font-bold text-sm">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-semibold text-amber-500 hover:underline flex items-center"
                        >
                          <Check size={10} className="mr-1" /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-3 no-scrollbar">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-2 rounded-lg text-xs transition-colors ${
                              notif.read ? 'bg-transparent' : 'bg-amber-500/5 dark:bg-amber-500/10'
                            }`}
                          >
                            <div className="flex justify-between font-bold">
                              <span>{notif.title}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{notif.time}</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center space-x-2 p-1.5 rounded-full border transition-all ${
                    isScrolled || theme === 'dark'
                      ? 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <img
                    src={user.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover shadow-sm"
                  />
                  <span className="hidden md:inline text-xs font-semibold max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown size={14} className="opacity-60" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-3 w-52 rounded-xl bg-white py-2 shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{user.role}</p>
                    </div>
                    
                    <Link
                      to={user.role === 'Admin' ? '/admin' : '/dashboard'}
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <User size={14} />
                      <span>{user.role === 'Admin' ? 'Admin Panel' : 'My Dashboard'}</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-500 dark:hover:bg-red-950/20"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-full transition-all border ${
                  isScrolled || theme === 'dark'
                    ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800 dark:border-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                    : 'border-white bg-white text-slate-900 hover:bg-slate-100'
                }`}
              >
                Log In
              </Link>
            )}

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isScrolled || theme === 'dark'
                  ? 'text-slate-800 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-800'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 mt-2 shadow-lg">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive(item.path)
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
