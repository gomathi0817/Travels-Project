import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockDB } from '../services/mockDB';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Car, Users, CalendarCheck, Settings, ShieldAlert, Wrench, 
  MapPin, Plus, Trash2, Edit2, CheckCircle2, XCircle, Navigation, TrendingUp, DollarSign,
  Download, RefreshCw, Layers, Award, FileText, IndianRupee
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sidebar Tab state
  const [activeTab, setActiveTab] = useState('overview'); // overview, bookings, vehicles, drivers, expenses, pricing, analytics, tracking

  // Database States
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [pricing, setPricing] = useState(null);

  // Stats States
  const [stats, setStats] = useState({});

  // CRUD Form States
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({
    brand: '', model: '', name: '', type: 'CAR', seats: 4, price_per_km: 18, 
    ac: true, fuel_type: 'Diesel', mileage: '12 km/l', insurance: 'Active', 
    fitness: 'Certified', rc: '', vehicle_number: '', status: 'Available', image: ''
  });

  const [showDriverModal, setShowDriverModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [driverForm, setDriverForm] = useState({
    name: '', phone: '', license: '', experience: '', languages: 'Tamil, English', 
    rating: 5.0, assigned_vehicle: '', trip_status: 'Available', availability: 'Available', photo: ''
  });

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    vehicle_number: '', type: 'Oil Change', amount: 0, date: '', notes: ''
  });

  // Assign Driver/Vehicle Drawer State
  const [assigningBooking, setAssigningBooking] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState({
    vehicle_id: '',
    driver_id: ''
  });

  // Tracking Simulation state
  const [selectedRunningTrip, setSelectedRunningTrip] = useState(null);
  const [trackingTimer, setTrackingTimer] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/login');
      toast.error("Access Denied: Administrative privileges required.");
      return;
    }
    loadAllData();
  }, [user]);

  const loadAllData = () => {
    const listB = mockDB.getBookings();
    const listV = mockDB.getVehicles();
    const listD = mockDB.getDrivers();
    const listE = mockDB.getExpenses();
    const currentPricing = mockDB.getPricing();

    setBookings(listB);
    setVehicles(listV);
    setDrivers(listD);
    setExpenses(listE);
    setPricing(currentPricing);

    // Calculate Admin stats dynamically
    const confirmed = listB.filter(b => b.status === 'Confirmed');
    const pending = listB.filter(b => b.status === 'Pending');
    const completed = listB.filter(b => b.status === 'Completed');
    const cancelled = listB.filter(b => b.status === 'Cancelled');

    // Revenue calculations
    const revTotal = listB.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.grand_total : sum, 0);
    const revToday = listB.reduce((sum, b) => b.travel_date === new Date().toISOString().split('T')[0] && b.status !== 'Cancelled' ? sum + b.grand_total : sum, 0);

    setStats({
      todayBookings: listB.filter(b => b.travel_date === new Date().toISOString().split('T')[0]).length,
      monthlyBookings: listB.length, // simulated count
      totalVehicles: listV.length,
      runningVehicles: listV.filter(v => v.status === 'Booked').length,
      availableVehicles: listV.filter(v => v.status === 'Available').length,
      availableDrivers: listD.filter(d => d.availability === 'Available').length,
      driversOnTrip: listD.filter(d => d.availability === 'On Trip').length,
      revenueToday: revToday || 12500, // fallback sample
      revenueMonth: revTotal || 148900,
      totalCustomers: [...new Set(listB.map(b => b.email))].length || 10,
      cancelledTrips: cancelled.length,
      completedTrips: completed.length,
      pendingBookings: pending.length
    });

    // Auto-select a running trip for map visual
    const running = listB.find(b => b.status === 'Confirmed' || b.status === 'Pending');
    if (running) {
      setSelectedRunningTrip(running);
    }
  };

  // Pricing Changes Update
  const handlePricingUpdate = (category, seatsKey, rateValue) => {
    const updated = { ...pricing };
    updated[category][seatsKey] = parseFloat(rateValue);
    mockDB.savePricing(updated);
    setPricing(updated);
    toast.success(`Pricing updated for ${category} (${seatsKey}) to ₹${rateValue}/km`);
  };

  const handleAdditionalChargeUpdate = (key, value) => {
    const updated = { ...pricing };
    updated.additional[key] = parseFloat(value);
    mockDB.savePricing(updated);
    setPricing(updated);
    toast.success(`Charge updated for ${key} to ₹${value}`);
  };

  // CRUD: Vehicles
  const openVehicleModal = (veh = null) => {
    if (veh) {
      setEditingVehicle(veh);
      setVehicleForm({ ...veh });
    } else {
      setEditingVehicle(null);
      setVehicleForm({
        brand: '', model: '', name: '', type: 'CAR', seats: 4, price_per_km: 18, 
        ac: true, fuel_type: 'Diesel', mileage: '12 km/l', insurance: 'Active', 
        fitness: 'Certified', rc: '', vehicle_number: '', status: 'Available', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
      });
    }
    setShowVehicleModal(true);
  };

  const saveVehicle = (e) => {
    e.preventDefault();
    mockDB.saveVehicle(vehicleForm);
    toast.success(editingVehicle ? "Vehicle configuration modified." : "New vehicle added to fleet.");
    setShowVehicleModal(false);
    loadAllData();
  };

  const deleteVehicle = (id) => {
    if (window.confirm("Are you sure you want to retire this vehicle?")) {
      mockDB.deleteVehicle(id);
      toast.success("Vehicle deleted from registry.");
      loadAllData();
    }
  };

  // CRUD: Drivers
  const openDriverModal = (drv = null) => {
    if (drv) {
      setEditingDriver(drv);
      setDriverForm({ ...drv });
    } else {
      setEditingDriver(null);
      setDriverForm({
        name: '', phone: '', license: '', experience: '', languages: 'Tamil, English', 
        rating: 4.8, assigned_vehicle: '', trip_status: 'Available', availability: 'Available',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      });
    }
    setShowDriverModal(true);
  };

  const saveDriver = (e) => {
    e.preventDefault();
    mockDB.saveDriver(driverForm);
    toast.success(editingDriver ? "Driver details updated." : "New driver roster registered.");
    setShowDriverModal(false);
    loadAllData();
  };

  const deleteDriver = (id) => {
    if (window.confirm("Remove driver from active records?")) {
      mockDB.deleteDriver(id);
      toast.success("Driver removed from roster.");
      loadAllData();
    }
  };

  // CRUD: Expenses
  const saveExpense = (e) => {
    e.preventDefault();
    mockDB.addExpense({
      ...expenseForm,
      amount: parseFloat(expenseForm.amount)
    });
    toast.success("Maintenance expense logged successfully.");
    setShowExpenseModal(false);
    loadAllData();
  };

  // Booking management triggers
  const handleBookingAccept = (booking) => {
    // Populate dropdown selector defaults
    const firstVeh = vehicles.find(v => v.status === 'Available' && v.type === booking.vehicle_type) || { id: '' };
    const firstDrv = drivers.find(d => d.availability === 'Available') || { id: '' };

    setAssigningBooking(booking);
    setAssignmentDetails({
      vehicle_id: firstVeh.id || '',
      driver_id: firstDrv.id || ''
    });
  };

  const confirmAssignment = () => {
    if (!assignmentDetails.vehicle_id || !assignmentDetails.driver_id) {
      toast.error("Please assign both a vehicle and driver to confirm trip.");
      return;
    }

    const assignedVeh = vehicles.find(v => v.id === assignmentDetails.vehicle_id);
    const assignedDrv = drivers.find(d => d.id === assignmentDetails.driver_id);

    // Update booking model
    const updated = {
      ...assigningBooking,
      status: 'Confirmed',
      vehicle_model: assignedVeh.name,
      vehicle_number: assignedVeh.vehicle_number,
      driver_name: assignedDrv.name,
      driver_phone: assignedDrv.phone
    };
    mockDB.saveBooking(updated);

    // Modify vehicle state to Booked
    assignedVeh.status = 'Booked';
    mockDB.saveVehicle(assignedVeh);

    // Modify driver state to On Trip
    assignedDrv.availability = 'On Trip';
    assignedDrv.assigned_vehicle = assignedVeh.vehicle_number;
    mockDB.saveDriver(assignedDrv);

    toast.success(`Booking ${assigningBooking.id} accepted. Driver and Vehicle dispatched!`);
    setAssigningBooking(null);
    loadAllData();
  };

  const handleBookingReject = (id) => {
    if (window.confirm("Reject this customer reservation?")) {
      const book = bookings.find(b => b.id === id);
      book.status = 'Cancelled';
      mockDB.saveBooking(book);
      toast.success("Reservation status updated to Cancelled.");
      loadAllData();
    }
  };

  const handleCompleteTrip = (booking) => {
    const book = bookings.find(b => b.id === booking.id);
    book.status = 'Completed';
    book.payment_status = 'Paid';
    book.pending_amount = 0;
    mockDB.saveBooking(book);

    // Release vehicle
    const v = vehicles.find(veh => veh.vehicle_number === booking.vehicle_number);
    if (v) {
      v.status = 'Available';
      mockDB.saveVehicle(v);
    }

    // Release driver
    const d = drivers.find(drv => drv.assigned_vehicle === booking.vehicle_number);
    if (d) {
      d.availability = 'Available';
      d.assigned_vehicle = '';
      mockDB.saveDriver(d);
    }

    toast.success("Trip completed. Chauffeur and vehicle returned to active garage roster.");
    loadAllData();
  };

  // Recharts Data Mappings
  const revenueChartData = [
    { name: 'Jan', Revenue: 45000, Expenses: 18000 },
    { name: 'Feb', Revenue: 62000, Expenses: 22000 },
    { name: 'Mar', Revenue: 85000, Expenses: 31000 },
    { name: 'Apr', Revenue: 78000, Expenses: 25000 },
    { name: 'May', Revenue: 98000, Expenses: 42000 },
    { name: 'Jun', Revenue: 120000, Expenses: 53000 },
    { name: 'Jul', Revenue: stats.revenueMonth || 148900, Expenses: expenses.reduce((s, e) => s + e.amount, 0) }
  ];

  const vehicleUsageData = [
    { name: 'Cars', value: vehicles.filter(v => v.type === 'CAR').length },
    { name: 'Coaches', value: vehicles.filter(v => v.type === 'COACH').length },
    { name: 'Buses', value: vehicles.filter(v => v.type === 'BUS').length }
  ];
  
  const COLORS = ['#1E40AF', '#F59E0B', '#10B981', '#EF4444'];

  return (
    <div className="pt-20 min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-5 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
            <div className="h-9 w-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-950">A</div>
            <div>
              <h2 className="font-display text-sm font-extrabold tracking-wider">ADMIN PORTAL</h2>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Dheeran Travels</p>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
              { id: 'bookings', label: 'Bookings Menu', icon: <CalendarCheck size={14} /> },
              { id: 'vehicles', label: 'Fleet Register', icon: <Car size={14} /> },
              { id: 'drivers', label: 'Driver Roster', icon: <Users size={14} /> },
              { id: 'expenses', label: 'Expenses Logger', icon: <Wrench size={14} /> },
              { id: 'pricing', label: 'Fare Rates Panel', icon: <IndianRupee size={14} /> },
              { id: 'analytics', label: 'Analytics Panel', icon: <TrendingUp size={14} /> },
              { id: 'tracking', label: 'Live Dispatch map', icon: <Navigation size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2.5 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
            Logged: <strong className="text-white">{user?.name || 'Admin'}</strong>
            <br />Role: Admin Manager
          </div>
        </div>
      </div>

      {/* Main Workspace content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar">
        
        {/* OVERVIEW STATS TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="font-display text-2xl font-extrabold uppercase tracking-widest">
                Operational Overview
              </h1>
              <p className="text-xs text-slate-400 mt-1">Real-time statistics monitoring for Dheeran Tours & Travels.</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Today's Bookings", val: stats.todayBookings, icon: <CalendarCheck size={18} />, color: "text-amber-500" },
                { label: "Pending Bookings", val: stats.pendingBookings, icon: <ShieldAlert size={18} />, color: "text-amber-500" },
                { label: "Completed Trips", val: stats.completedTrips, icon: <CheckCircle2 size={18} />, color: "text-emerald-500" },
                { label: "Cancelled Bookings", val: stats.cancelledTrips, icon: <XCircle size={18} />, color: "text-red-500" },
                { label: "Active Dispatch", val: stats.runningVehicles, icon: <Navigation size={18} className="animate-pulse" />, color: "text-blue-500" },
                { label: "Fleet Available", val: stats.availableVehicles, icon: <Car size={18} />, color: "text-emerald-500" },
                { label: "Driver Pool Ready", val: stats.availableDrivers, icon: <Users size={18} />, color: "text-slate-400" },
                { label: "Revenue This Month", val: `₹${stats.revenueMonth}`, icon: <DollarSign size={18} />, color: "text-emerald-500" }
              ].map((stat, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
                    <p className="text-xl font-extrabold mt-1 font-display">{stat.val}</p>
                  </div>
                  <div className={`p-2.5 bg-slate-100 dark:bg-slate-900/60 rounded-xl ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Live running vehicles and Analytics chart mini */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart overview */}
              <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold uppercase tracking-widest text-xs">Revenue vs Maintenance (7 Mo)</h3>
                  <TrendingUp size={14} className="text-amber-500" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={10} />
                      <YAxis stroke="#888888" fontSize={10} />
                      <Tooltip />
                      <Area type="monotone" dataKey="Revenue" stroke="#1E40AF" fillOpacity={1} fill="url(#colorRev)" />
                      <Line type="monotone" dataKey="Expenses" stroke="#F59E0B" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick actions box */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-display font-bold uppercase tracking-widest text-xs">Quick Dispatch Shortcuts</h3>
                  <p className="text-xs text-slate-400">Manage common admin events with a single click.</p>
                </div>
                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => {
                      const pending = bookings.find(b => b.status === 'Pending');
                      if (pending) {
                        handleBookingAccept(pending);
                      } else {
                        toast.error("No pending bookings found.");
                      }
                    }}
                    className="w-full text-left bg-slate-900 dark:bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-between text-white"
                  >
                    <span>Process Pending Booking</span>
                    <Plus size={12} />
                  </button>
                  
                  <button
                    onClick={() => {
                      setExpenseForm({ vehicle_number: 'TN 38 AH 9909', type: 'Oil Change', amount: 8000, date: new Date().toISOString().split('T')[0], notes: 'Scheduled change' });
                      setShowExpenseModal(true);
                    }}
                    className="w-full text-left bg-slate-900 dark:bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-between text-white"
                  >
                    <span>Log Garage Maintenance</span>
                    <Wrench size={12} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* BOOKINGS MANAGEMENT TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-widest">Customer Bookings</h2>
                <p className="text-xs text-slate-400 mt-1">Accept, reject, and assign vehicles and drivers to client reservations.</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-900 shadow">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Booking ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Details</th>
                      <th className="pb-3">Route</th>
                      <th className="pb-3">Driver / Veh</th>
                      <th className="pb-3">Fare Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-950/20">
                        <td className="py-4 font-mono font-bold">{booking.id}</td>
                        <td className="py-4">
                          <p className="font-bold">{booking.customer_name}</p>
                          <p className="text-[10px] text-slate-400">{booking.phone}</p>
                        </td>
                        <td className="py-4">
                          <p className="font-semibold">{booking.seats} Seater {booking.vehicle_type}</p>
                          <p className="text-[10px] text-slate-400">Date: {booking.travel_date}</p>
                        </td>
                        <td className="py-4 text-slate-500">
                          {booking.pickup} → {booking.destination}
                        </td>
                        <td className="py-4">
                          {booking.status === 'Confirmed' || booking.status === 'Completed' ? (
                            <div>
                              <p className="font-semibold">{booking.driver_name || 'Driver assigned'}</p>
                              <p className="text-[10px] text-amber-500 font-bold">{booking.vehicle_number || 'Veh details'}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4 font-bold">₹{booking.grand_total}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                            booking.status === 'Confirmed' 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                              : booking.status === 'Completed'
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                              : booking.status === 'Cancelled'
                              ? 'bg-red-500/10 border-red-500/30 text-red-500'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                          }`}>
                            <span>{booking.status}</span>
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          {booking.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleBookingAccept(booking)}
                                className="px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow"
                              >
                                Accept & Dispatch
                              </button>
                              <button
                                onClick={() => handleBookingReject(booking.id)}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-bold uppercase tracking-wider rounded-lg"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {booking.status === 'Confirmed' && (
                            <button
                              onClick={() => handleCompleteTrip(booking)}
                              className="px-3 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow"
                            >
                              Complete Trip
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FLEET REGISTER VEHICLE MANAGEMENT TAB */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-widest">Fleet Registry</h2>
                <p className="text-xs text-slate-400 mt-1">Add, edit, or retire vehicles from your booking fleet directory.</p>
              </div>
              <button
                onClick={() => openVehicleModal()}
                className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow"
              >
                <Plus size={14} />
                <span>Add Vehicle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vehicles.map((veh) => (
                <div key={veh.id} className="glass-panel rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow flex flex-col justify-between">
                  <div className="relative h-40 bg-slate-950">
                    <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-slate-950/80 border border-amber-500/20 text-amber-500 font-bold uppercase tracking-widest text-[9px] px-2.5 py-0.5 rounded-full">
                      {veh.type}
                    </span>
                    <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      veh.status === 'Available' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    }`}>
                      {veh.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{veh.brand}</p>
                      <h4 className="font-display font-bold text-sm">{veh.model}</h4>
                      <p className="text-[10px] text-amber-500 font-mono mt-0.5">{veh.vehicle_number}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div>Seats: <strong className="text-slate-700 dark:text-slate-300">{veh.seats} Seater</strong></div>
                      <div>Rate: <strong className="text-slate-700 dark:text-slate-300">₹{veh.price_per_km}/km</strong></div>
                      <div>Fuel: <strong className="text-slate-700 dark:text-slate-300">{veh.fuel_type}</strong></div>
                      <div>RC Code: <strong className="text-slate-700 dark:text-slate-300 font-mono">{veh.rc.split("-")[1] || veh.rc}</strong></div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800/60 p-4">
                    <button
                      onClick={() => openVehicleModal(veh)}
                      className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-amber-500 transition-colors"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => deleteVehicle(veh.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DRIVERS MANAGEMENT ROSTER TAB */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-widest">Driver Directory</h2>
                <p className="text-xs text-slate-400 mt-1">Manage profile records, languages, experience, and trip statuses of your chauffeurs.</p>
              </div>
              <button
                onClick={() => openDriverModal()}
                className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow"
              >
                <Plus size={14} />
                <span>Add Chauffeur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {drivers.map((drv) => (
                <div key={drv.id} className="glass-panel rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow flex flex-col justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={drv.photo} alt={drv.name} className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                    <div>
                      <h4 className="font-display font-bold text-sm">{drv.name}</h4>
                      <p className="text-[10px] text-slate-400">{drv.phone}</p>
                      <p className="text-[9px] text-amber-500 uppercase tracking-widest font-bold mt-0.5">Exp: {drv.experience}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-[10px] text-slate-400">
                    <p>License: <strong className="text-slate-700 dark:text-slate-300 font-mono">{drv.license}</strong></p>
                    <p>Languages: <strong className="text-slate-700 dark:text-slate-300">{drv.languages.join ? drv.languages.join(", ") : drv.languages}</strong></p>
                    <p>Assigned Veh: <strong className="text-amber-500 font-mono">{drv.assigned_vehicle || "None"}</strong></p>
                    <p>Roster Status: <span className={`font-bold ${drv.availability === 'Available' ? 'text-emerald-500' : 'text-amber-500'}`}>{drv.availability}</span></p>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => openDriverModal(drv)}
                      className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-amber-500 transition-colors"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => deleteDriver(drv.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPENSES LOGGER TAB */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-widest">Maintenance & Expenses</h2>
                <p className="text-xs text-slate-400 mt-1">Monitor operational expenses including oil changes, tires, fuel bills, and salaries.</p>
              </div>
              <button
                onClick={() => {
                  setExpenseForm({ vehicle_number: '', type: 'Oil Change', amount: 0, date: new Date().toISOString().split('T')[0], notes: '' });
                  setShowExpenseModal(true);
                }}
                className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow"
              >
                <Plus size={14} />
                <span>Log Maintenance</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Expense Table list */}
              <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow">
                <h3 className="font-display font-bold uppercase tracking-widest text-xs mb-4">Recent Ledger Entries</h3>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                        <th className="pb-2">Vehicle</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {expenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-100/30">
                          <td className="py-3 font-mono font-semibold">{exp.vehicle_number}</td>
                          <td className="py-3 font-bold">{exp.type}</td>
                          <td className="py-3 text-slate-400">{exp.date}</td>
                          <td className="py-3 font-extrabold text-red-500">₹{exp.amount}</td>
                          <td className="py-3 text-slate-500 truncate max-w-[120px]">{exp.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recharts Pie category chart */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow flex flex-col justify-between">
                <h3 className="font-display font-bold uppercase tracking-widest text-xs mb-4 text-center">Expense Category Ratios</h3>
                <div className="h-56 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{name: 'Oil', value: 8500}, {name: 'Tyre', value: 45000}, {name: 'Fuel', value: 12500}, {name: 'Salary', value: 25000}]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {COLORS.map((color, i) => <Cell key={`cell-${i}`} fill={color} />)}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FARES/PRICING EDIT PANEL TAB */}
        {activeTab === 'pricing' && pricing && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-widest">Base Rate Configurations</h2>
              <p className="text-xs text-slate-400 mt-1">Configure base per-kilometer rental pricing and supplementary surcharges.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Category grids - Left Col (Span 2) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* CAR */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-amber-500 mb-4 flex items-center space-x-2">
                    <Car size={14} />
                    <span>Premium Cars Rate</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.keys(pricing.CAR).map((key) => (
                      <div key={key}>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">₹</span>
                          <input
                            type="number"
                            value={pricing.CAR[key]}
                            onChange={(e) => handlePricingUpdate('CAR', key, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-6 pr-2 text-xs focus:outline-none focus:border-amber-500 text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COACH */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-amber-500 mb-4 flex items-center space-x-2">
                    <Layers size={14} />
                    <span>Executive Coach Rates</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(pricing.COACH).map((key) => (
                      <div key={key}>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">₹</span>
                          <input
                            type="number"
                            value={pricing.COACH[key]}
                            onChange={(e) => handlePricingUpdate('COACH', key, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-6 pr-2 text-xs focus:outline-none focus:border-amber-500 text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BUS */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-amber-500 mb-4 flex items-center space-x-2">
                    <Award size={14} />
                    <span>Touring Buses Rates</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(pricing.BUS).map((key) => (
                      <div key={key}>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">₹</span>
                          <input
                            type="number"
                            value={pricing.BUS[key]}
                            onChange={(e) => handlePricingUpdate('BUS', key, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-6 pr-2 text-xs focus:outline-none focus:border-amber-500 text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Supplementary Surcharges - Right Col */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow space-y-4">
                <h3 className="font-display font-bold uppercase tracking-widest text-xs">Supplementary Charges</h3>
                <p className="text-xs text-slate-400 mb-2">Configure driver allowances, night halts, permits, and tax metrics.</p>
                
                {Object.keys(pricing.additional).map((key) => (
                  <div key={key} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-xs font-semibold capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-2 text-xs text-slate-400">
                        {key === 'gst' ? '%' : '₹'}
                      </span>
                      <input
                        type="number"
                        value={pricing.additional[key]}
                        onChange={(e) => handleAdditionalChargeUpdate(key, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-6 pr-2 text-xs text-right focus:outline-none focus:border-amber-500 text-white font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ANALYTICS REPORT TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-widest">Analytics Dashboard</h2>
              <p className="text-xs text-slate-400 mt-1">Deep analysis of operational metrics, revenues, profit ratios, and trip breakdowns.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Monthly Revenue Chart */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow">
                <h3 className="font-display font-bold uppercase tracking-widest text-xs mb-4">Revenue Trend (2026)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={10} />
                      <YAxis stroke="#888888" fontSize={10} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Revenue" stroke="#1E40AF" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Vehicle Distribution Chart */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow">
                <h3 className="font-display font-bold uppercase tracking-widest text-xs mb-4">Vehicle Category Split</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={10} />
                      <YAxis stroke="#888888" fontSize={10} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Revenue" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Expenses" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* LIVE DISPATCH TRACKING MAP TAB */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-widest">Active Dispatch Map</h2>
              <p className="text-xs text-slate-400 mt-1">Live simulated GPS tracking of currently dispatched vehicles across the region.</p>
            </div>

            {selectedRunningTrip ? (
              <div className="space-y-6">
                
                {/* Active Route Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Active Fleet Route Stops</span>
                    <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                      <span className="text-amber-500">{selectedRunningTrip.pickup}</span>
                      <span className="text-slate-400 font-light">➜</span>
                      <span className="text-amber-500">{selectedRunningTrip.destination}</span>
                    </h4>
                  </div>
                  <div className="mt-2 sm:mt-0 text-left sm:text-right">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Active Customer Dispatch</span>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">{selectedRunningTrip.customer_name} ({selectedRunningTrip.phone})</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Simulated Map Container */}
                  <div className="lg:col-span-2 relative h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-950 opacity-90" style={{
                      backgroundImage: `radial-gradient(rgba(245,158,11,0.06) 1px, transparent 0), radial-gradient(rgba(30,64,175,0.06) 1px, transparent 0)`,
                      backgroundSize: '24px 24px',
                      backgroundPosition: '0 0, 12px 12px'
                    }} />

                    <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-amber-500/20 via-blue-500 to-amber-500/20 z-0" />
                    
                    {/* Stops */}
                    {[
                      { name: selectedRunningTrip.pickup || "Pickup", lat: 11.0168 },
                      { name: "Avinashi Bypass Stop", lat: 11.1931 },
                      { name: "Perundurai Toll", lat: 11.2774 },
                      { name: "Erode Midway", lat: 11.3410 },
                      { name: selectedRunningTrip.destination || "Dropoff", lat: 11.6643 }
                    ].map((stop, idx) => (
                      <div 
                        key={idx}
                        style={{
                          left: `${15 + (idx * 17.5)}%`,
                          top: idx % 2 === 0 ? '45%' : '55%'
                        }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                      >
                        <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 ${idx === 2 ? 'bg-amber-500 border-white scale-125 shadow-[0_0_15px_#F59E0B]' : 'bg-blue-500 border-slate-950'}`}>
                          {idx === 2 && <div className="h-2 w-2 bg-slate-950 rounded-full animate-ping" />}
                        </div>
                        <span className="text-[8px] uppercase tracking-wider font-bold mt-1.5 text-slate-400 text-center truncate max-w-[60px]">
                          {stop.name}
                        </span>
                      </div>
                    ))}

                    <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-amber-500/20 px-4 py-2.5 rounded-xl backdrop-blur max-w-xs text-white z-20">
                      <p className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Simulated GPS Live Feed</p>
                      <p className="text-xs font-bold text-amber-500 mt-0.5">{selectedRunningTrip.vehicle_number || "TN 38 AH 9909"} ({selectedRunningTrip.vehicle_model})</p>
                      <p className="text-[9px] text-slate-300 mt-1">Route stop: {selectedRunningTrip.pickup} bypass stop</p>
                    </div>
                  </div>

                  {/* Route logs list */}
                  <div className="glass-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow">
                    <h3 className="font-display font-bold uppercase tracking-widest text-xs mb-4">Active Dispatches</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                      {bookings
                        .filter(b => b.status === 'Confirmed' || b.status === 'Pending')
                        .map(b => (
                          <div 
                            key={b.id} 
                            onClick={() => setSelectedRunningTrip(b)}
                            className={`p-3 border rounded-xl cursor-pointer transition-all ${
                              selectedRunningTrip?.id === b.id 
                                ? 'bg-amber-500/10 border-amber-500' 
                                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-amber-500">{b.id}</span>
                              <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                                {b.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">Veh: {b.vehicle_model} ({b.vehicle_number || "TN 38 AH 9909"})</p>
                            <p className="text-[10px] text-slate-400">Driver: {b.driver_name || 'Karthikeyan Ramasamy'}</p>
                            <p className="text-[9px] text-slate-300 mt-2 font-semibold">Route: {b.pickup} → {b.destination}</p>
                          </div>
                        ))}
                      {bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-4 font-light">No active dispatches found.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">No active runs currently tracked.</div>
            )}
          </div>
        )}

      </div>

      {/* ASSIGN VEHICLE/DRIVER DRAWER MODAL */}
      <AnimatePresence>
        {assigningBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-slate-900 dark:text-white">
                  Trip Dispatch Assignment
                </h3>
                <button onClick={() => setAssigningBooking(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <XCircle size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p>Booking ID: <strong className="font-mono">{assigningBooking.id}</strong></p>
                  <p>Customer: <strong>{assigningBooking.customer_name}</strong></p>
                  <p>Vehicle Type requested: <strong>{assigningBooking.seats} Seater {assigningBooking.vehicle_type}</strong></p>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assign Available Vehicle *</label>
                  <select
                    value={assignmentDetails.vehicle_id}
                    onChange={(e) => setAssignmentDetails({ ...assignmentDetails, vehicle_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select vehicle...</option>
                    {vehicles
                      .filter(v => v.status === 'Available' && v.type === assigningBooking.vehicle_type && v.seats >= assigningBooking.seats)
                      .map(v => (
                        <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.vehicle_number})</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assign Available Chauffeur *</label>
                  <select
                    value={assignmentDetails.driver_id}
                    onChange={(e) => setAssignmentDetails({ ...assignmentDetails, driver_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select driver...</option>
                    {drivers
                      .filter(d => d.availability === 'Available')
                      .map(d => (
                        <option key={d.id} value={d.id}>{d.name} (Exp: {d.experience})</option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={confirmAssignment}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg mt-2 cursor-pointer"
                >
                  Confirm & Dispatch Trip
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CRUD MODAL: ADD/EDIT VEHICLE */}
      <AnimatePresence>
        {showVehicleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-lg w-full border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-widest">
                  {editingVehicle ? "Edit Vehicle Details" : "Register New Fleet Vehicle"}
                </h3>
                <button onClick={() => setShowVehicleModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <XCircle size={18} />
                </button>
              </div>

              <form onSubmit={saveVehicle} className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Brand Name *</label>
                  <input
                    type="text" required value={vehicleForm.brand}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Model Name *</label>
                  <input
                    type="text" required value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value, name: `${vehicleForm.brand} ${e.target.value}` })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Vehicle Type *</label>
                  <select
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="CAR">CAR</option>
                    <option value="COACH">COACH</option>
                    <option value="BUS">BUS</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Seats Count *</label>
                  <input
                    type="number" required value={vehicleForm.seats}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, seats: parseInt(e.target.value, 10) })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Vehicle Number *</label>
                  <input
                    type="text" placeholder="e.g. TN 38 AH 9909" required value={vehicleForm.vehicle_number}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_number: e.target.value })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">RC Code *</label>
                  <input
                    type="text" placeholder="RC-TN38-A-9909" required value={vehicleForm.rc}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, rc: e.target.value })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Price Rate per KM *</label>
                  <input
                    type="number" required value={vehicleForm.price_per_km}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, price_per_km: parseFloat(e.target.value) })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Image URL</label>
                  <input
                    type="url" value={vehicleForm.image}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, image: e.target.value })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg"
                  >
                    Save Vehicle to Fleet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CRUD MODAL: ADD/EDIT DRIVER */}
      <AnimatePresence>
        {showDriverModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-widest">
                  {editingDriver ? "Edit Chauffeur Profile" : "Register New Chauffeur"}
                </h3>
                <button onClick={() => setShowDriverModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <XCircle size={18} />
                </button>
              </div>

              <form onSubmit={saveDriver} className="space-y-4 text-xs">
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Chauffeur Name *</label>
                  <input
                    type="text" required value={driverForm.name}
                    onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Phone Number *</label>
                    <input
                      type="tel" required value={driverForm.phone}
                      onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                      className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">License Code *</label>
                    <input
                      type="text" required value={driverForm.license}
                      onChange={(e) => setDriverForm({ ...driverForm, license: e.target.value })}
                      className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Experience Years *</label>
                    <input
                      type="text" placeholder="e.g. 10 Years" required value={driverForm.experience}
                      onChange={(e) => setDriverForm({ ...driverForm, experience: e.target.value })}
                      className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Rating *</label>
                    <input
                      type="number" step="0.1" required value={driverForm.rating}
                      onChange={(e) => setDriverForm({ ...driverForm, rating: parseFloat(e.target.value) })}
                      className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Languages Known *</label>
                  <input
                    type="text" placeholder="Tamil, English, Hindi" required value={driverForm.languages}
                    onChange={(e) => setDriverForm({ ...driverForm, languages: e.target.value })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg"
                >
                  Save Chauffeur Details
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: LOG MAINTENANCE EXPENSE */}
      <AnimatePresence>
        {showExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-widest">
                  Log Maintenance Ledger
                </h3>
                <button onClick={() => setShowExpenseModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <XCircle size={18} />
                </button>
              </div>

              <form onSubmit={saveExpense} className="space-y-4 text-xs">
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Target Vehicle Number *</label>
                  <select
                    required value={expenseForm.vehicle_number}
                    onChange={(e) => setExpenseForm({ ...expenseForm, vehicle_number: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select vehicle registration...</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.vehicle_number}>{v.brand} {v.model} ({v.vehicle_number})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Expense Type *</label>
                  <select
                    required value={expenseForm.type}
                    onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Oil Change">Oil Change</option>
                    <option value="Tyre Change">Tyre Change</option>
                    <option value="Battery">Battery</option>
                    <option value="Engine Repair">Engine Repair</option>
                    <option value="Brake Service">Brake Service</option>
                    <option value="Wheel Alignment">Wheel Alignment</option>
                    <option value="Insurance Renewal">Insurance Renewal</option>
                    <option value="FC Renewal">FC Renewal</option>
                    <option value="Permit Renewal">Permit Renewal</option>
                    <option value="Fuel Expense">Fuel Expense</option>
                    <option value="Driver Salary">Driver Salary</option>
                    <option value="Other Expenses">Other Expenses</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Expense Amount (INR) *</label>
                    <input
                      type="number" required value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Invoice Date *</label>
                    <input
                      type="date" required value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Expense Notes</label>
                  <textarea
                    rows="3" value={expenseForm.notes}
                    onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-amber-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg"
                >
                  Log Ledger Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default AdminDashboard;
