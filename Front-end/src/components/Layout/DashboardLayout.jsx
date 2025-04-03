import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import { useLocation } from 'react-router-dom';
import CalendarSidebar from '../Calendar/CalendarSidebar';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const isCalendarPage = location.pathname.startsWith('/calendar');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* System Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Calendar Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Calendar Sidebar */}
          {isCalendarPage && <CalendarSidebar />}

          {/* Main Content Area */}
          <main className={`flex-1 overflow-x-hidden overflow-y-auto p-4 ${isCalendarPage ? 'ml-0' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 