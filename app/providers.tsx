"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { ChatProvider } from "@/components/Chat/ChatContext";
import theme from "./theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider>
        <ChatProvider>{children}</ChatProvider>
      </ChakraProvider>
    </>
  );
}
