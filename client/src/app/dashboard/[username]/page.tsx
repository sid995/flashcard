import { InputFlashcards } from "@/components/blocks/InputFlashcards";

export default function Page({ params }: { params: { username: string } }) {
  console.log(params.username);
  return (
    <div className="h-screen overflow-y-auto">
      <header className="border-b-gray-200 border-b h-auto px-8 py-4">
        <h3 className="text-xl font-semibold">Card Creation</h3>
      </header>
      <InputFlashcards />
    </div>
  );
}
