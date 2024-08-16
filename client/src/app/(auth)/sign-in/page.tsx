"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from "@/lib/schemas/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, SVGProps, useState, FormEvent } from "react";
import { z } from "zod";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      // Validate the form data
      const validatedData = signInSchema.parse({ email, password });

      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      const {
        user: { id: userId },
      } = data;

      // Successful sign-in
      router.push(`/dashboard/${userId}`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        setError(err.errors.map((e) => e.message).join(", "));
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-primary-foreground">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg bg-background shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center">Sign in to FlashAI</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Or{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:underline"
            >
              register for an account
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center"></div>
          <div className="text-sm">
            <Link
              href="/forgotpassword"
              className="font-medium text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div> */}
        <div>
          <Button variant="outline" className="w-full">
            <GithubIcon className="w-5 h-5 mr-2" />
            Sign in with GitHub
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
