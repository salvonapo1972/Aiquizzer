import type { Metadata } from "next";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Cinzel, Lora,Geist, Geist_Mono  } from "next/font/google";
import "./globals.css";
import QuizWidget from "./components/QuizWidget";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-title",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Canti Reginae Apostolorum alla Montagnola",
  description: "Canti Reginae Apostolorum alla Montagnola",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className={`${cinzel.variable} ${lora.variable}`}>
        <ClerkProvider>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <Show when="signed-out">
              <SignUpButton>
                <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
          <QuizWidget />
        </ClerkProvider>
      </body>
    </html>
  );
}