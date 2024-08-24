"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import FlashCard from "./Flashcard/Flashcard";
import NoFlashCards from "./Flashcard/NoFlashCard";
import toast from "react-hot-toast";

interface Flashcard {
  front: string;
  back: string;
}

export const InputFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateFlashcards = async () => {
    setIsLoading(true);
    toast.loading("Generating flashcards...", { id: "generateToast" });

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
      toast.success("Flashcards generated successfully!", {
        id: "generateToast",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred", {
        id: "generateToast",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveFlashcards = async () => {
    setIsSaving(true);
    toast.loading("Saving flashcards...", { id: "saveToast" });

    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: inputText,
          flashcards: flashcards,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save flashcards");
      }

      toast.success(`Flashcards saved successfully`, { id: "saveToast" });
      window.dispatchEvent(new Event("refetchFlashcardTopics"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An error occurred while saving",
        { id: "saveToast" }
      );
    } finally {
      setIsSaving(false);
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
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-blue-300"
            onClick={generateFlashcards}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? "Generating..." : "Generate Flashcards"}
          </button>
          {flashcards.length > 0 && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-green-300"
              onClick={saveFlashcards}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Flashcards"}
            </button>
          )}
        </div>

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
