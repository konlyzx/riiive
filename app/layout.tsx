import type { Metadata } from "next";
import { Anton, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/lenis-provider";
import { AuthSessionProvider } from "@/components/session-provider";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const roboto = Roboto({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Riiive - Get Honest Feedback on Your Portfolio",
  description: "Analyze your portfolio with AI-powered feedback. Get performance scores, design critiques, and actionable improvements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={anton.variable} suppressHydrationWarning>
      <body className="min-h-full antialiased font-anton">
        <AuthSessionProvider>
          <ThemeProvider>
            <LenisProvider>
              {children}
            </LenisProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
