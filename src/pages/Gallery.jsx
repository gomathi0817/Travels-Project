import React, { useState, useEffect } from 'react';
import { mockDB } from '../services/mockDB';
import { Star, MessageCircle, Send, StarHalf } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Gallery = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: '',
    role: 'Leisure Traveller',
    rating: 5,
    comment: ''
  });

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=600&q=80",
      title: "Mercedes S-Class VIP Transfer",
      tag: "Luxury Cars"
    },
    {
      url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
      title: "Chauffeur Executive Outing",
      tag: "Leisure"
    },
    {
      url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
      title: "Force Traveller Mini Coach",
      tag: "Coaches"
    },
    {
      url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
      title: "BMW 7 Series Airport Pickup",
      tag: "Luxury Cars"
    },
    {
      url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80",
      title: "Volvo Multi-Axle Highway Cruising",
      tag: "Buses"
    },
    {
      url: "https://images.unsplash.com/photo-1601758003122-53c40e636a9b?auto=format&fit=crop&w=600&q=80",
      title: "Scania Premium Tourist Coach",
      tag: "Buses"
    }
  ];

  useEffect(() => {
    setReviews(mockDB.getReviews());
  }, []);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      toast.error("Please fill in your name and comment.");
      return;
    }

    const saved = mockDB.addReview(newReview);
    setReviews([saved, ...reviews]); // Add to UI
    setNewReview({ name: '', role: 'Leisure Traveller', rating: 5, comment: '' });
    toast.success("Thank you! Review submitted successfully.");
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  return (
    <div className="pt-24 min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80')` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-widest text-amber-500 sm:text-4xl">Gallery & Reviews</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">Capturing Premium Fleet Luxury and Customer Happiness</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Photo Grid */}
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold uppercase tracking-widest">Our Fleet in Action</h2>
          <p className="text-xs text-slate-400 mt-1">Glimpse our luxury vehicles and tour bookings.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden shadow-sm h-64 bg-slate-900 border border-slate-100 dark:border-slate-800"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{img.tag}</span>
                <h4 className="text-white text-xs font-bold mt-0.5">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Reviews List - Left Col (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <MessageCircle className="text-amber-500" />
              <h3 className="font-display font-extrabold text-lg uppercase tracking-wider">Guest Testimonials</h3>
            </div>

            <div className="space-y-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="h-12 w-12 rounded-full object-cover border border-amber-500/20"
                  />
                  <div className="space-y-2 flex-grow">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rev.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{rev.role}</p>
                      </div>
                      
                      {/* Star Rating */}
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" />
                        ))}
                        {Array.from({ length: 5 - rev.rating }).map((_, i) => (
                          <Star key={i} size={13} className="text-slate-200 dark:text-slate-800" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <p className="text-[9px] text-slate-400 text-right">{rev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Review - Right Col */}
          <div className="glass-panel border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-md sticky top-24">
            <h3 className="font-display font-extrabold text-base uppercase tracking-widest border-b dark:border-slate-800 pb-3 mb-6">
              Write A Review
            </h3>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Trip Type / Role</label>
                <select
                  value={newReview.role}
                  onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500 dark:bg-slate-900 text-slate-400"
                >
                  <option value="Leisure Traveller">Leisure Outing</option>
                  <option value="Corporate Executive">Corporate Executive</option>
                  <option value="Family Outing">Family Vacation</option>
                  <option value="Wedding Transport">Wedding Transport</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Overall Rating</label>
                <div className="flex space-x-2 pt-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="hover:scale-125 transition-transform"
                    >
                      <Star size={20} fill={newReview.rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Review Comments *</label>
                <textarea
                  placeholder="Share details of your travel experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gradient py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow hover:shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Submit Review</span>
                <Send size={12} />
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Gallery;
