import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitnessPro - Professional Fitness Tracking",
  description: "Professional fitness tracking and analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-xl font-bold flex items-center space-x-3 text-gray-900">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">F</span>
                </div>
                <span>FitnessPro</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/modules" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Programs
                </Link>
                <Link href="/exercises" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Exercises
                </Link>
                <Link href="/challenges" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Challenges
                </Link>
                <Link href="/leaderboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Leaderboard
                </Link>
                <Link href="/groups" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Groups
                </Link>
                <Link
                  href="/create-session"
                  className="ml-4 inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create Session
                </Link>
              </div>
              <div className="md:hidden flex items-center">
                <Link
                  href="/create-session"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
