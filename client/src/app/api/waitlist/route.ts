import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/schemas/waitlist";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = waitlistSchema.parse(body);

    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ name, email }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Successfully joined waitlist", data },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
