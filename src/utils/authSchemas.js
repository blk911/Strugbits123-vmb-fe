import { z } from "zod";

const password = z.string().min(6, "Password must be at least 6 characters");

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const customerSignupSchema = z
  .object({
    fullName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(5, "Enter a valid address"),
    zipcode: z.string().regex(/^\d{5}$/, "5-digit zip"),
    phone: z.string().min(10, "Valid phone number required"),
    password: z.string().min(6, "Password must be at least 6 characters"),

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

export const salonStep2Schema = z
  .object({
    saloonName: z.string().min(2, "Salon name required"),
    saloonAddress: z.string().min(5, "Enter salon address"),
    saloonZipcode: z.string().regex(/^\d{5}$/, "5-digit zip"),
    phone: z.string().min(10, "Valid phone number required"),

    startTime: z.string().min(1, "Select start time"),
    endTime: z.string().min(1, "Select end time"),

    workingDays: z.array(z.string()).min(1, "Select at least one day"),

    licenseDoc: z.any().refine((file) => file instanceof File, {
      message: "License document is required",
    }),
    profilePic: z.any().refine((file) => file instanceof File, {
      message: "Profile picture is required",
    }),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    salonPhotos: z
      .array(z.any())
      .min(1, "At least one salon photo is required")
      .refine((files) => files.every((f) => f instanceof File), {
        message: "Invalid photo files",
      }),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return timeToMinutes(data.endTime) > timeToMinutes(data.startTime);
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );
