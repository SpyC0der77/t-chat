import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/services/auth/components/convex-client";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "T3 Chat - The Best AI Assistant & ChatGPT Alternative | $0/month",
  description: "Get access to premium AI models including GPT-4, Claude, DeepSeek, Gemini and more for free. Nearly unlimited tier is only $0/month! Experience the best AI models in the best AI chat app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} antialiased selection:bg-primary selection:text-white [font-feature-settings:'ss05'_on]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
