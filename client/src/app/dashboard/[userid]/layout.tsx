import { defaultUrl } from "@/app/layout";
import { Sidebar } from "@/components/blocks/Sidebar";
import { createServerClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Generate Flashcards | Flashcard AI",
  description: "Learn Anything with AI-Powered Flashcards",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <Toaster position="top-right" />
      <main className="block h-screen">
        <div className="flex flex-row flex-1">
          <Sidebar user={user} />
          <section className="flex-1 bg-white">{children}</section>
        </div>
      </main>
    </>
  );
}
