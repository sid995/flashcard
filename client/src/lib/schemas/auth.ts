import { z } from "zod";

export const registrationSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be less than 20 characters long")
      .regex(
        /^[a-zA-Z]+$/,
        "Username can only contain alphabets, no spaces, numbers, or special characters"
      ),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegistrationData = z.infer<typeof registrationSchema>;

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInData = z.infer<typeof signInSchema>;
