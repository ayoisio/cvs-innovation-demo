import React, { createContext, useState, useContext, ReactNode } from "react";

type Mode = {
  id: string;
  title: string;
};

type ChatContextType = {
  isWaitingForAnswer: boolean;
  setIsWaitingForAnswer: (value: boolean) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const defaultMode: Mode = {
  id: "descriptive",
  title: "Descriptive",
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [mode, setMode] = useState<Mode>(defaultMode);

  return (
    <ChatContext.Provider
      value={{ isWaitingForAnswer, setIsWaitingForAnswer, mode, setMode }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
