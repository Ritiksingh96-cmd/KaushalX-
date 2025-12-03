"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes"; // 1. Import ThemeProvider
import { AI } from 'ai/rsc';
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // 2. Wrap everything in ThemeProvider
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <AI>
          {children}
        </AI>
      </SessionProvider>
    </ThemeProvider>
  );
}