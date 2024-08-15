"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegistrationData, registrationSchema } from "@/lib/schemas/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, SVGProps, useState } from "react";
import { z } from "zod";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function credentialSignUp(formData: FormData) {
    setError(null); // Clear any previous errors

    const rawData: RegistrationData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirm-password") as string,
    };

    if (rawData.password !== rawData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Validate the form data
      const validatedData = registrationSchema.parse(rawData);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // Registration successful
      router.push(`/dashboard/${validatedData.username}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        setError(error.errors.map((err) => err.message).join(", "));
      } else if (error instanceof Error) {
        // Handle other errors
        setError(error.message);
      } else {
        // Fallback error message
        setError("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-primary-foreground">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg bg-background shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center">
            Register for FlashAI
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline"
              prefetch={false}
            >
              Sign in
            </Link>
          </p>
        </div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            credentialSignUp(new FormData(e.currentTarget));
          }}
        >
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>
        <div>
          <Button variant="outline" className="w-full">
            <GithubIcon className="w-5 h-5 mr-2" />
            Register with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}

function GithubIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
