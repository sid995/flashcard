import { createServerClient } from "@/utils/supabase/server";

export default async function Page({ params }: { params: { userid: string } }) {
  const supabase = createServerClient();
  const {} = await supabase.auth.getSession();
  return (
    <div>
      <div></div>
    </div>
  );
}
