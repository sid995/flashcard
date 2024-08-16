"use client";

import { useState } from "react";

export default function FlashCard({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-md p-4 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="font-bold">{isFlipped ? "Answer:" : "Question:"}</div>
      <div className="mt-2">{isFlipped ? answer : question}</div>
    </div>
  );
}
