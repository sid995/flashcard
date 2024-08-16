// File: /app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:
   1. Create clear and concise questions for the front of the flashcard.
   2. Provide accurate and informative answers for the back of the flashcard.
   3. Ensure that each flashcard focuses on a single concept or piece of information.
   4. Use simple language to make the flashcards accessible to a wide range of learners.
   5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
   6. Avoid overly complex or ambigious phrasing in both questions and answers.
   7. When appropriate, use mnemonics or memory aids to help reinforce the information.
   8. Tailor the difficulty level of the flashcards to the user's specified preferences.
   9. If given a body of text, extract the most important and relevant information for the flashcards.
   10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
 Remember, the goal is to facilitate effective learning and retention of information through these flashcards. Return in the following JSON format { "flashcards": [{ "front": str, "back": str }] }`;

export async function POST(req: NextRequest) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user data
  const { data: userData, error: userError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  console.log(userData);

  console.log("after getting user data from supabase");

  if (userError || !userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.log("after userError");

  // Parse request body
  const { topic } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  try {
    // Generate flashcards using Claude
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate flashcards for the following topic: ${topic}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log(response.choices);

    const flashcards = JSON.parse(
      response.choices[0].message.content || '{"flashcards": []}'
    );

    // You might want to save the generated flashcards to your database here

    return NextResponse.json(flashcards, { status: 200 });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
