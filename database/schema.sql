-- ============================================================================
-- UNIVERSITY BUS MONITORING & MANAGEMENT SYSTEM (UBMMS)
-- Database: MySQL Relational Schema (3NF Normalized)
-- SPM Academic Project DDL & Demo Seed Data
-- ============================================================================

CREATE DATABASE IF NOT EXISTS university_bus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE university_bus_db;

-- ----------------------------------------------------------------------------
-- 1. Table: users
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS bus_locations;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS route_stops;
DROP TABLE IF EXISTS stops;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS buses;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'DRIVER', 'STUDENT') NOT NULL,
    phone VARCHAR(20) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 2. Table: buses
-- ----------------------------------------------------------------------------
CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(30) NOT NULL UNIQUE,
    registration_plate VARCHAR(30) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bus_number (bus_number),
    INDEX idx_bus_status (status)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 3. Table: drivers
-- ----------------------------------------------------------------------------
CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    experience_years INT DEFAULT 0,
    assigned_bus_id INT NULL,
    CONSTRAINT fk_driver_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_driver_bus FOREIGN KEY (assigned_bus_id) REFERENCES buses(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 4. Table: stops
-- ----------------------------------------------------------------------------
CREATE TABLE stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stop_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    landmark VARCHAR(150) NULL,
    INDEX idx_stop_name (stop_name)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 5. Table: students
-- ----------------------------------------------------------------------------
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    preferred_stop_id INT NULL,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_stop FOREIGN KEY (preferred_stop_id) REFERENCES stops(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 6. Table: routes
-- ----------------------------------------------------------------------------
CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_code VARCHAR(20) NOT NULL UNIQUE,
    route_name VARCHAR(150) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    approx_duration_minutes INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_route_code (route_code)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 7. Table: route_stops (Junction Table preserving Sequence)
-- ----------------------------------------------------------------------------
CREATE TABLE route_stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    stop_id INT NOT NULL,
    stop_sequence INT NOT NULL,
    estimated_minutes_from_start INT NOT NULL,
    CONSTRAINT fk_routestops_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    CONSTRAINT fk_routestops_stop FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE,
    CONSTRAINT uq_route_sequence UNIQUE (route_id, stop_sequence)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 8. Table: schedules
-- ----------------------------------------------------------------------------
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    bus_id INT NOT NULL,
    departure_time VARCHAR(20) NOT NULL,
    shift ENUM('MORNING', 'AFTERNOON', 'EVENING') NOT NULL,
    days_of_operation VARCHAR(50) DEFAULT 'Mon - Fri',
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_schedule_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    CONSTRAINT fk_schedule_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 9. Table: trips
-- ----------------------------------------------------------------------------
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NULL,
    bus_id INT NOT NULL,
    driver_id INT NOT NULL,
    route_id INT NOT NULL,
    trip_status ENUM('SCHEDULED', 'ON_ROUTE', 'COMPLETED', 'CANCELLED', 'DELAYED') DEFAULT 'SCHEDULED',
    current_stop_id INT NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    remarks VARCHAR(255) NULL,
    CONSTRAINT fk_trip_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE SET NULL,
    CONSTRAINT fk_trip_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    CONSTRAINT fk_trip_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    CONSTRAINT fk_trip_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    CONSTRAINT fk_trip_stop FOREIGN KEY (current_stop_id) REFERENCES stops(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 10. Table: bus_locations (Simulated Telemetry Log)
-- ----------------------------------------------------------------------------
CREATE TABLE bus_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    bus_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed_kmh DECIMAL(5, 2) DEFAULT 30.00,
    heading_degrees INT DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_location_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_location_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 11. Table: notices
-- ----------------------------------------------------------------------------
CREATE TABLE notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('GENERAL', 'DELAY', 'ROUTE_CHANGE', 'EMERGENCY') DEFAULT 'GENERAL',
    published_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- ============================================================================
-- SEED DEMO DATA
-- ============================================================================

-- Users (bcrypt hashes for: admin123, driver123, student123)
INSERT INTO users (id, full_name, email, password_hash, role, phone, is_active) VALUES
(1, 'Dr. Alok Verma (Transport Head)', 'admin@university.edu', '$2b$10$demoHashAdmin123xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'ADMIN', '+91 98110 22334', 1),
(2, 'Rajesh Kumar', 'driver1@university.edu', '$2b$10$demoHashDriver123xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'DRIVER', '+91 98765 43210', 1),
(3, 'Suresh Sharma', 'driver2@university.edu', '$2b$10$demoHashDriver123xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'DRIVER', '+91 98765 43211', 1),
(4, 'Vikram Singh', 'driver3@university.edu', '$2b$10$demoHashDriver123xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'DRIVER', '+91 98765 43212', 1),
(5, 'Priya Verma', 'student1@university.edu', '$2b$10$demoHashStudent123xxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'STUDENT', '+91 91234 56780', 1),
(6, 'Rahul Mehra', 'student2@university.edu', '$2b$10$demoHashStudent123xxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'STUDENT', '+91 91234 56781', 1);

-- Buses
INSERT INTO buses (id, bus_number, registration_plate, capacity, status) VALUES
(1, 'MRU-101', 'DL-01-EQ-1044', 52, 'ACTIVE'),
(2, 'MRU-102', 'DL-01-EQ-1045', 52, 'ACTIVE'),
(3, 'MRU-103', 'DL-01-EQ-1046', 48, 'ACTIVE'),
(4, 'MRU-104', 'DL-01-EQ-1047', 50, 'MAINTENANCE'),
(5, 'MRU-105', 'DL-01-EQ-1048', 55, 'ACTIVE');

-- Drivers
INSERT INTO drivers (id, user_id, license_number, experience_years, assigned_bus_id) VALUES
(1, 2, 'DL-042020-009811', 8, 1),
(2, 3, 'DL-042018-004455', 6, 2),
(3, 4, 'DL-042015-001290', 11, 3);

-- Stops
INSERT INTO stops (id, stop_name, latitude, longitude, landmark) VALUES
(1, 'University Main Gate (Campus Hub)', 28.45950000, 77.02660000, 'Administrative Block North'),
(2, 'Sector 14 Market Crossing', 28.47150000, 77.03920000, 'Opposite Community Center'),
(3, 'Civil Lines Bus Stand', 28.46320000, 77.04980000, 'Near District Court'),
(4, 'City Center Metro Station', 28.45900000, 77.07250000, 'Gate No. 2 Metro Parking'),
(5, 'Cyber Park Tech Hub', 28.45020000, 77.05800000, 'Tower B Drop Point'),
(6, 'Sushant Lok Phase 1', 28.46880000, 77.08500000, 'Near Vyapar Kendra'),
(7, 'Old Railway Station Terminal', 28.47950000, 77.01200000, 'Platform 1 Footbridge'),
(8, 'Model Town Circle', 28.48500000, 77.02150000, 'Clock Tower Junction');

-- Students
INSERT INTO students (id, user_id, roll_number, department, semester, preferred_stop_id) VALUES
(1, 5, '2023CSB101', 'Computer Science & Engg', 'Semester 6', 3),
(2, 6, '2023ECB145', 'Electronics & Comm.', 'Semester 4', 5);

-- Routes
INSERT INTO routes (id, route_code, route_name, origin, destination, approx_duration_minutes, is_active) VALUES
(1, 'R-01', 'Main Campus ↔ City Center Metro', 'University Main Gate', 'City Center Metro Station', 35, 1),
(2, 'R-02', 'Main Campus ↔ Cyber Park & Sushant Lok', 'University Main Gate', 'Sushant Lok Phase 1', 45, 1),
(3, 'R-03', 'Main Campus ↔ Railway Station Terminal', 'University Main Gate', 'Old Railway Station Terminal', 30, 1);

-- Route Stops
INSERT INTO route_stops (route_id, stop_id, stop_sequence, estimated_minutes_from_start) VALUES
(1, 1, 1, 0),
(1, 2, 2, 12),
(1, 3, 3, 22),
(1, 4, 4, 35),
(2, 1, 1, 0),
(2, 5, 2, 20),
(2, 6, 3, 45),
(3, 1, 1, 0),
(3, 8, 2, 15),
(3, 7, 3, 30);

-- Schedules
INSERT INTO schedules (id, route_id, bus_id, departure_time, shift, days_of_operation, is_active) VALUES
(1, 1, 1, '07:45 AM', 'MORNING', 'Mon - Fri', 1),
(2, 2, 2, '08:00 AM', 'MORNING', 'Mon - Fri', 1),
(3, 3, 3, '08:15 AM', 'MORNING', 'Mon - Fri', 1),
(4, 1, 1, '04:30 PM', 'EVENING', 'Mon - Fri', 1);

-- Trips
INSERT INTO trips (id, schedule_id, bus_id, driver_id, route_id, trip_status, current_stop_id, started_at, remarks) VALUES
(1, 1, 1, 1, 1, 'ON_ROUTE', 2, '2026-10-08 07:45:00', 'Departed on time. Normal campus traffic.'),
(2, 2, 2, 2, 2, 'ON_ROUTE', 5, '2026-10-08 08:00:00', 'Moderate traffic near Cyber Hub flyover.'),
(3, 3, 3, 3, 3, 'SCHEDULED', 1, NULL, 'Parked at University Gate. Awaiting departure.');

-- Bus Locations (Initial Telemetry)
INSERT INTO bus_locations (trip_id, bus_id, latitude, longitude, speed_kmh, heading_degrees) VALUES
(1, 1, 28.47150000, 77.03920000, 32.50, 45),
(2, 2, 28.45020000, 77.05800000, 28.00, 90);

-- Notices
INSERT INTO notices (id, title, content, category, published_by, is_active) VALUES
(1, 'Mid-Term Exam Special Bus Timings Notice', 'Special return buses will depart at 01:30 PM and 05:15 PM during examination week across Routes R-01 and R-02.', 'GENERAL', 'Transport Department', 1),
(2, 'Route R-01 Temporary Diversion at Civil Lines', 'Due to municipal road maintenance near Civil Lines Court, MRU-101 will stop 100 meters ahead near the City Post Office.', 'ROUTE_CHANGE', 'Fleet Supervisor', 1);
