import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FlashcardTopic {
  id: string;
  topic: string;
}

export const FlashcardTopicList = ({ userId }: { userId: string }) => {
  const [topics, setTopics] = useState<FlashcardTopic[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial topics
    const fetchTopics = async () => {
      const { data, error } = await supabase
        .from("flashcard_topics")
        .select("id, topic")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      console.log("flachcard topics", data);

      if (error) {
        console.error("Error fetching topics:", error);
      } else {
        setTopics(data || []);
      }
    };

    fetchTopics();

    // Set up real-time subscription
    const channel = supabase.channel(`user-${userId}-flashcard-topics`);

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "flashcard_topics",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTopics((prev) => [payload.new as FlashcardTopic, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setTopics((prev) =>
              prev.filter((topic) => topic.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setTopics((prev) =>
              prev.map((topic) =>
                topic.id === payload.new.id
                  ? { ...topic, ...payload.new }
                  : topic
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

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
