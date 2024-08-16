"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import FlashCard from "./Flashcard/Flashcard";
import NoFlashCards from "./Flashcard/NoFlashCard";

interface Flashcard {
  front: string;
  back: string;
}

export const InputFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFlashcards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data.flashcards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow py-8 px-5">
      <div className="max-w-3xl mx-auto space-y-6">
        <Textarea
          className="text-lg w-full bg-white border-gray-300 border rounded-md shadow-sm"
          placeholder="Type your text here to generate flashcards."
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-blue-300"
          onClick={generateFlashcards}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? "Generating..." : "Generate Flashcards"}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {flashcards.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Generated Flashcards:</h4>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              {flashcards.map((card, index) => (
                <FlashCard
                  key={index}
                  question={card.front}
                  answer={card.back}
                />
              ))}
            </div>
          </div>
        ) : (
          <NoFlashCards />
        )}
      </div>
    </main>
  );
};
