import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Car, ArrowRight, ShieldCheck, Clock, Award, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Home = () => {
  const navigate = useNavigate();

  // Search Widget State
  const [searchQuery, setSearchQuery] = useState({
    pickup: '',
    destination: '',
    date: '',
    members: 2,
    type: 'CAR'
  });

  const handleSearchChange = (e) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.pickup || !searchQuery.destination || !searchQuery.date) {
      toast.error("Please fill in Pickup, Destination, and Travel Date.");
      return;
    }
    // Redirect to booking page with state
    navigate('/booking', { state: { searchData: searchQuery } });
  };

  // Stats Data
  const stats = [
    { number: "1.2M+", label: "KM Driven Safely" },
    { number: "45K+", label: "Happy Journeys" },
    { number: "150+", label: "Premium Drivers" },
    { number: "75+", label: "Luxury Vehicles" }
  ];

  // Offers Data
  const offers = [
    { code: "DHEERAN10", discount: "10% OFF", desc: "On first booking above 200 km" },
    { code: "WELCOME500", discount: "₹500 OFF", desc: "Flat discount on round trips" }
  ];

  // FAQ Data
  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    { q: "Is driver allowance included in the price?", a: "Yes, our default pricing calculations on the booking invoice transparently break down the basic charge and add the driver allowance. You will see the exact pricing before confirming." },
    { q: "Do you offer inter-state permits?", a: "Yes! All our vehicles have active national permits. Inter-state permit charges are included automatically based on your destination state." },
    { q: "Can I track my vehicle in real-time?", a: "Absolutely! Once your trip begins, you can log into your Customer Dashboard to view live route simulations and vehicle location updates." },
    { q: "What is your cancellation policy?", a: "Cancellations made 24 hours before the departure time are eligible for a 100% refund. Cancellations within 24 hours incur a minor processing fee." }
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <div className="relative min-h-screen text-slate-800 dark:text-slate-100">
      
      {/* 1. HERO SECTION WITH PARALLAX BACKGROUND */}
      <div className="relative min-h-[90vh] lg:min-h-screen w-full flex flex-col justify-between pt-28 pb-12 md:pb-16">
        
        {/* Parallax Image Background (Contained overflow for zoom effect) */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80')`
            }}
          />
          {/* Luxury dark gradient overlay */}
          <div className="absolute inset-0 hero-gradient-overlay" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center my-auto sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block text-xs font-bold tracking-[0.4em] text-amber-500 uppercase bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
              Chauffeur Driven Premium Fleet
            </span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl uppercase">
              Travel Anywhere <br className="hidden sm:inline" />
              <span className="text-amber-500">Comfortably</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base text-slate-300 sm:text-xl font-light">
              Book luxury cars, multi-axle coaches, and tour buses easily at transparent, affordable per-kilometer rates.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/booking')}
                className="btn-gradient font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg flex items-center space-x-2 cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/fleet')}
                className="bg-transparent border border-white/30 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-white hover:text-slate-950 transition-all duration-300 cursor-pointer"
              >
                Explore Fleet
              </button>
            </div>
          </motion.div>
        </div>

        {/* Fully Responsive Search Widget (Never Clipped) */}
        <div className="relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-6 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel-luxury rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/20"
          >
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end text-white">
              
              {/* Pickup Location */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">Pickup Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3.5 text-amber-500" />
                  <input
                    type="text"
                    name="pickup"
                    value={searchQuery.pickup}
                    onChange={handleSearchChange}
                    placeholder="Enter city or point"
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">Destination</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3.5 text-amber-500" />
                  <input
                    type="text"
                    name="destination"
                    value={searchQuery.destination}
                    onChange={handleSearchChange}
                    placeholder="Enter destination"
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Travel Date */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">Travel Date</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-3.5 text-amber-500" />
                  <input
                    type="date"
                    name="date"
                    value={searchQuery.date}
                    onChange={handleSearchChange}
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-amber-500 text-slate-200"
                  />
                </div>
              </div>

              {/* Vehicle Category */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">Vehicle Category</label>
                <div className="relative">
                  <Car size={15} className="absolute left-3 top-3.5 text-amber-500" />
                  <select
                    name="type"
                    value={searchQuery.type}
                    onChange={handleSearchChange}
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-amber-500 text-slate-200"
                  >
                    <option value="CAR">Premium Car</option>
                    <option value="COACH">Executive Coach</option>
                    <option value="BUS">Tour Bus</option>
                  </select>
                </div>
              </div>

              {/* Search Submit Button */}
              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Search Fleet
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      </div>

      {/* 2. STATS SECTION */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center p-6 border border-slate-100 dark:border-slate-900 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20"
              >
                <h3 className="text-4xl font-extrabold text-amber-500 font-display">{stat.number}</h3>
                <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2 font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROMO OFFERS & SPECIAL BANNER */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold uppercase tracking-widest">Special Offers & Deals</h2>
            <p className="text-sm text-slate-500 mt-1">Copy promo codes to use during booking checkout.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer, idx) => (
              <div
                key={idx}
                className="glass-panel border-l-4 border-l-amber-500 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-lg transition-all"
              >
                <div>
                  <span className="text-xs font-bold text-amber-500 tracking-widest uppercase">{offer.discount}</span>
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 mt-1">{offer.desc}</h3>
                  <p className="text-xs text-slate-400 mt-1">Applicable online only</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="border-2 border-dashed border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg text-slate-600 dark:text-slate-300">
                    {offer.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
              Why Choose Dheeran Travels
            </h2>
            <p className="text-slate-500 mt-2">Providing premium travel standardizations with first-rate safety and features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-slate-100 dark:border-slate-900 rounded-2xl space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display font-bold text-lg">Safe & Secured Journey</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All vehicles feature advanced GPS, speed Governors, and active inter-state permit tracking. Fully certified and safety-tested fleets.
              </p>
            </div>

            <div className="p-6 border border-slate-100 dark:border-slate-900 rounded-2xl space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Clock size={24} />
              </div>
              <h3 className="font-display font-bold text-lg">24x7 Customer Desk</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated travel desk ready to assist with custom booking modifications, corporate invoicing, and emergency roadside recovery.
              </p>
            </div>

            <div className="p-6 border border-slate-100 dark:border-slate-900 rounded-2xl space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Award size={24} />
              </div>
              <h3 className="font-display font-bold text-lg">Elite Chauffeurs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drivers possess 8+ years experience, undergo rigorous verification, and speak multiple languages including English, Tamil, and Hindi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION SECTION */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl font-bold uppercase tracking-widest">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-xs mt-1">Get instant answers about pricing, permits, and tracking.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="flex items-center space-x-3">
                    <HelpCircle size={16} className="text-amber-500 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <span className="text-amber-500 font-bold text-lg">{activeFaq === idx ? '-' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-50 dark:border-slate-800 text-xs text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
export default Home;
