import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const supabase = createServerClient();

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { data, message: "User created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}
