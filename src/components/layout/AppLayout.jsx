import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileSidebar from './MobileSidebar';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:ml-[260px] min-h-screen flex flex-col transition-all duration-300">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}