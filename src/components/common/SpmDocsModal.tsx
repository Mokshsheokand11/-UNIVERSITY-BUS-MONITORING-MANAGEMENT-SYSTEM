import React, { useState } from 'react';
import { Modal } from './Modal';
import { BookOpen, Users, GitBranch, Database, ShieldAlert, CheckCircle2, Key } from 'lucide-react';

interface SpmDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpmDocsModal: React.FC<SpmDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'team' | 'er' | 'usecase' | 'dfd' | 'credentials'>('team');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SPM Academic Project Documentation & Architecture" maxWidth="max-w-4xl">
      <div className="space-y-4">
        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'team' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            4-Member Team Roles
          </button>
          <button
            onClick={() => setActiveTab('er')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'er' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            ER Diagram (3NF)
          </button>
          <button
            onClick={() => setActiveTab('usecase')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'usecase' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Use Case & Activity
          </button>
          <button
            onClick={() => setActiveTab('dfd')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dfd' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            DFD Level 0 & Level 1
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'credentials' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Demo Evaluation Passwords
          </button>
        </div>

        {/* Tab 1: 4 Member Team Roles */}
        {activeTab === 'team' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-900">
              <span className="font-bold">Project Title:</span> University Bus Monitoring & Management System (UBMMS)
              <br />
              <span className="font-bold">Course / Domain:</span> Software Project Management (SPM) Academic Capstone
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <span className="font-bold text-blue-700 text-sm">MEMBER 1: Lead SPM & Auth</span>
                <p className="text-slate-500 mt-1">Project Management, SRS documentation, Scope & Risk matrix, JWT Authentication module, User role verification.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <span className="font-bold text-indigo-700 text-sm">MEMBER 2: Database Architect</span>
                <p className="text-slate-500 mt-1">MySQL 3NF relational schema, Primary/Foreign keys, Seed script creation, ER Diagram, Backend API endpoints.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <span className="font-bold text-amber-700 text-sm">MEMBER 3: UML & Driver Engine</span>
                <p className="text-slate-500 mt-1">Use Case Diagram, Activity Diagrams, Driver Cockpit, GPS Telemetry simulation engine, State synchronization.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <span className="font-bold text-emerald-700 text-sm">MEMBER 4: DFD & QA Lead</span>
                <p className="text-slate-500 mt-1">DFD Level 0 & Level 1 models, Leaflet OpenStreetMap live tracking map, Integration testing, Academic presentation.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ER Diagram */}
        {activeTab === 'er' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Normalized Database Entities (3NF)</h4>
            <div className="font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-[11px] leading-relaxed">
              {`+----------------+       1:1       +------------------+
|     USERS      | <-------------> |     STUDENTS     |
| id (PK)        |                 | user_id (FK)     |
| email, role    |                 | roll_number      |
+----------------+                 +------------------+
        | 1:1
        v
+----------------+       1:N       +------------------+
|    DRIVERS     | <-------------> |      TRIPS       |
| user_id (FK)   |                 | id (PK), status  |
| license_number |                 | current_stop_id  |
+----------------+                 +------------------+
        |                                  ^
        | 1:1                              | 1:N
        v                                  |
+----------------+       1:N               |
|     BUSES      | ------------------------+
| id (PK)        |                         | 1:N
| bus_number     |                         v
+----------------+                 +------------------+
        |                          |  BUS_LOCATIONS   |
        | N:1                      | latitude, long   |
        v                          +------------------+
+----------------+       1:N       +------------------+
|     ROUTES     | --------------> |   ROUTE_STOPS    |
| route_code     |                 | stop_sequence    |
+----------------+                 +------------------+
                                           | N:1
                                           v
                                   +------------------+
                                   |      STOPS       |
                                   | stop_name, coords|
                                   +------------------+`}
            </div>
          </div>
        )}

        {/* Tab 3: Use Case & Activity */}
        {activeTab === 'usecase' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Use Case & Activity Flow</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-800 text-xs">ACTOR: STUDENT</span>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-700 text-[11px]">
                  <li>UC1: Register & Login</li>
                  <li>UC2: View Active Buses</li>
                  <li>UC3: Track Live Simulated Location</li>
                  <li>UC4: Search Routes & Stops</li>
                  <li>UC5: Check Timetable Schedules</li>
                  <li>UC6: Read Transit Notices</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-800 text-xs">ACTOR: DRIVER</span>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-700 text-[11px]">
                  <li>UC7: Login Driver Cockpit</li>
                  <li>UC8: Start Operational Trip</li>
                  <li>UC9: Advance Current Stop</li>
                  <li>UC10: Update Simulated GPS Coords</li>
                  <li>UC11: Report Route Delay / Traffic</li>
                  <li>UC12: End Trip</li>
                </ul>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
                <span className="font-bold text-indigo-800 text-xs">ACTOR: ADMIN</span>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-700 text-[11px]">
                  <li>UC13: Manage Buses (CRUD)</li>
                  <li>UC14: Manage Drivers & Assign Buses</li>
                  <li>UC15: Manage Routes & Stops</li>
                  <li>UC16: Create Timetable Schedules</li>
                  <li>UC17: Toggle Student Account Status</li>
                  <li>UC18: Broadcast Notices</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: DFD Level 0 & Level 1 */}
        {activeTab === 'dfd' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Data Flow Diagram (DFD) Structure</h4>
            <div className="font-mono bg-slate-900 text-slate-100 p-4 rounded-xl text-[11px] leading-relaxed overflow-x-auto">
              {`=== DFD LEVEL 0 (CONTEXT DIAGRAM) ===
[STUDENT] <=== (Bus Locations, Schedules, Notices) === [ 0.0 UNIVERSITY BUS  ] <=== (Driver GPS Updates, Trip States) === [DRIVER]
          ===> (Registration, Bus Selection) ===>     [ MONITORING & MGMT   ]
                                                       [     SYSTEM          ] <=== (CRUD Fleet, Routes, Notices) ===== [ADMIN]

=== DFD LEVEL 1 (DECOMPOSITION) ===
1.0 AUTHENTICATION & ACCESS CONTROL =====> Store: D1 [users], D2 [students], D3 [drivers]
2.0 FLEET & ROUTE MANAGEMENT ============> Store: D4 [buses], D5 [routes], D6 [stops], D7 [route_stops]
3.0 TRIP & LOCATION SIMULATION ENGINE ===> Store: D8 [trips], D9 [bus_locations]
4.0 LIVE TRACKING PRESENTATION (MAP) ====> Reads: D4, D5, D8, D9 -> Renders Leaflet OpenStreetMap
5.0 NOTICE & CIRCULAR BROADCAST =========> Store: D10 [notices]`}
            </div>
          </div>
        )}

        {/* Tab 5: Demo Evaluation Credentials */}
        {activeTab === 'credentials' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Evaluation Login Accounts</h4>
            <p className="text-slate-500">
              The examiner or professor can use these accounts to verify role-based permissions:
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-900 block">ADMIN ROLE</span>
                  <span className="font-mono text-slate-600">admin@university.edu</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Password:</span>
                  <span className="font-mono font-bold text-indigo-700 block">admin123</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 block">DRIVER ROLE</span>
                  <span className="font-mono text-slate-600">driver1@university.edu</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Password:</span>
                  <span className="font-mono font-bold text-amber-700 block">driver123</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block">STUDENT ROLE</span>
                  <span className="font-mono text-slate-600">student1@university.edu</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Password:</span>
                  <span className="font-mono font-bold text-emerald-700 block">student123</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
