import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Map } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Contact = () => {
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleInputChange = (e) => {
    setInquiryForm({ ...inquiryForm, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone || !inquiryForm.email || !inquiryForm.message) {
      toast.error("Please fill in all mandatory inquiry details.");
      return;
    }
    toast.success("Inquiry received! Our desk manager will contact you within 15 minutes.");
    setInquiryForm({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="pt-24 min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80')` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-widest text-amber-500 sm:text-4xl">Contact Our Desk</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">Available 24 Hours For Corporate Inquiries & Custom Bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Contact Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
              <Phone size={22} />
            </div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">Phone Chauffeur Desk</h3>
            <p className="text-xs text-slate-400">Call anytime for support</p>
            <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">+91 94444 88888<br />+91 98430 12345</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
              <Mail size={22} />
            </div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">Email Inquiry</h3>
            <p className="text-xs text-slate-400">Expect replies in 1 hour</p>
            <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">bookings@dheerantravels.com<br />support@dheeran.com</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
              <MapPin size={22} />
            </div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">Headquarters</h3>
            <p className="text-xs text-slate-400">Coimbatore Office Location</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">124, Premium Boulevard, Gandhipuram, Coimbatore, TN - 641012</p>
          </div>

        </div>

        {/* Form and Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Inquiry form - Left */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-display font-extrabold text-base uppercase tracking-widest border-b dark:border-slate-800 pb-3">
              Submit An Inquiry
            </h3>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={inquiryForm.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={inquiryForm.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone"
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={inquiryForm.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Subject</label>
                <select
                  name="subject"
                  value={inquiryForm.subject}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500 dark:bg-slate-900 text-slate-400"
                >
                  <option value="General Inquiry">General Trip Inquiry</option>
                  <option value="Corporate Contract">Corporate Contracts</option>
                  <option value="Wedding Luxury Fleet">Wedding Packages</option>
                  <option value="Driver Recruitment">Careers / Recruitment</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Detailed Message *</label>
                <textarea
                  name="message"
                  value={inquiryForm.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your trip schedule, dates, and vehicle preferences..."
                  rows={4}
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gradient py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow hover:shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Submit Inquiry</span>
                <Send size={12} />
              </button>

            </form>
          </div>

          {/* Styled Mock Map - Right */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
              <h3 className="font-display font-extrabold text-base uppercase tracking-widest">
                Office Location Map
              </h3>
              <div className="flex items-center space-x-1 text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                <Map size={12} />
                <span>Coimbatore HQ</span>
              </div>
            </div>

            {/* Premium Simulated Coordinate Dashboard Map Overlay */}
            <div className="relative h-72 rounded-2xl bg-slate-950 overflow-hidden flex flex-col justify-end p-4 border border-slate-800 shadow-inner">
              
              {/* Decorative grid pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* Map UI Elements */}
              <div className="absolute top-4 right-4 flex flex-col space-y-1.5 z-10 text-[9px] font-mono text-slate-400 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                <p className="text-amber-500 font-bold">GPS COORDINATES</p>
                <p>Lat: 11.0168° N</p>
                <p>Lng: 76.9558° E</p>
              </div>

              {/* Center pointer animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-8 rounded-full border border-amber-500/20 animate-ping" />
                  <div className="absolute -inset-4 rounded-full border border-amber-500/40 animate-ping" />
                  <div className="h-6 w-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-lg relative z-10">
                    <MapPin size={12} className="text-slate-950" />
                  </div>
                </div>
              </div>

              {/* Office Details Overlay Card */}
              <div className="relative z-10 glass-panel-luxury rounded-xl p-4 border border-amber-500/20 text-white space-y-1">
                <h4 className="font-display text-xs font-extrabold uppercase text-amber-500 tracking-wider">Dheeran HQ Desk</h4>
                <p className="text-[10px] text-slate-300 leading-normal">
                  Located near Gandhipuram bus terminal. Ample client parking space available for walk-in booking consultations.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Contact;
