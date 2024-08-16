// File: /app/api/save-flashcards/route.ts
import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, flashcards } = await req.json();

  if (!topic || !Array.isArray(flashcards) || flashcards.length === 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    // Insert the topic
    const { data: topicData, error: topicError } = await supabase
      .from("flashcard_topics")
      .insert({ user_id: session.user.id, topic })
      .select()
      .single();

    if (topicError) throw topicError;

    // Insert the flashcards
    const { error: flashcardsError } = await supabase
      .from("user_flashcards")
      .insert(
        flashcards.map((card) => ({
          user_id: session.user.id,
          topic_id: topicData.id,
          front: card.front,
          back: card.back,
        }))
      );

    if (flashcardsError) throw flashcardsError;

    return NextResponse.json({ success: true, topicId: topicData.id });
  } catch (error) {
    console.error("Error saving flashcards:", error);
    return NextResponse.json(
      { error: "Failed to save flashcards" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const topicId = req.nextUrl.searchParams.get("topicId");

  if (!topicId) {
    return NextResponse.json(
      { error: "Topic ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the topic
    const { data: topicData, error: topicError } = await supabase
      .from("flashcard_topics")
      .select("*")
      .eq("id", topicId)
      .eq("user_id", session.user.id)
      .single();

    if (topicError) throw topicError;

    // Fetch the flashcards
    const { data: flashcardsData, error: flashcardsError } = await supabase
      .from("user_flashcards")
      .select("*")
      .eq("topic_id", topicId)
      .eq("user_id", session.user.id);

    if (flashcardsError) throw flashcardsError;

    return NextResponse.json({
      topic: topicData,
      flashcards: flashcardsData,
    });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}
