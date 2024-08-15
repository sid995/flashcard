import { Sidebar } from "@/components/blocks/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="block h-screen">
      <div className="flex flex-row flex-1">
        <Sidebar />
        <section className="flex-1 bg-white">{children}</section>
      </div>
    </main>
  );
}
