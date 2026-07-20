import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockDB } from '../services/mockDB';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Phone, Mail, User, Shield, 
  Download, LogOut, CheckCircle2, Clock, XCircle, 
  Map, Navigation, Edit, Save, Camera, HelpCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const CustomerDashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('trips'); // trips, profile, tracking
  const [bookings, setBookings] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  
  // Profile edit states
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    photo: user?.photo || ''
  });

  // Tracking Simulation state
  const [trackingRoute, setTrackingRoute] = useState([]);
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);
  const [trackingIntervalId, setTrackingIntervalId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Fetch bookings filtered by email
    const allBookings = mockDB.getBookings();
    const userBookings = allBookings.filter(b => b.email.toLowerCase() === user.email.toLowerCase());
    setBookings(userBookings);

    // Auto-select first booking for tracking/details if available
    if (userBookings.length > 0) {
      setSelectedTrip(userBookings[0]);
    }

    setProfileData({
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      photo: user.photo || ''
    });
  }, [user]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (trackingIntervalId) clearInterval(trackingIntervalId);
    };
  }, [trackingIntervalId]);

  // Route Simulation Trigger
  const startTrackingSimulation = (trip) => {
    if (trackingIntervalId) {
      clearInterval(trackingIntervalId);
    }

    // Default premium route coordinate stops
    const routeCoordinates = [
      { name: trip.pickup || "Pickup Location", lat: 11.0168, lng: 76.9558 },
      { name: "Avinashi Bypass Stop", lat: 11.1931, lng: 77.2687 },
      { name: "Perundurai Toll Plaza", lat: 11.2774, lng: 77.5878 },
      { name: "Erode Junction Halt", lat: 11.3410, lng: 77.7172 },
      { name: "Bhavani Bridge Crossing", lat: 11.4398, lng: 77.6908 },
      { name: "Sankagiri Hills Lookout", lat: 11.4789, lng: 77.8687 },
      { name: trip.destination || "Destination Drop-off", lat: 11.6643, lng: 78.1460 }
    ];

    setTrackingRoute(routeCoordinates);
    setActiveMarkerIndex(0);

    const interval = setInterval(() => {
      setActiveMarkerIndex((prev) => {
        if (prev >= routeCoordinates.length - 1) {
          return 0; // Loop tracking for simulation demo
        }
        return prev + 1;
      });
    }, 4000);

    setTrackingIntervalId(interval);
  };

  const handleSelectTripForTracking = (trip) => {
    setSelectedTrip(trip);
    setActiveTab('tracking');
    startTrackingSimulation(trip);
    toast.success(`Live GPS tracking simulation activated for ${trip.id}`);
  };

  // PDF Invoice Builder
  const handleDownloadInvoice = (booking) => {
    try {
      const doc = new jsPDF();
      // Brand Header
      doc.setFillColor(15, 23, 42); // Primary Dark Navy
      doc.rect(0, 0, 210, 45, 'F');

      doc.setTextColor(245, 158, 11); // Accent Gold
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.text("DHEERAN TOURS AND TRAVELS", 14, 20);

      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.text("124, Premium Boulevard, Coimbatore - 641012 | +91 94444 88888", 14, 28);
      doc.text("Premium Chauffeur Driven Rentals & Intercity Tours", 14, 34);

      // Invoice Title
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont("Helvetica", "bold");
      doc.text("TRIP BOOKING INVOICE", 14, 60);

      // Booking Details
      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");
      doc.text(`Booking ID: ${booking.id}`, 14, 70);
      doc.text(`Invoice ID: ${booking.invoice_id || `INV-${booking.id.split('-')[1]}`}`, 14, 76);
      doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 82);
      doc.text(`Booking Status: ${booking.status}`, 14, 88);

      // Customer info
      doc.text(`Customer Name: ${booking.customer_name}`, 120, 70);
      doc.text(`Phone No: ${booking.phone}`, 120, 76);
      doc.text(`Email: ${booking.email}`, 120, 82);
      doc.text(`Trip Type: ${booking.trip_type}`, 120, 88);

      // Table details
      const headers = [["Description", "Value / Details"]];
      const data = [
        ["Vehicle Model", `${booking.vehicle_model} (${booking.seats} Seater ${booking.vehicle_type})`],
        ["Route Details", `From: ${booking.pickup} -> To: ${booking.destination}`],
        ["Travel Date & Time", `${booking.travel_date} at ${booking.start_time} ${booking.return_date ? `(Return: ${booking.return_date})` : ''}`],
        ["Estimated Distance", `${booking.total_km} KM`],
        ["Basic Rate Charge", `Rs. ${booking.fare}`],
        ["Driver & Allowances", `Rs. ${booking.additional_charges}`],
        ["Grand Total Bill Amount", `Rs. ${booking.grand_total}`],
        ["Advance Paid", `Rs. ${booking.advance_paid || 0}`],
        ["Pending Balance Amount", `Rs. ${booking.pending_amount || (booking.grand_total - (booking.advance_paid || 0))}`]
      ];

      doc.autoTable({
        head: headers,
        body: data,
        startY: 96,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], textColor: [245, 158, 11] },
        columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
      });

      // Terms footer
      doc.setFontSize(8);
      doc.text("Terms & Conditions:", 14, 185);
      doc.text("1. Toll and Parking fees are estimates and actual bills to be paid by client if they exceed limits.", 14, 191);
      doc.text("2. Standard waiting charges apply if delay exceeds 1 hour from scheduled end time.", 14, 197);
      doc.text("Thank you for choosing Dheeran Tours & Travels. Have a safe journey!", 14, 210);

      doc.save(`Invoice_${booking.id}.pdf`);
      toast.success("Invoice PDF downloaded successfully!");
    } catch (e) {
      toast.error("Failed to generate PDF. Check browser dependencies.");
      console.error(e);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (e) {
      toast.error("Profile update failed.");
    }
  };

  const handlePhotoUploadSimulate = () => {
    // Simulated picture upload option
    const sampleAvatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80"
    ];
    const chosen = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
    setProfileData({ ...profileData, photo: chosen });
    toast.success("Profile photo uploaded (simulation success)!");
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success("Signed out successfully.");
  };

  return (
    <div className="pt-24 min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 border border-slate-100 dark:border-slate-900 shadow flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <img
                src={user?.photo || profileData.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                alt={user?.name}
                className="h-16 w-16 rounded-full object-cover border border-amber-500/20 shadow-md"
              />
              <button 
                onClick={handlePhotoUploadSimulate}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                title="Change Avatar"
              >
                <Camera size={14} className="text-amber-500" />
              </button>
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold tracking-wide">
                Hello, <span className="text-amber-500">{user?.name || 'Customer'}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Welcome back to your luxury travel workspace.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (selectedTrip) {
                  handleSelectTripForTracking(selectedTrip);
                } else {
                  toast.error("No active bookings to simulate tracking.");
                }
              }}
              className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow"
            >
              <Navigation size={12} />
              <span>Track Live Trip</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-slate-900 dark:bg-slate-900/50 hover:bg-slate-800 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all border border-slate-700/30"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Workspaces */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar Menu */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-100 dark:border-slate-900 space-y-1">
            <button
              onClick={() => setActiveTab('trips')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeTab === 'trips'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/40'
              }`}
            >
              <Calendar size={14} />
              <span>Booking & Trips</span>
            </button>

            <button
              onClick={() => {
                if (selectedTrip) {
                  handleSelectTripForTracking(selectedTrip);
                } else {
                  setActiveTab('tracking');
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeTab === 'tracking'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/40'
              }`}
            >
              <Navigation size={14} />
              <span>Live Trip Tracking</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeTab === 'profile'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/40'
              }`}
            >
              <User size={14} />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Details Content Panel */}
          <div className="lg:col-span-3">
            
            {/* TRIPS TAB */}
            {activeTab === 'trips' && (
              <div className="space-y-6">
                <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-900 shadow">
                  <h3 className="font-display font-bold uppercase tracking-widest text-sm mb-6 text-slate-900 dark:text-white">
                    Trip Booking Records
                  </h3>
                  
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Calendar className="mx-auto text-slate-300 mb-4" size={40} />
                      <p className="text-sm">You haven't made any bookings yet.</p>
                      <button 
                        onClick={() => navigate('/booking')} 
                        className="btn-gradient text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg mt-4 shadow"
                      >
                        Book Now
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="pb-3 pr-2">Booking ID</th>
                            <th className="pb-3 pr-2">Vehicle</th>
                            <th className="pb-3 pr-2">Route</th>
                            <th className="pb-3 pr-2">Date</th>
                            <th className="pb-3 pr-2">Total Fare</th>
                            <th className="pb-3 pr-2">Status</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10">
                              <td className="py-4 font-mono font-bold">{booking.id}</td>
                              <td className="py-4 font-semibold">{booking.vehicle_model}</td>
                              <td className="py-4 text-slate-500">
                                {booking.pickup} → {booking.destination}
                              </td>
                              <td className="py-4">{booking.travel_date}</td>
                              <td className="py-4 font-bold">₹{booking.grand_total}</td>
                              <td className="py-4">
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                  booking.status === 'Confirmed' 
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                                    : booking.status === 'Completed'
                                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                                    : booking.status === 'Cancelled'
                                    ? 'bg-red-500/10 border-red-500/30 text-red-500'
                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                                }`}>
                                  {booking.status === 'Confirmed' && <CheckCircle2 size={10} className="mr-0.5" />}
                                  {booking.status === 'Pending' && <Clock size={10} className="mr-0.5" />}
                                  {booking.status === 'Cancelled' && <XCircle size={10} className="mr-0.5" />}
                                  <span>{booking.status}</span>
                                </span>
                              </td>
                              <td className="py-4 text-right space-x-2">
                                <button
                                  onClick={() => handleDownloadInvoice(booking)}
                                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-amber-500 transition-colors"
                                  title="Download Invoice PDF"
                                >
                                  <Download size={14} />
                                </button>
                                <button
                                  onClick={() => handleSelectTripForTracking(booking)}
                                  className="p-2 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 rounded-lg text-amber-500 transition-colors"
                                  title="Track Live Trip Status"
                                >
                                  <Navigation size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TRACKING TAB */}
            {activeTab === 'tracking' && (
              <div className="space-y-6">
                <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-900 shadow">
                  <h3 className="font-display font-bold uppercase tracking-widest text-sm mb-4 text-slate-900 dark:text-white">
                    Live GPS Vehicle Tracking Simulation
                  </h3>
                  
                  {selectedTrip ? (
                    <div className="space-y-6">
                      
                      {/* Overall Route Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-100 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-inner">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Trip Route Stops</span>
                          <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                            <span className="text-amber-500">{selectedTrip.pickup}</span>
                            <span className="text-slate-400 font-light">➜</span>
                            <span className="text-amber-500">{selectedTrip.destination}</span>
                          </h4>
                        </div>
                        <div className="mt-2 sm:mt-0 text-left sm:text-right">
                          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Scheduled Travel Date</span>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">{selectedTrip.travel_date}</p>
                        </div>
                      </div>

                      {/* Booking Metadata bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900 text-white rounded-xl p-4 border border-slate-800">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Booking ID</p>
                          <p className="text-xs font-mono font-bold mt-0.5 text-amber-500">{selectedTrip.id}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Vehicle Model</p>
                          <p className="text-xs font-bold mt-0.5">{selectedTrip.vehicle_model}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Driver Assigned</p>
                          <p className="text-xs font-bold mt-0.5">Karthikeyan R. (+91 98430)</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Current Speed</p>
                          <p className="text-xs font-bold mt-0.5 text-emerald-500">62 km/h (Active)</p>
                        </div>
                      </div>

                      {/* Map Container Mock */}
                      <div className="relative h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
                        {/* Simulation Graphic background grid */}
                        <div className="absolute inset-0 bg-slate-950 opacity-90" style={{
                          backgroundImage: `radial-gradient(rgba(245,158,11,0.06) 1px, transparent 0), radial-gradient(rgba(30,64,175,0.06) 1px, transparent 0)`,
                          backgroundSize: '24px 24px',
                          backgroundPosition: '0 0, 12px 12px'
                        }} />
                        
                        {/* Mock Map graphics (Clean premium visual interface) */}
                        <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-amber-500/20 via-blue-500 to-amber-500/20 z-0" />
                        
                        {/* Simulated Stop Pins */}
                        {trackingRoute.map((stop, idx) => (
                          <div 
                            key={idx}
                            style={{
                              left: `${15 + (idx * (70 / (trackingRoute.length - 1)))}%`,
                              top: idx % 2 === 0 ? '45%' : '55%'
                            }}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                          >
                            {/* Pin Node */}
                            <div className={`h-4 w-4 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              idx === activeMarkerIndex 
                                ? 'bg-amber-500 border-white scale-125 shadow-[0_0_15px_#F59E0B]' 
                                : idx < activeMarkerIndex
                                ? 'bg-blue-500 border-slate-900'
                                : 'bg-slate-800 border-slate-700'
                            }`}>
                              {idx === activeMarkerIndex && <div className="h-1.5 w-1.5 bg-slate-950 rounded-full animate-ping" />}
                            </div>
                            
                            {/* Label */}
                            <span className="text-[8px] uppercase tracking-wider font-bold mt-1 text-slate-400 max-w-[60px] text-center truncate">
                              {stop.name.split(" ")[0]}
                            </span>
                          </div>
                        ))}

                        {/* Interactive HUD Overlay */}
                        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 border border-amber-500/20 px-4 py-2.5 rounded-xl backdrop-blur max-w-xs text-white">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Simulated GPS Stop</p>
                          <p className="text-xs font-bold text-amber-500 mt-0.5">
                            {trackingRoute[activeMarkerIndex]?.name || "Tracking standby..."}
                          </p>
                          <p className="text-[10px] text-slate-300 mt-1 leading-tight">
                            Coordinates: {trackingRoute[activeMarkerIndex]?.lat?.toFixed(4)}N, {trackingRoute[activeMarkerIndex]?.lng?.toFixed(4)}E
                          </p>
                        </div>

                        {/* Floating live tracking indicator */}
                        <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center space-x-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>GPS SIMULATOR ACTIVE</span>
                        </div>
                      </div>

                      {/* Timeline details list */}
                      <div className="space-y-4">
                        <h4 className="text-xs uppercase font-bold tracking-widest text-slate-400">Route Milestones</h4>
                        <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 space-y-5">
                          {trackingRoute.map((stop, idx) => (
                            <div key={idx} className="relative">
                              {/* Node indicator */}
                              <div className={`absolute -left-[30px] top-0.5 h-4 w-4 rounded-full border-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-center ${
                                idx === activeMarkerIndex 
                                  ? 'border-amber-500 text-amber-500 scale-110' 
                                  : idx < activeMarkerIndex
                                  ? 'border-blue-500 text-blue-500'
                                  : 'border-slate-300 text-slate-400'
                              }`}>
                                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                              </div>
                              
                              <div>
                                <h5 className={`text-xs font-bold uppercase ${idx === activeMarkerIndex ? 'text-amber-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {stop.name}
                                </h5>
                                <p className="text-[10px] text-slate-400">
                                  {idx === activeMarkerIndex 
                                    ? "Chauffeur currently passing this checkpoint." 
                                    : idx < activeMarkerIndex 
                                    ? "Checkpoint cleared."
                                    : "Estimated checkpoint transit."}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Map className="mx-auto text-slate-300 mb-4" size={40} />
                      <p className="text-sm">Please select a trip from your history to track.</p>
                      <button 
                        onClick={() => setActiveTab('trips')} 
                        className="bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg mt-4 shadow"
                      >
                        View Trip History
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-900 shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display font-bold uppercase tracking-widest text-sm text-slate-900 dark:text-white">
                      Profile Information
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-1 text-xs text-amber-500 hover:underline"
                    >
                      {isEditing ? (
                        <>
                          <Save size={12} />
                          <span>Cancel Edit</span>
                        </>
                      ) : (
                        <>
                          <Edit size={12} />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </button>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-amber-500 disabled:opacity-60"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Phone Number</label>
                        <input
                          type="tel"
                          disabled={!isEditing}
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-amber-500 disabled:opacity-60"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                        <input
                          type="email"
                          disabled // Always lock email as authentication primary key
                          value={profileData.email}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none opacity-60"
                        />
                      </div>

                    </div>

                    {isEditing && (
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow"
                      >
                        Save Profiles
                      </button>
                    )}
                  </form>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
export default CustomerDashboard;
