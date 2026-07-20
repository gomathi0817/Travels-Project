import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thank you for subscribing to Dheeran Newsletter!");
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 font-display text-base font-bold text-slate-900">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-extrabold tracking-wider text-white">
                  DHEERAN
                </span>
                <span className="text-[8px] font-bold tracking-[0.25em] text-amber-500 uppercase">
                  Tours & Travels
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              Experience the pinnacle of luxury travel. Offering first-class cars, coaches, and buses with professional chauffeurs for commercial, corporate, and leisure journeys.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-amber-500 transition-colors"><FaFacebook size={18} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><FaTwitter size={18} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><FaInstagram size={18} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><FaLinkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white font-bold text-sm uppercase tracking-widest mb-6">Services & Fleet</h4>
            <ul className="space-y-3 text-xs">
              <li><Link to="/fleet" className="hover:text-amber-500 transition-colors">Premium Luxury Cars</Link></li>
              <li><Link to="/fleet" className="hover:text-amber-500 transition-colors">Executive Mini Coaches</Link></li>
              <li><Link to="/fleet" className="hover:text-amber-500 transition-colors">Luxury Multi-Axle Buses</Link></li>
              <li><Link to="/services" className="hover:text-amber-500 transition-colors">Airport Chauffeur Transfers</Link></li>
              <li><Link to="/services" className="hover:text-amber-500 transition-colors">Corporate Travel Solutions</Link></li>
              <li><Link to="/services" className="hover:text-amber-500 transition-colors">Inter-City Tours & Travels</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display text-white font-bold text-sm uppercase tracking-widest mb-6">Head Office</h4>
            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span>124, Premium Boulevard, Gandhipuram, Coimbatore, Tamil Nadu, 641012</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone size={16} className="text-amber-500" />
                <span>+91 94444 88888, +91 98430 12345</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail size={16} className="text-amber-500" />
                <span>bookings@dheerantravels.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-white font-bold text-sm uppercase tracking-widest mb-6">Stay Updated</h4>
            <p className="text-xs text-slate-400 mb-4">
              Subscribe to receive exclusive travel discounts, luxury tour offers, and fleet updates.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 pr-10"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-amber-500 hover:bg-amber-600 rounded-full px-3 text-slate-950 flex items-center justify-center transition-colors"
              >
                <Send size={12} />
              </button>
            </form>
          </div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 pt-8 gap-4">
          <p>© 2026 Dheeran Tours and Travels. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
