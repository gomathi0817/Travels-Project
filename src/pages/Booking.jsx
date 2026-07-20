import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockDB } from '../services/mockDB';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Car, CreditCard, Download, Printer, CheckCircle, Percent } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load Pricing Configuration
  const [pricingConfig, setPricingConfig] = useState(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [modelsList, setModelsList] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    members: 2,
    type: 'CAR',
    seats: '4 Seater',
    model: '',
    pickup: '',
    destination: '',
    travelDate: '',
    returnDate: '',
    startTime: '08:00',
    endTime: '18:00',
    tripType: 'One Way',
    totalKm: 100,
    notes: '',
    couponCode: '',
    paymentMethod: 'UPI'
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Sync state from search widgets or fleet page redirects
  useEffect(() => {
    const config = mockDB.getPricing();
    setPricingConfig(config);

    const vehicles = mockDB.getVehicles();
    setAvailableVehicles(vehicles);

    let updatedFormData = { ...formData };

    if (user) {
      updatedFormData.name = user.name;
      updatedFormData.phone = user.phone;
      updatedFormData.email = user.email;
    }

    if (location.state?.searchData) {
      const search = location.state.searchData;
      updatedFormData.pickup = search.pickup;
      updatedFormData.destination = search.destination;
      updatedFormData.travelDate = search.date;
      updatedFormData.type = search.type;
      
      // Select first seat option for that type
      if (search.type === 'CAR') updatedFormData.seats = '4 Seater';
      else if (search.type === 'COACH') updatedFormData.seats = '10 Seater';
      else if (search.type === 'BUS') updatedFormData.seats = '30 Seater';
    }

    if (location.state?.prefilledVehicle) {
      const p = location.state.prefilledVehicle;
      updatedFormData.type = p.type;
      updatedFormData.seats = `${p.seats} Seater`;
      updatedFormData.model = p.model;
    }

    setFormData(updatedFormData);
  }, [location.state, user]);

  // Filter vehicle models based on selected Type and Seats
  useEffect(() => {
    if (!availableVehicles.length) return;
    const filtered = availableVehicles.filter(
      v => v.type === formData.type && `${v.seats} Seater` === formData.seats
    );
    setModelsList(filtered);
    // Auto-select first model if not prefilled
    if (filtered.length > 0) {
      const hasModel = filtered.some(f => f.name === formData.model);
      if (!hasModel) {
        setFormData(prev => ({ ...prev, model: filtered[0].name }));
      }
    } else {
      setFormData(prev => ({ ...prev, model: `${formData.type} Custom Model` }));
    }
  }, [formData.type, formData.seats, availableVehicles]);

  // Calculate pricing breakdown
  const calculateFare = () => {
    if (!pricingConfig) return { basic: 0, allowance: 0, night: 0, toll: 0, permit: 0, gst: 0, total: 0, rate: 0 };

    const typeRates = pricingConfig[formData.type] || {};
    const rate = typeRates[formData.seats] || 18; // Default fallback

    const basic = formData.totalKm * rate;
    const isRound = formData.tripType === 'Round Trip';
    
    // Days calculation
    let days = 1;
    if (formData.returnDate && formData.travelDate) {
      const start = new Date(formData.travelDate);
      const end = new Date(formData.returnDate);
      const diffTime = Math.abs(end - start);
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    const add = pricingConfig.additional;
    const allowance = add.driverAllowance * days;
    const night = formData.returnDate ? add.nightCharge * (days - 1) : 0;
    const toll = add.toll;
    const permit = isRound ? add.permitCharge : 0;

    let subtotal = basic + allowance + night + toll + permit;

    // Apply Coupon
    if (formData.couponCode.toUpperCase() === 'DHEERAN10') {
      subtotal = subtotal * 0.9;
    } else if (formData.couponCode.toUpperCase() === 'WELCOME500') {
      subtotal = Math.max(0, subtotal - 500);
    }

    const gst = Math.round(subtotal * (add.gst / 100));
    const total = Math.round(subtotal + gst);

    return { basic, allowance, night, toll, permit, gst, total, rate };
  };

  const fareBreakdown = calculateFare();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.pickup || !formData.destination || !formData.travelDate) {
      toast.error("Please fill in all mandatory booking fields.");
      return;
    }

    const newBooking = {
      customer_name: formData.name,
      phone: formData.phone,
      email: formData.email,
      members: parseInt(formData.members, 10),
      vehicle_type: formData.type,
      vehicle_model: formData.model,
      seats: parseInt(formData.seats, 10),
      pickup: formData.pickup,
      destination: formData.destination,
      travel_date: formData.travelDate,
      return_date: formData.returnDate,
      start_time: formData.startTime,
      end_time: formData.endTime,
      trip_type: formData.tripType,
      total_km: parseInt(formData.totalKm, 10),
      notes: formData.notes,
      fare: fareBreakdown.basic,
      additional_charges: fareBreakdown.allowance + fareBreakdown.night + fareBreakdown.toll + fareBreakdown.permit,
      grand_total: fareBreakdown.total,
      payment_method: formData.paymentMethod,
      advance_paid: formData.paymentMethod === 'Cash' ? 0 : Math.round(fareBreakdown.total * 0.3), // 30% advance for online
      status: "Pending"
    };

    const saved = mockDB.saveBooking(newBooking);
    setBookingConfirmed(saved);
    toast.success("Booking confirmed! Invoice generated.");
  };

  // PDF Invoice Builder
  const handleDownloadPDF = (booking) => {
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
    doc.text(`Invoice ID: ${booking.invoice_id}`, 14, 76);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 82);
    doc.text(`Booking Status: ${booking.status}`, 14, 88);

    // Customer info
    doc.text(`Customer Name: ${booking.customer_name}`, 120, 70);
    doc.text(`Phone No: ${booking.phone}`, 120, 76);
    doc.text(`Email: ${booking.email}`, 120, 82);
    doc.text(`Trip Type: ${booking.trip_type}`, 120, 88);

    // Table mapping details
    const headers = [["Description", "Value / Details"]];
    const data = [
      ["Vehicle Details", `${booking.vehicle_model} (${booking.seats} Seater ${booking.vehicle_type})`],
      ["Route Details", `From: ${booking.pickup} -> To: ${booking.destination}`],
      ["Travel Date & Time", `${booking.travel_date} at ${booking.start_time} ${booking.return_date ? `(Return: ${booking.return_date})` : ''}`],
      ["Estimated Distance", `${booking.total_km} KM`],
      ["Basic Fare Charge", `Rs. ${booking.fare}`],
      ["Driver & Permit Charges", `Rs. ${booking.additional_charges}`],
      ["Grand Total Bill Amount", `Rs. ${booking.grand_total}`],
      ["Advance Paid", `Rs. ${booking.advance_paid}`],
      ["Pending Balance Amount", `Rs. ${booking.pending_amount}`]
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
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-24 min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {!bookingConfirmed ? (
          // Main Booking Form Screen
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Details - Left Col (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
                <h2 className="font-display text-xl font-extrabold uppercase tracking-widest mb-6">
                  Complete Your Booking
                </h2>
                
                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  
                  {/* Customer Info Group */}
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-amber-500 mb-4">1. Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Selector Group */}
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-amber-500 mb-4">2. Vehicle Choice</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Vehicle Type</label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={(e) => {
                            const newType = e.target.value;
                            let newSeats = '4 Seater';
                            if (newType === 'COACH') newSeats = '10 Seater';
                            if (newType === 'BUS') newSeats = '30 Seater';
                            setFormData({ ...formData, type: newType, seats: newSeats });
                          }}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500 dark:bg-slate-900"
                        >
                          <option value="CAR">Car (Premium Sedans/SUVs)</option>
                          <option value="COACH">Coach (Mini Vans/Luxury Travellers)</option>
                          <option value="BUS">Bus (Large Touring Sleeper/Buses)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Seating Capacity</label>
                        <select
                          name="seats"
                          value={formData.seats}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500 dark:bg-slate-900"
                        >
                          {formData.type === 'CAR' && (
                            <>
                              <option value="4 Seater">4 Seater (Luxury Sedan)</option>
                              <option value="6 Seater">6 Seater (MPV Innova)</option>
                              <option value="8 Seater">8 Seater (MUV Carnival)</option>
                            </>
                          )}
                          {formData.type === 'COACH' && (
                            <>
                              <option value="10 Seater">10 Seater</option>
                              <option value="14 Seater">14 Seater (Luxury Coach)</option>
                              <option value="20 Seater">20 Seater</option>
                              <option value="24 Seater">24 Seater</option>
                            </>
                          )}
                          {formData.type === 'BUS' && (
                            <>
                              <option value="30 Seater">30 Seater</option>
                              <option value="40 Seater">40 Seater (Sleeper coach)</option>
                              <option value="60 Seater">60 Seater</option>
                              <option value="120 Seater">120 Seater Double-Decker</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Preferred Model</label>
                        <select
                          name="model"
                          value={formData.model}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500 dark:bg-slate-900"
                        >
                          {modelsList.length > 0 ? (
                            modelsList.map(m => (
                              <option key={m.id} value={m.name}>{m.name}</option>
                            ))
                          ) : (
                            <option value="">No available models</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Route & Dates Group */}
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-amber-500 mb-4">3. Travel Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pickup Location *</label>
                        <input
                          type="text"
                          name="pickup"
                          value={formData.pickup}
                          onChange={handleInputChange}
                          placeholder="e.g. Coimbatore Airport"
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Destination Location *</label>
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          placeholder="e.g. Salem, Radisson Hotel"
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Travel Date *</label>
                        <input
                          type="date"
                          name="travelDate"
                          value={formData.travelDate}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Return Date (Optional)</label>
                        <input
                          type="date"
                          name="returnDate"
                          value={formData.returnDate}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Start Time</label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estimated Distance (KM)</label>
                        <input
                          type="number"
                          name="totalKm"
                          value={formData.totalKm}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Trip Schedule</label>
                        <select
                          name="tripType"
                          value={formData.tripType}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500 dark:bg-slate-900"
                        >
                          <option value="One Way">One Way Trip</option>
                          <option value="Round Trip">Round Trip Schedule</option>
                          <option value="Multi City">Multi City Trip</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Number of Members</label>
                        <input
                          type="number"
                          name="members"
                          value={formData.members}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Details Group */}
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-amber-500 mb-4">4. Payment Preference</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Select Payment Method</label>
                        <div className="flex space-x-2">
                          {['UPI', 'Credit Card', 'Cash'].map(method => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setFormData({ ...formData, paymentMethod: method })}
                              className={`flex-grow py-3 border text-xs font-bold uppercase rounded-xl transition-all ${
                                formData.paymentMethod === method
                                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-500'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Special Notes / Requests</label>
                        <input
                          type="text"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="e.g. Need Hindi speaking driver"
                          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gradient py-3.5 rounded-xl text-xs uppercase tracking-widest font-extrabold shadow-lg hover:shadow-xl transition-all mt-4"
                  >
                    Confirm Trip Booking
                  </button>

                </form>
              </div>
            </div>

            {/* Price Calculator Breakdown - Right Col */}
            <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg sticky top-24">
                <h3 className="font-display text-base font-extrabold uppercase tracking-widest border-b dark:border-slate-800 pb-3 mb-4">
                  Invoice Breakdown
                </h3>

                <div className="space-y-3.5 text-xs">
                  
                  {/* Selection summary */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                    <p className="font-bold text-slate-700 dark:text-slate-300 truncate">{formData.model || 'No model chosen'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{formData.seats} capacity rate: ₹{fareBreakdown.rate}/km</p>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Basic Mileage Fare ({formData.totalKm} km)</span>
                    <span className="font-semibold">₹{fareBreakdown.basic}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Driver Allowance (Daily)</span>
                    <span className="font-semibold">₹{fareBreakdown.allowance}</span>
                  </div>

                  {fareBreakdown.night > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Night Charge (Outstation)</span>
                      <span className="font-semibold">₹{fareBreakdown.night}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Toll & Parking</span>
                    <span className="font-semibold">₹{fareBreakdown.toll}</span>
                  </div>

                  {fareBreakdown.permit > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">State Permit Charges</span>
                      <span className="font-semibold">₹{fareBreakdown.permit}</span>
                    </div>
                  )}

                  {/* Coupon Area */}
                  <div className="pt-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Apply Coupon Code</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleInputChange}
                        placeholder="e.g. WELCOME500"
                        className="flex-grow bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs uppercase outline-none focus:border-amber-500"
                      />
                      {formData.couponCode && (
                        <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold p-1 px-2 rounded-lg flex items-center">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t dark:border-slate-800 pt-3 flex justify-between">
                    <span className="text-slate-400">GST Tax (18%)</span>
                    <span className="font-semibold">₹{fareBreakdown.gst}</span>
                  </div>

                  <div className="border-t dark:border-slate-800 pt-4 flex justify-between items-baseline">
                    <span className="font-display font-extrabold text-sm uppercase tracking-widest text-slate-900 dark:text-white">Grand Total</span>
                    <span className="text-xl font-extrabold text-amber-500">₹{fareBreakdown.total}</span>
                  </div>

                  {/* Payment Advance Indicator */}
                  {formData.paymentMethod !== 'Cash' && (
                    <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl space-y-1.5 mt-2">
                      <p className="font-bold text-[10px] text-amber-500 uppercase tracking-widest">Advance Deposit Required (30%)</p>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] text-slate-400">Pay Now:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">₹{Math.round(fareBreakdown.total * 0.3)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Balance (Pay Driver on Trip):</span>
                        <span>₹{fareBreakdown.total - Math.round(fareBreakdown.total * 0.3)}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        ) : (
          // Success Confirm / Invoice Preview Screen
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-3xl mx-auto glass-panel border border-amber-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="h-16 w-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle size={36} />
              </div>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
                Trip Booked Successfully!
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your booking ID is <strong className="text-amber-500 font-mono">{bookingConfirmed.id}</strong>. Chauffeur allocation details will be shared via email/SMS 12 hours before start time.
              </p>
            </div>

            {/* In-App Invoice Visual Card */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/20 space-y-4">
              <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3">
                <span className="font-mono text-xs text-slate-400">INVOICE: #{bookingConfirmed.invoice_id}</span>
                <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20">
                  {bookingConfirmed.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400">Pickup</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{bookingConfirmed.pickup}</p>
                </div>
                <div>
                  <p className="text-slate-400">Destination</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{bookingConfirmed.destination}</p>
                </div>
                <div>
                  <p className="text-slate-400">Vehicle Model</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{bookingConfirmed.vehicle_model} ({bookingConfirmed.seats} Seats)</p>
                </div>
                <div>
                  <p className="text-slate-400">Travel Date</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{bookingConfirmed.travel_date} at {bookingConfirmed.start_time}</p>
                </div>
              </div>

              <div className="border-t dark:border-slate-800 pt-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mileage Basic Fare</span>
                  <span>₹{bookingConfirmed.fare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver & State Permits</span>
                  <span>₹{bookingConfirmed.additional_charges}</span>
                </div>
                <div className="flex justify-between border-t dark:border-slate-800 pt-2 font-bold text-sm">
                  <span>Grand Total</span>
                  <span className="text-amber-500">₹{bookingConfirmed.grand_total}</span>
                </div>
                {bookingConfirmed.advance_paid > 0 && (
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Advance Deposit Paid ({bookingConfirmed.payment_method})</span>
                    <span className="text-emerald-500">-₹{bookingConfirmed.advance_paid}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold border-t border-dashed dark:border-slate-800 pt-2">
                  <span className="text-slate-400">Pending Amount (Cash)</span>
                  <span>₹{bookingConfirmed.pending_amount}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleDownloadPDF(bookingConfirmed)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl flex items-center space-x-2 shadow"
              >
                <Download size={14} />
                <span>Download PDF Invoice</span>
              </button>
              <button
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl flex items-center space-x-2 border border-slate-700"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-transparent border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl"
              >
                Go to Dashboard
              </button>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};
export default Booking;
