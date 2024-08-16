"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  // FileUp,
  LogOut,
  BookIcon,
  // ArrowRightToLine,
  // ArrowLeftToLine,
  Brain,
  // History,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FlashcardTopicList } from "./Flashcard/FlashcardTopicList";
import { toast } from "react-hot-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { createClient } from "@/utils/supabase/client";

export interface FlashcardTopic {
  id: string;
  topic: string;
}

export const Sidebar = () => {
  const { userid }: { userid: string } = useParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [topics, setTopics] = useState<FlashcardTopic[]>([]);
  // const supabase = useSupabase();
  const supabase = createClient();

  // const toggleSidebar = () => {
  //   setIsExpanded(!isExpanded);
  // };

  const logoutHandler = async () => {
    const response = await supabase.auth.signOut();
    if (response.error) {
      toast.error(response.error.message);
      return;
    }
    router.replace("/sign-in");
  };

  useEffect(() => {
    const fetchTopics = async () => {
      console.log("Fetching topics for user ID:", userid);

      if (!userid) {
        console.error("User ID is undefined or null");
        return;
      }

      try {
        const {
          data: sessionData,
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log(sessionData);

        if (sessionError) {
          console.error("Error getting session:", sessionError);
          toast.error("Failed to authenticate user");
          return;
        }

        if (!session) {
          console.error("User is not authenticated");
          toast.error("User is not authenticated");
          // router.push("/sign-in");
          return;
        }

        const { data, error } = await supabase
          .from("flashcard_topics")
          .select("id, topic")
          .eq("user_id", userid)
          .order("created_at", { ascending: false });

        console.log("Supabase response:", { data, error });

        if (error) {
          console.error("Error fetching topics:", error);
        } else if (data && data.length > 0) {
          console.log("Fetched topics:", data);
          setTopics(data);
        } else {
          console.log("No topics found for user ID:", userid);
        }
      } catch (e) {
        console.error("Exception while fetching topics:", e);
      }
    };

    fetchTopics();

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
  }, [supabase]);

  return (
    <nav
      className={cn(
        "flex flex-col h-screen bg-background border-r-gray-200 border-r transition-all duration-300 ease-in-out",
        {
          "w-[240px]": isExpanded,
          "w-[60px]": !isExpanded,
        }
      )}
    >
      <div
        className={cn("flex", {
          "justify-center": isExpanded,
          "justify-start": !isExpanded,
        })}
      >
        {/* <div
          onClick={toggleSidebar}
          className={cn(
            "hover:bg-muted cursor-pointer mt-4 flex items-center",
            {
              "rounded-full py-2 px-8": isExpanded,
              "p-4 w-full": !isExpanded,
            }
          )}
        >
          {isExpanded ? (
            <ArrowLeftToLine size={20} />
          ) : (
            <ArrowRightToLine size={20} />
          )}
          {isExpanded && (
            <span className="text-lg font-bold pl-2">Collapse</span>
          )}
        </div> */}
      </div>
      <div className="flex items-center p-4">
        <BookIcon className="size-6" />
        <h3 className={cn("text-xl font-bold pl-2", { hidden: !isExpanded })}>
          FlashcardAI
        </h3>
      </div>

      <div className="flex flex-col flex-1 mt-8">
        <NavItem
          icon={<Brain size={24} />}
          text="Generate"
          isExpanded={isExpanded}
          href={`/dashboard/${userid}`}
        />
        <FlashcardTopicList userId={userid} topics={topics} />
        {/* <NavItem
          icon={<History size={24} />}
          text="Previous Flashcards"
          isExpanded={isExpanded}
          href={`/dashboard${userid}/history`}
        /> */}
        {/* <NavItem
          icon={<FileUp size={24} />}
          text="Upload a PDF"
          isExpanded={isExpanded}
        /> */}
      </div>

      <div className="p-4">
        <SignOut
          onClick={logoutHandler}
          icon={<LogOut size={24} />}
          text="Sign Out"
          isExpanded={isExpanded}
        />
      </div>
    </nav>
  );
};

const SignOut = ({
  icon,
  text,
  isExpanded,
  onClick = undefined,
}: {
  icon: any;
  text: string;
  isExpanded: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center p-4 text-gray-700 hover:bg-muted transition-colors duration-200 whitespace-nowrap overflow-hidden"
    >
      <span className="mr-4">{icon}</span>
      {isExpanded && <span>{text}</span>}
    </div>
  );
};

const NavItem = ({
  icon,
  text,
  isExpanded,
  href = "#",
}: {
  icon: any;
  text: string;
  isExpanded: boolean;
  href?: string;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center p-4 text-gray-700 hover:bg-muted transition-colors duration-200 whitespace-nowrap overflow-hidden"
    >
      <span className="mr-4">{icon}</span>
      {isExpanded && <span>{text}</span>}
    </Link>
  );
};

export default Sidebar;
