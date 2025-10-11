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
  title: "Fitness App",
  description: "Your personal fitness tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <nav className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold flex items-center space-x-2">
                <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-lg">💪</span>
                <span>FitnessZone</span>
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link href="/modules" className="hover:text-blue-200 transition-colors duration-200 flex items-center space-x-1">
                  <span>🏋️</span><span>Modules</span>
                </Link>
                <Link href="/groups" className="hover:text-blue-200 transition-colors duration-200 flex items-center space-x-1">
                  <span>👥</span><span>Groups</span>
                </Link>
                <Link href="/wall" className="hover:text-blue-200 transition-colors duration-200 flex items-center space-x-1">
                  <span>🏆</span><span>Wall of Fame</span>
                </Link>
                <Link href="/dashboard" className="hover:text-blue-200 transition-colors duration-200 flex items-center space-x-1">
                  <span>📊</span><span>Dashboard</span>
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
