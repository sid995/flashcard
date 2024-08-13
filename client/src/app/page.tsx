"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { JSX, SVGProps, useState } from "react";
import { WaitlistFormData, waitlistSchema } from "@/lib/schemas/waitlist";
import { z } from "zod";

export default function Component() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function submitWaitlist(formData: FormData) {
    setIsSubmitting(true);
    setSubmitResult(null);

    const name = formData.get("name");
    const email = formData.get("email");

    try {
      const validatedData: WaitlistFormData = waitlistSchema.parse({
        name,
        email,
      });

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit");
      }

      const result = await response.json();
      setSubmitResult({ success: true, message: result.message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setSubmitResult({
          success: false,
          message: error.errors.map((e) => e.message).join(", "),
        });
      } else if (error instanceof Error) {
        setSubmitResult({ success: false, message: error.message });
      } else {
        setSubmitResult({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="/"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <BookIcon className="size-6" />
          <span className="text-xl ml-1">Flashcard AI</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 border-y">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1000px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:gap-16">
              <div className="sm:text-center flex flex-col items-center justify-center">
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Learn Anything with AI-Powered Flashcards
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our flashcard app uses advanced AI to generate personalized
                  flashcards for you to master any topic. Sign up now to be the
                  first to try it.
                </p>
                <div className="space-x-4 mt-6">
                  <Link href="#waitlist">
                    <Button size="lg" className="w-full sm:w-fit">
                      Join the Waitlist
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
          id="waitlist"
        >
          <div className="mx-auto container grid items-center justify-center gap-4 px-4 md:px-6">
            {submitResult && submitResult.success ? (
              <SuccessComponent message={submitResult.message} />
            ) : (
              <>
                <div className="space-y-3 sm:text-center">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Join the Waitlist
                  </h2>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Be the first to try our AI-powered flashcard app. Enter your
                    information below to join the waitlist.
                  </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitWaitlist(new FormData(e.currentTarget));
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" type="text" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Join Waitlist"}
                    </Button>
                  </form>
                  {submitResult && !submitResult.success && (
                    <p className="text-red-500 text-sm mt-2">
                      {submitResult.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Flashcard AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function SuccessComponent({ message }: { message: string }) {
  return (
    <div className="text-center">
      <div className="inline-block">
        <SuccessIcon className="w-16 h-16 mx-auto text-green-500" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">
        You're on the list!
      </h2>
      <p className="mt-2 text-lg text-gray-600">{message}</p>
      <p className="mt-4 text-sm text-gray-500">
        We'll keep you updated on our progress.
      </p>
    </div>
  );
}

function BookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function SuccessIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
