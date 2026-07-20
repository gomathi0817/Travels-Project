import React, { useState, useEffect } from 'react';
import { MessageSquare, PhoneCall, ChevronUp } from 'lucide-react';

export const FloatingActionButtons = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3 items-center">
      
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919444488888?text=Hello%20Dheeran%20Tours%20and%20Travels,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20vehicle."
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-600 hover:scale-110 transition-all duration-300 animate-bounce"
        title="WhatsApp Booking Support"
      >
        {/* Simple React custom icon for WhatsApp style */}
        <MessageSquare size={22} fill="white" />
      </a>

      {/* Call Button */}
      <a
        href="tel:+919444488888"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-110 transition-all duration-300"
        title="Call Chauffeur Desk"
      >
        <PhoneCall size={20} />
      </a>

      {/* Back to Top */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-amber-500 shadow-xl border border-slate-800 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300"
          title="Back to Top"
        >
          <ChevronUp size={20} />
        </button>
      )}

    </div>
  );
};
export default FloatingActionButtons;
