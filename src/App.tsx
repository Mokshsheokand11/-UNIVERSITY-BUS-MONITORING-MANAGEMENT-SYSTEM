/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { SpmDocsModal } from './components/common/SpmDocsModal';

// Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { BusTrackingPage } from './pages/student/BusTrackingPage';
import { RouteSchedulePage } from './pages/student/RouteSchedulePage';
import { StudentNoticesPage } from './pages/student/StudentNoticesPage';

import { DriverDashboard } from './pages/driver/DriverDashboard';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BusManagementPage } from './pages/admin/BusManagementPage';
import { DriverManagementPage } from './pages/admin/DriverManagementPage';
import { RouteManagementPage } from './pages/admin/RouteManagementPage';
import { ScheduleManagementPage } from './pages/admin/ScheduleManagementPage';
import { StudentManagementPage } from './pages/admin/StudentManagementPage';
import { NoticeManagementPage } from './pages/admin/NoticeManagementPage';

// Demo Data
import {
  INITIAL_BUSES,
  INITIAL_DRIVERS,
  INITIAL_NOTICES,
  INITIAL_ROUTES,
  INITIAL_SCHEDULES,
  INITIAL_STOPS,
  INITIAL_STUDENTS,
  INITIAL_TRIPS,
  INITIAL_USERS,
} from './utils/demoData';

import { Bus, DriverProfile, Notice, Route, Schedule, ShiftType, Stop, StudentProfile, Trip, User } from './types';

function MainAppContent() {
  const { role, currentUser } = useAuth();

  // App-level state seeded with normalized realistic demo data
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [allStops, setAllStops] = useState<Stop[]>(INITIAL_STOPS);
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [drivers, setDrivers] = useState<DriverProfile[]>(INITIAL_DRIVERS);
  const [students] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('student-dashboard');
  const [selectedTrackingBusId, setSelectedTrackingBusId] = useState<number | undefined>(undefined);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Auto-switch default tab if role changes
  React.useEffect(() => {
    if (role === 'STUDENT') setCurrentTab('student-dashboard');
    else if (role === 'DRIVER') setCurrentTab('driver-dashboard');
    else if (role === 'ADMIN') setCurrentTab('admin-dashboard');
  }, [role]);

  // Trip state updates from driver
  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  // Admin Bus Handlers
  const handleAddBus = (newBusData: Omit<Bus, 'id'>) => {
    const newId = Math.max(...buses.map((b) => b.id), 0) + 1;
    const newBus: Bus = { ...newBusData, id: newId };
    setBuses((prev) => [...prev, newBus]);
  };

  const handleUpdateBus = (updatedBus: Bus) => {
    setBuses((prev) => prev.map((b) => (b.id === updatedBus.id ? updatedBus : b)));
  };

  const handleDeleteBus = (id: number) => {
    setBuses((prev) => prev.filter((b) => b.id !== id));
  };

  // Admin Driver Handlers
  const handleAddDriver = (
    fullName: string,
    email: string,
    phone: string,
    licenseNumber: string,
    experienceYears: number,
    busId?: number
  ) => {
    const newUserId = Math.max(...users.map((u) => u.id), 0) + 1;
    const newUser: User = {
      id: newUserId,
      fullName,
      email,
      role: 'DRIVER',
      phone,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    const newDriverId = Math.max(...drivers.map((d) => d.id), 0) + 1;
    const newDriver: DriverProfile = {
      id: newDriverId,
      userId: newUserId,
      licenseNumber,
      experienceYears,
      assignedBusId: busId,
    };
    setUsers((prev) => [...prev, newUser]);
    setDrivers((prev) => [...prev, newDriver]);
    if (busId) {
      setBuses((prev) =>
        prev.map((b) => (b.id === busId ? { ...b, assignedDriverId: newDriverId } : b))
      );
    }
  };

  const handleUpdateDriver = (updatedDriver: DriverProfile) => {
    setDrivers((prev) => prev.map((d) => (d.id === updatedDriver.id ? updatedDriver : d)));
  };

  const handleDeleteDriver = (id: number) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  // Admin Route Handlers
  const handleAddRoute = (
    routeCode: string,
    routeName: string,
    origin: string,
    destination: string,
    approxDurationMinutes: number
  ) => {
    const newId = Math.max(...routes.map((r) => r.id), 0) + 1;
    const newRoute: Route = {
      id: newId,
      routeCode,
      routeName,
      origin,
      destination,
      approxDurationMinutes,
      isActive: true,
      stops: [
        {
          id: 100 + newId,
          routeId: newId,
          stopId: allStops[0]?.id || 1,
          stopSequence: 1,
          estimatedMinutesFromStart: 0,
          stop: allStops[0],
        },
      ],
    };
    setRoutes((prev) => [...prev, newRoute]);
  };

  const handleAddStop = (
    stopName: string,
    latitude: number,
    longitude: number,
    landmark?: string
  ) => {
    const newId = Math.max(...allStops.map((s) => s.id), 0) + 1;
    const newStop: Stop = { id: newId, stopName, latitude, longitude, landmark };
    setAllStops((prev) => [...prev, newStop]);
  };

  const handleDeleteRoute = (id: number) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  // Admin Schedule Handlers
  const handleAddSchedule = (
    routeId: number,
    busId: number,
    departureTime: string,
    shift: ShiftType,
    daysOfOperation: string
  ) => {
    const newId = Math.max(...schedules.map((s) => s.id), 0) + 1;
    const newSchedule: Schedule = {
      id: newId,
      routeId,
      busId,
      departureTime,
      shift,
      daysOfOperation,
      isActive: true,
    };
    setSchedules((prev) => [...prev, newSchedule]);
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  // Admin Student Status Handler
  const handleToggleStudentStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  // Admin Notice Handlers
  const handleAddNotice = (
    title: string,
    content: string,
    category: import('./types').NoticeCategory
  ) => {
    const newId = Math.max(...notices.map((n) => n.id), 0) + 1;
    const newNotice: Notice = {
      id: newId,
      title,
      content,
      category,
      publishedBy: currentUser?.fullName || 'Transport Authority',
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const handleDeleteNotice = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Driver entity matching current user
  const activeDriverProfile =
    drivers.find((d) => d.userId === currentUser?.id) || drivers[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      <Navbar onOpenDocs={() => setIsDocsModalOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Role Navigation Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* STUDENT VIEWS */}
          {currentTab === 'student-dashboard' && (
            <StudentDashboard
              buses={buses}
              routes={routes}
              trips={trips}
              notices={notices}
              onNavigateToTracking={(busId) => {
                setSelectedTrackingBusId(busId);
                setCurrentTab('student-tracking');
              }}
              onNavigateToSchedules={() => setCurrentTab('student-schedules')}
            />
          )}

          {currentTab === 'student-tracking' && (
            <BusTrackingPage
              buses={buses}
              routes={routes}
              trips={trips}
              drivers={drivers}
              users={users}
              allStops={allStops}
              initialBusId={selectedTrackingBusId}
            />
          )}

          {currentTab === 'student-schedules' && (
            <RouteSchedulePage
              routes={routes}
              schedules={schedules}
              buses={buses}
              onTrackBus={(busId) => {
                setSelectedTrackingBusId(busId);
                setCurrentTab('student-tracking');
              }}
            />
          )}

          {currentTab === 'student-notices' && (
            <StudentNoticesPage notices={notices} />
          )}

          {/* DRIVER VIEWS */}
          {(currentTab === 'driver-dashboard' || currentTab === 'driver-simulator') && (
            <DriverDashboard
              currentDriver={activeDriverProfile}
              currentUser={currentUser || users[1]}
              buses={buses}
              routes={routes}
              trips={trips}
              allStops={allStops}
              onUpdateTrip={handleUpdateTrip}
            />
          )}

          {/* ADMIN VIEWS */}
          {currentTab === 'admin-dashboard' && (
            <AdminDashboard
              buses={buses}
              drivers={drivers}
              students={students}
              routes={routes}
              trips={trips}
              notices={notices}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'admin-buses' && (
            <BusManagementPage
              buses={buses}
              routes={routes}
              onAddBus={handleAddBus}
              onUpdateBus={handleUpdateBus}
              onDeleteBus={handleDeleteBus}
            />
          )}

          {currentTab === 'admin-drivers' && (
            <DriverManagementPage
              drivers={drivers}
              users={users}
              buses={buses}
              onAddDriver={handleAddDriver}
              onUpdateDriver={handleUpdateDriver}
              onDeleteDriver={handleDeleteDriver}
            />
          )}

          {currentTab === 'admin-routes' && (
            <RouteManagementPage
              routes={routes}
              allStops={allStops}
              onAddRoute={handleAddRoute}
              onAddStop={handleAddStop}
              onDeleteRoute={handleDeleteRoute}
            />
          )}

          {currentTab === 'admin-schedules' && (
            <ScheduleManagementPage
              schedules={schedules}
              routes={routes}
              buses={buses}
              onAddSchedule={handleAddSchedule}
              onDeleteSchedule={handleDeleteSchedule}
            />
          )}

          {currentTab === 'admin-students' && (
            <StudentManagementPage
              students={students}
              users={users}
              onToggleStudentStatus={handleToggleStudentStatus}
            />
          )}

          {currentTab === 'admin-notices' && (
            <NoticeManagementPage
              notices={notices}
              onAddNotice={handleAddNotice}
              onDeleteNotice={handleDeleteNotice}
            />
          )}
        </main>
      </div>

      {/* SPM Academic Documentation Modal */}
      <SpmDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
