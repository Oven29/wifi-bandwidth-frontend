import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { NetworkActivity } from '../types/activity';
import { MOCK_ACTIVITIES } from '../modules/mock';
import { BottomNavbar } from '../components/Navbar/BottomNavbar';

export interface AppOutletContext {
  activities: NetworkActivity[];
  setActivities: React.Dispatch<React.SetStateAction<NetworkActivity[]>>;
}

export const AppLayout: React.FC = () => {
  // Global collection of activities loaded from mock objects as required by Lab 5
  const [activities, setActivities] = useState<NetworkActivity[]>(MOCK_ACTIVITIES);

  useEffect(() => {
    // Ensure initial activities state is populated with mock data
    if (activities.length === 0) {
      setActivities(MOCK_ACTIVITIES);
    }
  }, [activities.length]);

  return (
    <div className="app-shell">
      <main className="app-content">
        <Outlet context={{ activities, setActivities }} />
      </main>
      <BottomNavbar />
    </div>
  );
};
