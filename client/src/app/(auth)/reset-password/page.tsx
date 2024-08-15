"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  const params = useSearchParams();
  const verificationCode = params.get("verificationCode");

  useEffect(() => {
    if (!verificationCode) {
      setError("Invalid verification code");
    }
  }, [verificationCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      // Here you would typically call your API to reset the password
      // using the verification code and new password
      // For this example, we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If the reset is successful:
      setIsResetSuccessful(true);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  if (!verificationCode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-red-500">Invalid verification code</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-primary-foreground">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg bg-background shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center">Reset Password</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Enter your new password below
          </p>
        </div>
        {!isResetSuccessful ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
            <p className="text-lg font-semibold">Password Reset Successful!</p>
            <p className="text-muted-foreground">
              Your password has been successfully reset.
            </p>
            <Link href="/sign-in" passHref>
              <Button className="mt-4">Go to Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
