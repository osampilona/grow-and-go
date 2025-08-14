"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

import { useLikeStore } from "@/stores/likeStore";
import { ENABLE_FAVORITES_SYNC } from "@/utils/featureFlags";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

const Providers = React.memo(function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const syncFromServer = useLikeStore((s) => s.syncFromServer);

  const navigate = React.useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  useEffect(() => {
    if (ENABLE_FAVORITES_SYNC) {
      // Hydrate favorites from backend (cookie-backed endpoint for now)
      syncFromServer();
    }
  }, [syncFromServer]);

  return (
    <HeroUIProvider navigate={navigate}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
});

export { Providers };
