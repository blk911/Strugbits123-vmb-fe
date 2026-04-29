import { z } from "zod";
const nameRegex = /^[a-zA-Z\s&'-]+$/;
const phoneRegex = /^\d{10,15}$/;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const customerSignupSchema = z
  .object({
    fullName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(5, "Enter a valid address"),
    // .regex(/^[a-zA-Z0-9\s,.'\-!&()/:]+$/, "Invalid address"),
    zipcode: z.string().regex(/^\d{5}$/, "5-digit zip"),
    phone: z
      .string()
      .min(10, "Valid phone number required")
      .regex(phoneRegex, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    userProfile: z.string().min(1, "Profile picture is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don’t match",
    path: ["confirmPassword"],
  });

export const salonStep1Schema = customerSignupSchema;
const timeToMinutes = (time24) => {
  if (!time24) return 0;
  const [hours, minutes] = time24.split(":").map(Number);
  return hours * 60 + minutes;
};

export const salonStep2Schema = z.object({
  saloonName: z.string().min(2, "Salon name required"),
  saloonAddress: z.string().min(5, "Enter salon address"),
  // .regex(/^[a-zA-Z0-9\s,.'\-!&()/:]+$/, "Invalid address"),
  saloonZipcode: z.string().regex(/^\d{5}$/, "5-digit zip"),
  salonPhone: z
    .string()
    .min(10, "Valid phone number required")
    .regex(phoneRegex, "Invalid phone number"),

  startTime: z.string().min(1, "Select start time"),
  endTime: z.string().min(1, "Select end time"),

  workingDays: z.array(z.string()).min(1, "Select at least one day"),

  licenseDoc: z
    .string()
    .url("Invalid document URL")
    .min(1, "License document required"),
  profilePic: z
    .string()
    .url("Invalid image URL")
    .min(1, "Profile picture required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // .regex(/^[a-zA-Z0-9\s,.'\-!&()/:]+$/, "Invalid description"),
  salonPhotos: z
    .array(
      z.object({
        url: z.string().url(),
        name: z.string(),
      }),
    )
    .min(1, "At least one salon photo is required"),
});
