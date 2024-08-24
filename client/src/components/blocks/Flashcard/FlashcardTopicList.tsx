"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface FlashcardTopic {
  id: string;
  topic: string;
}

interface FlashcardTopicListProps {
  supabase: any;
}

interface PayloadTypes {
  eventType: string;
  new: FlashcardTopic;
  old: { id: string };
}

export default function FlashcardTopicList({
  supabase,
}: FlashcardTopicListProps) {
  const { userid }: { userid: string } = useParams();

  const [topics, setTopics] = useState<FlashcardTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopics = async () => {
    if (!userid) {
      console.error("User ID is undefined or null");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("flashcard_topics")
        .select("id, topic")
        .eq("user_id", userid)
        .order("created_at", { ascending: false });

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Error fetching topics:", error);
        toast.error("Failed to fetch topics");
      } else if (data && data.length > 0) {
        console.log("Fetched topics:", data);
        setTopics(data);
      } else {
        console.log("No topics found for user ID:", userid);
        setTopics([]);
      }
    } catch (e) {
      console.error("Exception while fetching topics:", e);
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTopics().finally(() => setIsLoading(false));

    const channel = supabase.channel(`user-${userid}-flashcard-topics`);

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "flashcard_topics",
          filter: `user_id=eq.${userid}`,
        },
        (payload: PayloadTypes) => {
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

    // Add event listener for refetching topics
    const handleRefetchTopics = () => {
      setIsLoading(true);
      fetchTopics().finally(() => setIsLoading(false));
    };
    window.addEventListener("refetchFlashcardTopics", handleRefetchTopics);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("refetchFlashcardTopics", handleRefetchTopics);
    };
  }, [userid, supabase]);

  if (isLoading) {
    return <div>Loading topics...</div>;
  }

  if (topics.length === 0) {
    return <div>No flashcard topics found.</div>;
  }

  return (
    <div className="mt-4 px-4">
      <h3 className="text-sm font-semibold mb-2">Recent Topics</h3>
      <ul className="space-y-1">
        {topics.map((topic) => (
          <li key={topic.id} className="text-sm">
            <Link
              href={`/dashboard/${userid}/topic/${topic.id}`}
              className="hover:underline"
            >
              {topic.topic}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
