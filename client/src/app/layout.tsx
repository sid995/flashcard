import { Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

const fontHeading = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Flashcard AI",
  description: "Learn Anything with AI-Powered Flashcards",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body
          className={cn("antialiased", fontHeading.variable, fontBody.variable)}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
