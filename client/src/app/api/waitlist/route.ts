import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/schemas/waitlist";
import { z } from "zod";

// Simple in-memory store for rate limiting
const rateLimitStore: { [key: string]: { count: number; timestamp: number } } =
  {};

// Rate limit: 5 requests per minute
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 1, timestamp: now };
    return false;
  }

  if (rateLimitStore[ip].timestamp < windowStart) {
    rateLimitStore[ip] = { count: 1, timestamp: now };
    return false;
  }

  rateLimitStore[ip].count++;
  return rateLimitStore[ip].count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? "127.0.0.1";

    // Check rate limit
    if (rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email } = waitlistSchema.parse(body);

    // Additional validation
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name is too long. Maximum 100 characters allowed." },
        { status: 400 }
      );
    }

    // Check for existing email
    const { data: existingUser } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    // Insert new waitlist entry
    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ name, email, ip }])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to join waitlist. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully joined waitlist", data },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
