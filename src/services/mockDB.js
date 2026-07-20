// High-fidelity Local Storage Database Manager for Dheeran Tours and Travels
// Pre-populates the database with premium mock data if empty.

const DEFAULT_PRICING = {
  CAR: {
    "4 Seater": 18,
    "6 Seater": 22,
    "8 Seater": 26
  },
  COACH: {
    "10 Seater": 30,
    "14 Seater": 34,
    "20 Seater": 38,
    "24 Seater": 42
  },
  BUS: {
    "30 Seater": 48,
    "40 Seater": 55,
    "60 Seater": 68,
    "120 Seater": 90
  },
  additional: {
    driverAllowance: 500, // per day
    nightCharge: 300,      // per night
    toll: 450,             // estimated average
    parking: 200,          // estimated average
    permitCharge: 1200,    // state permit
    waitingCharge: 150,    // per hour
    gst: 18                // percentage
  }
};

const INITIAL_VEHICLES = [
  {
    id: "v-1",
    brand: "Mercedes-Benz",
    model: "S-Class S450",
    name: "Mercedes-Benz S-Class",
    type: "CAR",
    seats: 4,
    price_per_km: 18,
    ac: true,
    driver_included: true,
    fuel_type: "Petrol",
    mileage: "12 km/l",
    insurance: "Active (Exp: 15-Dec-2027)",
    fitness: "Certified",
    rc: "RC-TN38-A-9909",
    vehicle_number: "TN 38 AH 9909",
    status: "Available",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "v-2",
    brand: "BMW",
    model: "7 Series 740i",
    name: "BMW 7 Series",
    type: "CAR",
    seats: 4,
    price_per_km: 18,
    ac: true,
    driver_included: true,
    fuel_type: "Petrol",
    mileage: "10 km/l",
    insurance: "Active (Exp: 10-Jan-2028)",
    fitness: "Certified",
    rc: "RC-TN37-C-1212",
    vehicle_number: "TN 37 CB 1212",
    status: "Available",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "v-3",
    brand: "Toyota",
    model: "Innova Crysta 2.4V",
    name: "Toyota Innova Crysta",
    type: "CAR",
    seats: 6,
    price_per_km: 22,
    ac: true,
    driver_included: true,
    fuel_type: "Diesel",
    mileage: "13.5 km/l",
    insurance: "Active (Exp: 08-Aug-2027)",
    fitness: "Certified",
    rc: "RC-TN40-D-4545",
    vehicle_number: "TN 40 DF 4545",
    status: "Available",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "v-4",
    brand: "Kia",
    model: "Carnival Limousine",
    name: "Kia Carnival",
    type: "CAR",
    seats: 8,
    price_per_km: 26,
    ac: true,
    driver_included: true,
    fuel_type: "Diesel",
    mileage: "11 km/l",
    insurance: "Active (Exp: 22-Feb-2027)",
    fitness: "Certified",
    rc: "RC-TN38-F-6789",
    vehicle_number: "TN 38 FR 6789",
    status: "Available",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "v-5",
    brand: "Force Motors",
    model: "Traveller Luxury",
    name: "Force Traveller Luxury",
    type: "COACH",
    seats: 14,
    price_per_km: 34,
    ac: true,
    driver_included: true,
    fuel_type: "Diesel",
    mileage: "9 km/l",
    insurance: "Active (Exp: 14-Oct-2026)",
    fitness: "Certified",
    rc: "RC-TN38-M-4321",
    vehicle_number: "TN 38 MZ 4321",
    status: "Available",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "v-6",
    brand: "Volvo",
    model: "9400 Multi-Axle",
    name: "Volvo 9400 Coach",
    type: "BUS",
    seats: 40,
    price_per_km: 55,
    ac: true,
    driver_included: true,
    fuel_type: "Diesel",
    mileage: "4.5 km/l",
    insurance: "Active (Exp: 30-Nov-2026)",
    fitness: "Certified",
    rc: "RC-TN38-X-8888",
    vehicle_number: "TN 38 XY 8888",
    status: "Booked",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "v-7",
    brand: "Scania",
    model: "Metrolink HD",
    name: "Scania Premium Bus",
    type: "BUS",
    seats: 60,
    price_per_km: 68,
    ac: true,
    driver_included: true,
    fuel_type: "Diesel",
    mileage: "4 km/l",
    insurance: "Active (Exp: 19-May-2027)",
    fitness: "Certified",
    rc: "RC-TN39-Y-7777",
    vehicle_number: "TN 39 YA 7777",
    status: "Available",
    image: "https://images.unsplash.com/photo-1601758003122-53c40e636a9b?auto=format&fit=crop&w=600&q=80"
  }
];

const INITIAL_DRIVERS = [
  {
    id: "d-1",
    name: "Karthikeyan Ramasamy",
    phone: "+91 98430 12345",
    license: "DL-TN38201000456",
    experience: "12 Years",
    languages: ["Tamil", "English", "Malayalam"],
    rating: 4.9,
    assigned_vehicle: "TN 38 AH 9909",
    trip_status: "Available",
    availability: "Available",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "d-2",
    name: "Subhash Selvam",
    phone: "+91 94422 67890",
    license: "DL-TN40201400890",
    experience: "8 Years",
    languages: ["Tamil", "Hindi"],
    rating: 4.7,
    assigned_vehicle: "TN 40 DF 4545",
    trip_status: "Available",
    availability: "Available",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "d-3",
    name: "Saravanan Murugan",
    phone: "+91 97890 54321",
    license: "DL-TN38200600122",
    experience: "15 Years",
    languages: ["Tamil", "English", "Telugu", "Kannada"],
    rating: 5.0,
    assigned_vehicle: "TN 38 XY 8888",
    trip_status: "Running",
    availability: "On Trip",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  }
];

const INITIAL_REVIEWS = [
  {
    id: "r-1",
    name: "Aditya Vardhan",
    role: "Corporate Client",
    rating: 5,
    comment: "Excellent service! We booked a Mercedes S-Class for our international delegates. The vehicle was pristine, and the chauffeur Karthikeyan was extremely professional and punctual. Best premium travel agency in Tamil Nadu.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
    date: "14-Jul-2026"
  },
  {
    id: "r-2",
    name: "Priya Chandran",
    role: "Family Outing",
    rating: 5,
    comment: "Booked a Force Traveller for a family trip to Ooty. Highly comfortable ride, smooth driving in hairpin bends, and very transparent billing. The dynamic invoice calculation on their site was spot-on. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    date: "10-Jul-2026"
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "n-1",
    title: "New Booking Request",
    message: "Booking #DTT-7429 received for Toyota Innova.",
    time: "20 minutes ago",
    read: false
  },
  {
    id: "n-2",
    title: "Maintenance Alert",
    message: "Vehicle TN 38 MZ 4321 requires FC Renewal soon.",
    time: "2 hours ago",
    read: true
  }
];

const INITIAL_EXPENSES = [
  {
    id: "e-1",
    vehicle_number: "TN 38 AH 9909",
    type: "Oil Change",
    amount: 8500,
    date: "10-Jul-2026",
    notes: "Synthetic engine oil change at authorized Mercedes center"
  },
  {
    id: "e-2",
    vehicle_number: "TN 38 XY 8888",
    type: "Tyre Change",
    amount: 45000,
    date: "02-Jul-2026",
    notes: "Front two multi-axle tyres replaced"
  },
  {
    id: "e-3",
    vehicle_number: "TN 38 MZ 4321",
    type: "Fuel Expense",
    amount: 12500,
    date: "18-Jul-2026",
    notes: "Diesel refuel for Salem round trip"
  },
  {
    id: "e-4",
    vehicle_number: "TN 40 DF 4545",
    type: "Driver Salary",
    amount: 25000,
    date: "01-Jul-2026",
    notes: "Monthly driver payout for Subhash"
  }
];

const INITIAL_BOOKINGS = [
  {
    id: "DTT-9812",
    customer_name: "Aditya Vardhan",
    phone: "+91 98980 11111",
    email: "aditya.v@company.com",
    members: 2,
    vehicle_type: "CAR",
    vehicle_model: "Mercedes-Benz S-Class",
    seats: 4,
    pickup: "Coimbatore Airport (CJB)",
    destination: "Radisson Blu, Salem",
    travel_date: "2026-07-20",
    return_date: "2026-07-21",
    start_time: "10:00",
    end_time: "14:00",
    trip_type: "Round Trip",
    total_km: 330,
    fare: 5940,
    additional_charges: 2450, // driverAllowance, nightCharge, toll
    grand_total: 9899,
    status: "Confirmed",
    notes: "VIP guest, keep mineral water and newspaper in car.",
    invoice_id: "INV-9812",
    payment_status: "Paid",
    payment_method: "UPI",
    advance_paid: 5000,
    pending_amount: 4899,
    tracking: {
      lat: 11.0168,
      lng: 76.9558,
      route: [
        { lat: 11.0168, lng: 76.9558, name: "Coimbatore" },
        { lat: 11.3410, lng: 77.7172, name: "Erode" },
        { lat: 11.6643, lng: 78.1460, name: "Salem" }
      ],
      current_index: 0,
      running_status: "Running"
    }
  },
  {
    id: "DTT-3419",
    customer_name: "Meera Krishnan",
    phone: "+91 99440 22222",
    email: "meera.k@gmail.com",
    members: 12,
    vehicle_type: "COACH",
    vehicle_model: "Force Traveller Luxury",
    seats: 14,
    pickup: "Chennai Central",
    destination: "Mahabalipuram Shore Temple",
    travel_date: "2026-07-15",
    return_date: "",
    start_time: "08:00",
    end_time: "11:00",
    trip_type: "One Way",
    total_km: 60,
    fare: 2040,
    additional_charges: 1850,
    grand_total: 4591,
    status: "Completed",
    notes: "Family sightseeing trip.",
    invoice_id: "INV-3419",
    payment_status: "Paid",
    payment_method: "Credit Card",
    advance_paid: 4591,
    pending_amount: 0,
    tracking: {
      lat: 12.6208,
      lng: 80.1944,
      route: [],
      current_index: 0,
      running_status: "Reached"
    }
  }
];

// Helper to check and initialize DB
const initializeDB = () => {
  if (!localStorage.getItem("dtt_initialized")) {
    localStorage.setItem("dtt_pricing", JSON.stringify(DEFAULT_PRICING));
    localStorage.setItem("dtt_vehicles", JSON.stringify(INITIAL_VEHICLES));
    localStorage.setItem("dtt_drivers", JSON.stringify(INITIAL_DRIVERS));
    localStorage.setItem("dtt_reviews", JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem("dtt_notifications", JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem("dtt_expenses", JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem("dtt_bookings", JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem("dtt_initialized", "true");
  }
};

initializeDB();

// DB API
export const mockDB = {
  // Pricing API
  getPricing: () => {
    initializeDB();
    return JSON.parse(localStorage.getItem("dtt_pricing"));
  },
  savePricing: (pricing) => {
    localStorage.setItem("dtt_pricing", JSON.stringify(pricing));
    return pricing;
  },

  // Vehicles API
  getVehicles: () => {
    initializeDB();
    return JSON.parse(localStorage.getItem("dtt_vehicles"));
  },
  saveVehicle: (vehicle) => {
    const list = mockDB.getVehicles();
    if (vehicle.id) {
      const idx = list.findIndex(v => v.id === vehicle.id);
      if (idx > -1) list[idx] = vehicle;
    } else {
      vehicle.id = `v-${Date.now()}`;
      list.push(vehicle);
    }
    localStorage.setItem("dtt_vehicles", JSON.stringify(list));
    return vehicle;
  },
  deleteVehicle: (id) => {
    let list = mockDB.getVehicles();
    list = list.filter(v => v.id !== id);
    localStorage.setItem("dtt_vehicles", JSON.stringify(list));
    return true;
  },

  // Drivers API
  getDrivers: () => {
    initializeDB();
    return JSON.parse(localStorage.getItem("dtt_drivers"));
  },
  saveDriver: (driver) => {
    const list = mockDB.getDrivers();
    if (driver.id) {
      const idx = list.findIndex(d => d.id === driver.id);
      if (idx > -1) list[idx] = driver;
    } else {
      driver.id = `d-${Date.now()}`;
      list.push(driver);
    }
    localStorage.setItem("dtt_drivers", JSON.stringify(list));
    return driver;
  },
  deleteDriver: (id) => {
    let list = mockDB.getDrivers();
    list = list.filter(d => d.id !== id);
    localStorage.setItem("dtt_drivers", JSON.stringify(list));
    return true;
  },

  // Bookings API
  getBookings: () => {
    initializeDB();
    return JSON.parse(localStorage.getItem("dtt_bookings"));
  },
  saveBooking: (booking) => {
    const list = mockDB.getBookings();
    if (booking.id) {
      const idx = list.findIndex(b => b.id === booking.id);
      if (idx > -1) {
        list[idx] = booking;
      }
    } else {
      booking.id = `DTT-${Math.floor(1000 + Math.random() * 9000)}`;
      booking.invoice_id = `INV-${booking.id.split("-")[1]}`;
      booking.status = booking.status || "Pending";
      booking.payment_status = booking.payment_status || "Pending";
      booking.advance_paid = booking.advance_paid || 0;
      booking.pending_amount = booking.grand_total - booking.advance_paid;
      
      // Initialize mock tracking coordinates
      booking.tracking = {
        lat: 11.0168,
        lng: 76.9558,
        route: [
          { lat: 11.0168, lng: 76.9558, name: booking.pickup || "Pickup" },
          { lat: 11.3410, lng: 77.7172, name: "Midway" },
          { lat: 11.6643, lng: 78.1460, name: booking.destination || "Destination" }
        ],
        current_index: 0,
        running_status: "Running"
      };
      
      list.push(booking);
      
      // Add notification for Admin
      mockDB.addNotification({
        title: "New Booking Request",
        message: `Booking ${booking.id} created by ${booking.customer_name}.`,
        read: false
      });
    }
    localStorage.setItem("dtt_bookings", JSON.stringify(list));
    return booking;
  },
  deleteBooking: (id) => {
    let list = mockDB.getBookings();
    list = list.filter(b => b.id !== id);
    localStorage.setItem("dtt_bookings", JSON.stringify(list));
    return true;
  },

  // Expenses API
  getExpenses: () => {
    initializeDB();
    return JSON.parse(localStorage.getItem("dtt_expenses"));
  },
  addExpense: (expense) => {
    const list = mockDB.getExpenses();
    expense.id = `e-${Date.now()}`;
    list.push(expense);
    localStorage.setItem("dtt_expenses", JSON.stringify(list));
    return expense;
  },
  deleteExpense: (id) => {
    let list = mockDB.getExpenses();
    list = list.filter(e => e.id !== id);
    localStorage.setItem("dtt_expenses", JSON.stringify(list));
    return true;
  },

  // Reviews API
  getReviews: () => {
    initializeDB();
    return JSON.parse(localStorage.getItem("dtt_reviews"));
  },
  addReview: (review) => {
    const list = mockDB.getReviews();
    review.id = `r-${Date.now()}`;
    review.date = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).replace(/ /g, "-");
    review.avatar = review.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*1000000)}?auto=format&fit=crop&w=100&q=80`;
    list.push(review);
    localStorage.setItem("dtt_reviews", JSON.stringify(list));
    return review;
  },

  // Notifications API
  getNotifications: () => {
    initializeDB();
    return JSON.parse(localStorage.getItem("dtt_notifications"));
  },
  addNotification: (notif) => {
    const list = mockDB.getNotifications();
    notif.id = `n-${Date.now()}`;
    notif.time = "Just now";
    list.unshift(notif); // Add to top
    localStorage.setItem("dtt_notifications", JSON.stringify(list));
    return notif;
  },
  markAllNotificationsRead: () => {
    const list = mockDB.getNotifications();
    list.forEach(n => n.read = true);
    localStorage.setItem("dtt_notifications", JSON.stringify(list));
    return true;
  }
};
