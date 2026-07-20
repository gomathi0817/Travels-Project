import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Building, Heart, MapPin, Sparkles, Shield } from 'lucide-react';

export const Services = () => {
  const navigate = useNavigate();

  const serviceList = [
    {
      icon: <Plane size={24} />,
      title: "Airport Chauffeur Transfers",
      desc: "Timely airport pick-up and drop-off services for Coimbatore (CJB), Bangalore (BLR), and Chennai (MAA). Chauffeur assists with baggage and monitors flight delays."
    },
    {
      icon: <Building size={24} />,
      title: "Corporate Fleet Rentals",
      desc: "Monthly travel contracts, employee shuttles, and executive delegations. Detailed monthly GST invoicing and dedicated account manager support."
    },
    {
      icon: <MapPin size={24} />,
      title: "Inter-City Tour Packages",
      desc: "Custom holiday trip travel. Book coaches or buses for Ooty, Kodaikanal, Munnar, or pilgrimage journeys with skilled hill-station drivers."
    },
    {
      icon: <Heart size={24} />,
      title: "Wedding Luxury Convoy",
      desc: "Make your special day grand. Book premium Audi/Mercedes luxury sedans for the bride and groom, alongside mini-coaches for family transport."
    }
  ];

  return (
    <div className="pt-24 min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80')` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-widest text-amber-500 sm:text-4xl">Our Premium Services</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">Tailored Transportation Excellence For Every Destination</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {serviceList.map((service, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="font-display font-bold text-lg">{service.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{service.desc}</p>
              </div>
              <button
                onClick={() => navigate('/booking')}
                className="mt-6 text-xs text-amber-500 font-bold uppercase tracking-wider flex items-center hover:underline"
              >
                <span>Book This Service</span>
                <span className="ml-1">→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Feature Banner Section */}
        <div className="glass-panel-luxury rounded-3xl p-8 md:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 border border-amber-500/20">
          <div className="space-y-4 max-w-2xl">
            <span className="flex items-center space-x-2 text-amber-500 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={16} />
              <span>Premium Luxury Travel Chauffeur Desk</span>
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold uppercase">
              Need A Customized Corporate Travel Plan?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              We provide tailored solutions for IT parks, industrial houses, and hospitality chains. Get customized per-day rates, monthly accounting reports, and dedicated tracking setups.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full flex items-center space-x-2 transition-colors flex-shrink-0"
          >
            <span>Contact Corporate Desk</span>
            <Shield size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
export default Services;
