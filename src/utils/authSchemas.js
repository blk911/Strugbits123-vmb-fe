// src/schemas/authSchemas.js
import { z } from "zod";

const password = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const customerSignupSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Enter a valid address"),
  zipcode: z.string().regex(/^\d{5}$/, "5-digit zip"),
  password,
  confirmPassword: password,
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don’t match",
  path: ["confirmPassword"],
});

// Reuse same fields for salon step 1
export const salonStep1Schema = customerSignupSchema;

export const salonStep2Schema = z.object({
  saloonName: z.string().min(2, "Salon name required"),
  saloonAddress: z.string().min(5, "Enter salon address"),
  saloonZipcode: z.string().regex(/^\d{5}$/, "5-digit zip"),
  // phone: z.string().regex(/^03\d{2}-\d{7}$/, "Format: 0300-0000000"),
   phone: z.string().min(2, "Phone Number name required"),
  startTime: z.string().min(1, "Select start time"),
  endTime: z.string().min(1, "Select end time"),
  workingDays: z.array(z.string()).min(1, "Select at least one day"),
  licenseDoc: z.instanceof(File).optional().or(z.any()),
  profilePic: z.instanceof(File).optional().or(z.any()),
  salonPhotos: z.array(z.instanceof(File)).optional().or(z.any()),
  description: z.string().optional(),
});