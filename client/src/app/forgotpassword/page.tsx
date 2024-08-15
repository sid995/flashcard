"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call your API to send the reset email
    // For this example, we'll just simulate it with a timeout
    setTimeout(() => {
      setIsEmailSent(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-primary-foreground">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg bg-background shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center">Forgot Password</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>
        {!isEmailSent ? (
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
              <Button type="submit" className="w-full">
                Send Reset Email
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <PaperPlaneIcon className="w-16 h-16 mx-auto text-primary" />
            <p className="text-lg font-semibold">Email Sent!</p>
            <p className="text-muted-foreground">
              Check your inbox for password reset instructions.
            </p>
          </div>
        )}
        <div className="text-center">
          <Link
            href="/signin"
            className="font-medium text-primary hover:underline"
            prefetch={false}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

function PaperPlaneIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
