import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Users, ShieldCheck, MapPin, Compass } from 'lucide-react';

export const About = () => {
  return (
    <div className="pt-24 min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
      
      {/* Page Title */}
      <div className="bg-slate-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&w=1000&q=80')` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-widest text-amber-500 sm:text-4xl">About Our Company</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">Dheeran Tours And Travels — Since 2012</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
              Redefining Premium Tours & Travels
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Founded in Coimbatore, Dheeran Tours and Travels has grown into one of South India's premier luxury transport companies. We specialize in providing pristine vehicles, bespoke travel configurations, and well-behaved, safety-focused chauffeurs for corporate executives, wedding parties, and leisure tours.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              We operate under a simple philosophy: transparent distance-based pricing, zero hidden charges, and absolute punctuality. Our extensive fleet is maintained in top-tier condition at our dedicated facility, ensuring your safety and comfort on every single kilometer.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80"
              alt="Premium Car Front"
              className="w-full object-cover h-80 hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start space-x-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg uppercase tracking-wider mb-3">Our Mission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                To deliver luxurious, safe, and highly dependable travel services. We aim to inspire journeys by providing transparent billing and professional support that corporate and premium clients deserve.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start space-x-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <Eye size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg uppercase tracking-wider mb-3">Our Vision</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                To become the national benchmark for premium chauffeur-driven rentals. We strive to pioneer smart tracking solutions and sustainable fleet logistics for a greener, smoother travel industry.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values / Why Choose Us Grid */}
        <div className="text-center mb-16">
          <h2 className="font-display text-2xl font-bold uppercase tracking-widest">Why Travellers Choose Us</h2>
          <p className="text-xs text-slate-400 mt-1">Our core values drive every single trip we deliver.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-500/30 transition-all">
            <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <h4 className="font-display font-bold text-sm">Professional Drivers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every driver undergoes complete background checks, medical checks, and language checks for smooth customer interaction.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-500/30 transition-all">
            <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-display font-bold text-sm">Safe Journeys First</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fleet vehicles undergo regular maintenance checkups, safety audits, and are equipped with mandatory first-aid and toolkits.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-500/30 transition-all">
            <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h4 className="font-display font-bold text-sm">Real-time GPS Tracking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our administrative center and your customer dashboard allow real-time location tracking for maximum coordinate safety.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-500/30 transition-all">
            <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <Compass size={20} />
            </div>
            <h4 className="font-display font-bold text-sm">Modern Premium Fleet</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              From luxury Mercedes sedans to Force Traveller luxury vans and Volvo touring buses, we satisfy every transport size requirement.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default About;
