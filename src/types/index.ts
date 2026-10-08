export type UserRole = 'ADMIN' | 'DRIVER' | 'STUDENT';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface StudentProfile {
  id: number;
  userId: number;
  rollNumber: string;
  department: string;
  semester: string;
  preferredStopId?: number;
}

export interface DriverProfile {
  id: number;
  userId: number;
  licenseNumber: string;
  experienceYears: number;
  assignedBusId?: number;
}

export type BusStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Bus {
  id: number;
  busNumber: string;
  registrationPlate: string;
  capacity: number;
  status: BusStatus;
  currentRouteId?: number;
  assignedDriverId?: number;
}

export interface Stop {
  id: number;
  stopName: string;
  latitude: number;
  longitude: number;
  landmark?: string;
}

export interface RouteStop {
  id: number;
  routeId: number;
  stopId: number;
  stopSequence: number;
  estimatedMinutesFromStart: number;
  stop?: Stop;
}

export interface Route {
  id: number;
  routeCode: string;
  routeName: string;
  origin: string;
  destination: string;
  approxDurationMinutes: number;
  isActive: boolean;
  stops?: RouteStop[];
}

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface Schedule {
  id: number;
  routeId: number;
  busId: number;
  departureTime: string;
  shift: ShiftType;
  daysOfOperation: string;
  isActive: boolean;
  route?: Route;
  bus?: Bus;
}

export type TripStatus = 'SCHEDULED' | 'ON_ROUTE' | 'COMPLETED' | 'CANCELLED' | 'DELAYED';

export interface Trip {
  id: number;
  scheduleId?: number;
  busId: number;
  driverId: number;
  routeId: number;
  tripStatus: TripStatus;
  currentStopId?: number;
  startedAt?: string;
  completedAt?: string;
  remarks?: string;
  bus?: Bus;
  route?: Route;
  currentStop?: Stop;
}

export interface BusLocation {
  id: number;
  tripId: number;
  busId: number;
  latitude: number;
  longitude: number;
  speedKmh: number;
  headingDegrees: number;
  recordedAt: string;
  currentStopName?: string;
  estimatedArrivalMinutes?: number;
}

export type NoticeCategory = 'GENERAL' | 'DELAY' | 'ROUTE_CHANGE' | 'EMERGENCY';

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: NoticeCategory;
  publishedBy: string;
  createdAt: string;
  isActive: boolean;
}
