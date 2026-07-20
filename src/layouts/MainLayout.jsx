import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingActionButtons from '../components/FloatingActionButtons';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating CTA / Back to Top */}
      <FloatingActionButtons />
    </div>
  );
};
export default MainLayout;
