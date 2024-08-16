"use client";

import Link from "next/link";
import { FlashcardTopic } from "../Sidebar";

export const FlashcardTopicList = ({
  userId,
  topics,
}: {
  userId: string;
  topics: FlashcardTopic[];
}) => {
  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 px-4">
      <h3 className="text-sm font-semibold mb-2">Recent Topics</h3>
      <ul className="space-y-1">
        {topics.map((topic) => (
          <li key={topic.id} className="text-sm">
            <Link
              href={`/dashboard/${userId}/topic/${topic.id}`}
              className="hover:underline"
            >
              {topic.topic}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
