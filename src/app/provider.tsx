import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/services/auth/components/convex-client";

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
