// Application Constants

// Export unified color palette
export { COLORS } from './colors';

// Penalties
export const PENALTIES = [
  { name: "Overspeeding", amount: 50 },
  { name: "Geofencing", amount: 200 },
  { name: "Late Payment", amount: 50 },
  { name: "Accident Liability", amount: 100 },
  { name: "Maintenance Default", amount: 30 },
  { name: "Safety Gear", amount: 40 },
  { name: "Recovery (Based on Location)", amount: 150 },
  { name: "Accident (20% of total cost)", amount: "20%" },
];

// User Roles
export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  DRIVER: "driver",
};

// Permissions
export const PERMISSIONS = {
  APPROVE_DRIVERS: "approve_drivers",
  ADD_PENALTIES: "add_penalties",
  MANAGE_STAFF: "manage_staff",
  VIEW_DASHBOARD: "view_dashboard",
};

// Validation Regex Patterns
export const VALIDATION = {
  PHONE: /^(\+233|0)[2-5]\d{8}$/,
  GHANA_CARD: /^GHA-\d{9}-\d$/,
  NAME: /^[A-Za-z\s]{2,}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  PHONE_INVALID: "Invalid phone number. Use format: +233XXXXXXXXX or 0XXXXXXXXX",
  GHANA_CARD_INVALID: "Invalid Ghana Card format. Use: GHA-XXXXXXXXX-X",
  NAME_INVALID: "Invalid name. Use letters and spaces only (minimum 2 characters)",
  EMAIL_INVALID: "Invalid email address",
  REQUIRED_FIELDS: "All fields are required",
};

// API Endpoints (if needed for clarity)
export const API_ENDPOINTS = {
  STATS: "/stats",
  DRIVERS: "/drivers",
  STAFF: "/staff",
  PENALTIES: "/penalties",
  AUTH_DRIVER_REGISTER: "/auth/driver/register",
};
