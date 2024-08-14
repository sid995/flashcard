"use client";

import { Key, useState } from "react";
import { Textarea } from "../ui/textarea";
import FlashCard from "./Flashcard/Flashcard";
import NoFlashCards from "./Flashcard/NoFlashCard";

export const InputFlashcards = () => {
  const [flashcards, setFlashcards] = useState<any>([]);
  const [inputText, setInputText] = useState("");

  const generateFlashcards = () => {
    // This is where you'd implement the logic to generate flashcards
    // For now, we'll just add a dummy flashcard
    setFlashcards([
      ...flashcards,
      { question: "Sample Question", answer: "Sample Answer" },
    ]);
  };

  return (
    <main className="flex-grow py-8 px-5">
      <div className="max-w-3xl mx-auto space-y-6">
        <Textarea
          className="w-full bg-white border-gray-300 border rounded-md shadow-sm"
          placeholder="Type your text here to generate flashcards."
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={generateFlashcards}
        >
          Generate Flashcards
        </button>

        {flashcards.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Generated Flashcards:</h4>
            {flashcards.map(
              (card: { question: string; answer: string }, index: number) => (
                <FlashCard
                  key={index}
                  question={card.question}
                  answer={card.answer}
                />
              )
            )}
          </div>
        ) : (
          <NoFlashCards />
        )}
      </div>
    </main>
  );
};
