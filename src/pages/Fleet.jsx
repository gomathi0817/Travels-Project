import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDB } from '../services/mockDB';
import { Car, Users, Check, Flame, Award, Filter, ArrowRightLeft, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Fleet = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  // Filters State
  const [category, setCategory] = useState('ALL');
  const [seatsFilter, setSeatsFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [acFilter, setAcFilter] = useState('ALL');

  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    const list = mockDB.getVehicles();
    setVehicles(list);
    setFilteredVehicles(list);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...vehicles];

    // Category Filter
    if (category !== 'ALL') {
      result = result.filter(v => v.type === category);
    }

    // Seats Filter
    if (seatsFilter !== 'ALL') {
      const seatsLimit = parseInt(seatsFilter, 10);
      result = result.filter(v => v.seats <= seatsLimit);
    }

    // AC Filter
    if (acFilter !== 'ALL') {
      const isAc = acFilter === 'AC';
      result = result.filter(v => v.ac === isAc);
    }

    // Sorting
    if (sortBy === 'PRICE_ASC') {
      result.sort((a, b) => a.price_per_km - b.price_per_km);
    } else if (sortBy === 'PRICE_DESC') {
      result.sort((a, b) => b.price_per_km - a.price_per_km);
    } else if (sortBy === 'SEATS_DESC') {
      result.sort((a, b) => b.seats - a.seats);
    }

    setFilteredVehicles(result);
  }, [category, seatsFilter, sortBy, acFilter, vehicles]);

  // Handle Comparison Select
  const handleToggleCompare = (vehicle) => {
    if (compareList.some(v => v.id === vehicle.id)) {
      setCompareList(compareList.filter(v => v.id !== vehicle.id));
      toast.success(`${vehicle.name} removed from comparison.`);
    } else {
      if (compareList.length >= 3) {
        toast.error("You can compare up to 3 vehicles maximum.");
        return;
      }
      setCompareList([...compareList, vehicle]);
      toast.success(`${vehicle.name} added to comparison list.`);
    }
  };

  const handleBook = (vehicle) => {
    navigate('/booking', {
      state: {
        prefilledVehicle: {
          type: vehicle.type,
          model: vehicle.name,
          seats: vehicle.seats,
          rate: vehicle.price_per_km
        }
      }
    });
  };

  return (
    <div className="pt-24 min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-widest text-amber-500 sm:text-4xl">Our Luxury Fleet</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">Discover Coimbatore's Premier Car, Coach, and Bus Rental Solutions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filters Controls Panel */}
        <div className="glass-panel rounded-2xl p-5 mb-8 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {['ALL', 'CAR', 'COACH', 'BUS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all border ${
                    category === cat
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                      : 'bg-transparent border-slate-300 hover:border-amber-500 dark:border-slate-700'
                  }`}
                >
                  {cat === 'ALL' ? 'All Vehicles' : `${cat}s`}
                </button>
              ))}
            </div>

            {/* Other Filters */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Seats Filter */}
              <div className="flex items-center space-x-2">
                <Users size={14} className="text-slate-400" />
                <select
                  value={seatsFilter}
                  onChange={(e) => setSeatsFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">All Seating Sizes</option>
                  <option value="4">Up to 4 Seats</option>
                  <option value="8">Up to 8 Seats</option>
                  <option value="14">Up to 14 Seats</option>
                  <option value="40">Up to 40 Seats</option>
                  <option value="120">Up to 120 Seats</option>
                </select>
              </div>

              {/* AC Filter */}
              <div className="flex items-center space-x-2">
                <Flame size={14} className="text-slate-400" />
                <select
                  value={acFilter}
                  onChange={(e) => setAcFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">AC / Non-AC</option>
                  <option value="AC">AC Only</option>
                  <option value="NONAC">Non-AC Only</option>
                </select>
              </div>

              {/* Sorting */}
              <div className="flex items-center space-x-2">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <option value="DEFAULT">Sort By</option>
                  <option value="PRICE_ASC">Price: Low to High</option>
                  <option value="PRICE_DESC">Price: High to Low</option>
                  <option value="SEATS_DESC">Seats: Max to Min</option>
                </select>
              </div>

              {/* Comparison Drawer Button */}
              {compareList.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase px-4 py-2.5 rounded-lg transition-colors shadow"
                >
                  <ArrowRightLeft size={14} />
                  <span>Compare ({compareList.length})</span>
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              No vehicles match the selected filter criteria. Try resetting.
            </div>
          ) : (
            filteredVehicles.map((vehicle) => {
              const isComparing = compareList.some(v => v.id === vehicle.id);
              return (
                <motion.div
                  key={vehicle.id}
                  layout
                  className="glass-card rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col h-full bg-white dark:bg-slate-900"
                >
                  {/* Image wrapper */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 text-amber-500 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-amber-500/20">
                      {vehicle.type}
                    </span>
                    {vehicle.ac && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-amber-500">
                        AC
                      </span>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{vehicle.brand}</p>
                        <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white leading-tight mt-0.5">{vehicle.model}</h3>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs border-y border-slate-100 dark:border-slate-800 py-4">
                        <div className="flex items-center space-x-2">
                          <Users size={14} className="text-amber-500" />
                          <span className="text-slate-400">Seats: <strong className="text-slate-800 dark:text-slate-200">{vehicle.seats} Seater</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Car size={14} className="text-amber-500" />
                          <span className="text-slate-400">Mileage: <strong className="text-slate-800 dark:text-slate-200">{vehicle.mileage}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check size={14} className="text-emerald-500" />
                          <span className="text-slate-400">Chauffeur Incl.</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Flame size={14} className="text-amber-500" />
                          <span className="text-slate-400">Fuel: <strong className="text-slate-800 dark:text-slate-200">{vehicle.fuel_type}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="pt-6">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-xs text-slate-400">Price Rate</span>
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">₹{vehicle.price_per_km}</span>
                          <span className="text-[11px] text-slate-400"> / km</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {/* Compare Button */}
                        <button
                          onClick={() => handleToggleCompare(vehicle)}
                          className={`p-2.5 rounded-lg border transition-all ${
                            isComparing
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                              : 'border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 text-slate-400'
                          }`}
                          title="Compare vehicle"
                        >
                          <ArrowRightLeft size={16} />
                        </button>

                        {/* Book Button */}
                        <button
                          onClick={() => handleBook(vehicle)}
                          className="flex-grow btn-gradient text-xs uppercase tracking-wider font-bold py-2.5 rounded-lg text-center"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. COMPARISON DIALOG MODAL */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-4xl w-full border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <h3 className="font-display font-extrabold text-lg uppercase tracking-wider">Compare Vehicles</h3>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Compare Matrix Grid */}
              <div className="grid grid-cols-4 gap-4 text-xs">
                
                {/* Labels Column */}
                <div className="font-bold text-slate-400 flex flex-col justify-between py-2.5 space-y-4">
                  <div className="h-32 flex items-center">Vehicle Info</div>
                  <div className="border-b dark:border-slate-800 py-2">Category</div>
                  <div className="border-b dark:border-slate-800 py-2">Seat Count</div>
                  <div className="border-b dark:border-slate-800 py-2">AC Standard</div>
                  <div className="border-b dark:border-slate-800 py-2">Fuel Type</div>
                  <div className="border-b dark:border-slate-800 py-2">Mileage</div>
                  <div className="border-b dark:border-slate-800 py-2 font-black text-amber-500">Rate per KM</div>
                  <div className="py-2">Actions</div>
                </div>

                {/* Compared items */}
                {compareList.map((v) => (
                  <div key={v.id} className="text-center flex flex-col justify-between py-2.5 space-y-4 border-l border-slate-100 dark:border-slate-800 pl-4">
                    
                    {/* Header Spec */}
                    <div className="space-y-2 h-32 flex flex-col items-center justify-center">
                      <img src={v.image} alt={v.name} className="h-16 w-24 object-cover rounded-lg shadow-sm" />
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">{v.name}</p>
                    </div>

                    {/* Specifications rows */}
                    <div className="border-b dark:border-slate-800 py-2 text-slate-500 dark:text-slate-400">{v.type}</div>
                    <div className="border-b dark:border-slate-800 py-2 font-semibold text-slate-700 dark:text-slate-200">{v.seats} Seats</div>
                    <div className="border-b dark:border-slate-800 py-2 text-slate-500 dark:text-slate-400">{v.ac ? 'Yes (Climate Control)' : 'No'}</div>
                    <div className="border-b dark:border-slate-800 py-2 text-slate-500 dark:text-slate-400">{v.fuel_type}</div>
                    <div className="border-b dark:border-slate-800 py-2 text-slate-500 dark:text-slate-400">{v.mileage}</div>
                    <div className="border-b dark:border-slate-800 py-2 font-bold text-slate-900 dark:text-white">₹{v.price_per_km}/km</div>
                    
                    <div className="flex flex-col space-y-2 pt-2">
                      <button
                        onClick={() => handleBook(v)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg"
                      >
                        Book
                      </button>
                      <button
                        onClick={() => handleToggleCompare(v)}
                        className="text-red-500 hover:underline text-[10px]"
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                ))}

                {/* Fill slots if compare list is less than 3 */}
                {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center text-center py-12 border-l border-slate-100 dark:border-slate-800 text-slate-400">
                    <span className="text-[10px]">Select another vehicle to compare</span>
                  </div>
                ))}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default Fleet;
