import { InputFlashcards } from "@/components/blocks/InputFlashcards";
import { isUUID } from "@/utils/misc/uuid-check";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function getUserData(userid: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userid)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("User not found");
  }

  return data;
}

export default async function Page({ params }: { params: { userid: string } }) {
  let user;
  try {
    user = await getUserData(params.userid);
  } catch (error) {
    redirect("/sign-in");
  }

  return (
    <div className="h-screen overflow-y-auto">
      <header className="border-b-gray-200 border-b h-auto px-8 py-4">
        <h3 className="text-xl font-semibold">Card Creation</h3>
      </header>
      <InputFlashcards />
    </div>
  );
}
