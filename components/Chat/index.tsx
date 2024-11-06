import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useColorMode } from "@chakra-ui/react";
import Message, { MessageType } from "@/components/Message";
import Icon from "@/components/Icon";
import NewChat from "./NewChat";
import { UploadedFile } from "@/components/Chat/UploadCard";
import History from "./History";
import Question from "@/components/Chat/Question";
import Answer from "@/components/Chat/Answer";
import { useChatContext } from "./ChatContext";
import Lottie from "lottie-react";
import Select from "@/components/Select";
import circleAnimation from "public/lotties/circlesLoading.json";
import {
  getCurrentUserId,
  createNewChat,
  addMessageToChat,
  getChatData,
  getUserData,
  getAuthToken,
  getChatTitle,
  updateChatTitle,
  listenToChatChanges,
} from "@/utils/firebaseUtils";

const modes = [
  {
    id: "descriptive",
    title: "Descriptive",
  },
  {
    id: "marketing",
    title: "Marketing",
  },
  {
    id: "plain",
    title: "Plain",
  },
  {
    id: "scientific",
    title: "Scientific",
  },
];

type ChatProps = {
  chatId?: string;
  documentsReviewId?: string;
  disableRedirect?: boolean;
  hideHistory?: boolean;
  updateStateInPlace?: boolean;
  useFullWidth?: boolean;
  firstMessageTopPadding?: number;
  chatTabHeight?: string;
};

const Chat: React.FC<ChatProps> = ({
  chatId,
  documentsReviewId,
  disableRedirect = false,
  hideHistory = false,
  updateStateInPlace = false,
  useFullWidth = false,
  firstMessageTopPadding = 0,
  chatTabHeight,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { colorMode } = useColorMode();

  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPhotoURL, setUserPhotoURL] = useState(
    "/images/light-blue-circle.png"
  );
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatTitle, setChatTitle] = useState<string | null>(null);
  const { isWaitingForAnswer, setIsWaitingForAnswer, mode, setMode } =
    useChatContext();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getCurrentUserId()
      .then(async (uid) => {
        setUserId(uid);
        const userData = await getUserData(uid);
        if (userData) {
          setUserPhotoURL(userData.photoURL || "/images/light-blue-circle.png");
        }
      })
      .catch((error) => console.error("Failed to get user ID:", error));
  }, []);

  useEffect(() => {
    const loadChatData = async () => {
      if (chatId && userId) {
        console.log(`Loading chat data for chat ${chatId}`);
        try {
          const chatData = await getChatData(userId, chatId);
          console.log("Loaded chat data:", chatData);
          if (chatData) {
            setChatTitle(chatData.title);
            setMessages(chatData.messages);
            setIsWaitingForAnswer(chatData.status === "processing");
            setIsNewChat(chatData.messages.length === 0);

            // Check if there's a stored mode and update the state if it exists
            if (chatData.mode) {
              const storedMode = modes.find((m) => m.id === chatData.mode);
              if (storedMode) {
                setMode(storedMode);
              }
            }
          } else {
            setIsNewChat(true);
            setChatTitle("New Chat");
            setMessages([]);
          }
        } catch (error) {
          console.error("Error loading chat data:", error);
          setIsNewChat(true);
          setChatTitle("New Chat");
          setMessages([]);
        }
      }
    };
    loadChatData();

    if (userId && chatId) {
      console.log("Setting up listener for chat:", chatId);
      const unsubscribe = listenToChatChanges(userId, chatId, (data) => {
        console.log("Received chat update:", data);
        if (data.title) {
          setChatTitle(data.title);
        }
        if (data.messages && Array.isArray(data.messages)) {
          console.log("Updating messages:", data.messages);
          setMessages(data.messages);
        }
        setIsWaitingForAnswer(data.status === "processing");

        // Check if there's an updated mode and update the state if it exists
        if (data.mode) {
          const updatedMode = modes.find((m) => m.id === data.mode);
          if (updatedMode) {
            setMode(updatedMode);
          }
        }
      });
      return () => {
        console.log("Unsubscribing from chat:", chatId);
        unsubscribe();
      };
    }
  }, [chatId, userId, setMode, setIsWaitingForAnswer]);

  useEffect(() => {
    console.log("Messages state updated:", messages);
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsNewChat(true);
  }, [chatId]);

  const handleUploadComplete = useCallback(
    async (newChatId: string, messageId: string, content: string) => {
      if (userId) {
        await processMessage(content, newChatId, userId, messageId);
      }
    },
    [userId]
  );

  const processMessage = async (
    messageText: string,
    chatId: string,
    userId: string,
    messageId: string
  ) => {
    try {
      const authToken = await getAuthToken();
      const response = await fetch(`${process.env.CLOUD_RUN_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          chatId,
          text: messageText,
          userId,
          messageId,
          styleMode: mode.id,
          documentsReviewId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API Response:", data);
      return data.status === "processing" ? null : data;
    } catch (error) {
      console.error("Error processing message:", error);
      throw error;
    }
  };

  const handleMessageSubmit = useCallback(
    async (
      messageText: string,
      uploadedFiles: UploadedFile[]
    ): Promise<boolean> => {
      if (!userId) {
        console.error("User ID is not available");
        return false;
      }

      if (messageText.trim() || uploadedFiles.length > 0) {
        setIsSubmitting(true);
        setIsWaitingForAnswer(true);

        try {
          let currentChatId = chatId;
          const isNewChat = !currentChatId;

          if (isNewChat) {
            currentChatId = await createNewChat(userId, messageText);
          }

          if (!currentChatId) {
            throw new Error("Failed to create or retrieve chat ID");
          }

          const messageData = {
            content: messageText,
            type: "question" as const,
            timestamp: new Date(),
          };

          const messageId = await addMessageToChat(
            userId,
            currentChatId,
            messageData,
            uploadedFiles
          );

          const newMessage: MessageType = {
            id: messageId,
            ...messageData,
            uploadedFiles: uploadedFiles,
          };

          if (isNewChat) {
            const title = await getChatTitle(currentChatId, messageText);
            await updateChatTitle(userId, currentChatId, title);
            if (!disableRedirect) {
              router.push(`/chat/${currentChatId}`);
            }
          } else {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }

          scrollToBottom();

          if (updateStateInPlace) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }

          // Process the message
          await processMessage(messageText, currentChatId, userId, messageId);

          return true;
        } catch (error) {
          console.error("Failed to process message:", error);
          return false;
        } finally {
          setIsSubmitting(false);
        }
      }
      return false;
    },
    [
      userId,
      chatId,
      router,
      setMessages,
      scrollToBottom,
      setIsWaitingForAnswer,
      mode.id,
    ]
  );

  const handleNewChat = async (
    initialQuestion?: string,
    initialFiles: UploadedFile[] = []
  ): Promise<string | undefined> => {
    if (userId) {
      const newChatId = await createNewChat(userId);
      setIsNewChat(true);
      setChatTitle("New Chat");
      setMessages([]);

      if (initialQuestion || initialFiles.length > 0) {
        const messageData = {
          content: initialQuestion || "",
          type: "question" as const,
          timestamp: new Date(),
        };

        const messageId = await addMessageToChat(
          userId,
          newChatId,
          messageData,
          initialFiles
        );

        const newMessage: MessageType = {
          id: messageId,
          ...messageData,
          uploadedFiles: initialFiles,
        };

        setMessages([newMessage]);
        setIsWaitingForAnswer(true);

        const title = await getChatTitle(newChatId, initialQuestion || "");
        await updateChatTitle(userId, newChatId, title);
        setChatTitle(title);

        // Process the message
        await processMessage(
          initialQuestion || "",
          newChatId,
          userId,
          messageId
        );
      }

      // Navigate to the new chat
      if (!disableRedirect) {
        router.push(`/chat/${newChatId}`);
      }

      return newChatId;
    }
    return undefined;
  };

  const handleBackClick = () => {
    if (pathname !== "/") {
      router.back();
    } else if (!pathname.startsWith("/chat/")) {
      router.push("/");
    } else {
      router.push("/");
    }
  };

  const getHeightClass = () => {
    if (chatTabHeight) {
      return `h-[${chatTabHeight}]`;
    }
    return "h-[calc(102vh-8.67rem)] md:h-[calc(102vh-11.22rem)]";
  };

  const getWidthClass = () => {
    if (useFullWidth) {
      return "w-full";
    }
    return "w-[calc(120%-26.1rem)] 2xl:w-[calc(120%-24.6rem)] xl:w-full";
  };

  return (
    <div
      className={`relative flex ${getHeightClass()} xl:overflow-hidden xl:rounded-2xl md:-mb-2`}
    >
      <div className={`card flex flex-col ${getWidthClass()}`}>
        <div className="flex mb-6 md:mb-4 items-center">
          {!disableRedirect && (
            <button
              className="w-8 h-8 flex items-center justify-center"
              onClick={handleBackClick}
            >
              <Icon className="fill-theme-secondary" name="arrow-left" />
            </button>
          )}
          <Select
            className="min-w-[8.5rem] ml-auto"
            value={mode}
            onChange={setMode}
            items={modes}
          />
          {!hideHistory && (
            <button
              className="hidden relative w-6 h-6 shrink-0 ml-auto self-center text-0 before:absolute before:inset-0.5 before:border-2 before:border-theme-secondary before:opacity-40 before:rounded-md xl:inline-block"
              onClick={() => setVisible(true)}
            >
              <Icon
                className="fill-theme-secondary rotate-180"
                name="arrow-right-fat"
              />
            </button>
          )}
        </div>
        <div className="flex grow overflow-auto -mx-6" ref={chatContainerRef}>
          <div className="w-full px-12 py-4 space-y-6 3xl:px-6 3xl:py-0">
            {chatId ? (
              <>
                {messages.map((msg, index) => (
                  <React.Fragment key={msg.id}>
                    {msg.type === "question" && (
                      <Question
                        content={msg.content}
                        userPhotoURL={userPhotoURL}
                        uploadedFiles={msg.uploadedFiles}
                        chatId={chatId}
                        messageId={msg.id}
                        style={
                          index === 0
                            ? { marginTop: firstMessageTopPadding }
                            : {}
                        }
                      />
                    )}
                    {msg.type === "answer" && (
                      <Answer
                        content={msg.content}
                        image={
                          colorMode === "dark"
                            ? "/images/logo-light.png"
                            : "/images/logo-dark.png"
                        }
                        style={
                          index === 0
                            ? { marginTop: firstMessageTopPadding }
                            : {}
                        }
                      />
                    )}
                  </React.Fragment>
                ))}
                {isWaitingForAnswer && (
                  <div className="flex justify-center mt-4">
                    <Lottie
                      animationData={circleAnimation}
                      loop={true}
                      style={{ width: 70, height: 70 }}
                    />
                  </div>
                )}
              </>
            ) : (
              <NewChat
                onNewChat={handleNewChat}
                onUploadComplete={handleUploadComplete}
              />
            )}
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <Message
            className="shrink-0 mt-6 md:mt-4"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setMessage(e.target.value)
            }
            autoFocus
            onSubmit={async (messageText, uploadedFiles) => {
              if (!chatId) {
                // If there's no chatId, we're creating a new chat
                await handleNewChat(messageText, uploadedFiles);
              } else {
                // If there's a chatId, we're in an existing chat
                await handleMessageSubmit(messageText, uploadedFiles);
              }
              return true;
            }}
            isSubmitting={isSubmitting}
            placeholder="Ask CVS AI anything"
          />
        </form>
      </div>
      {!hideHistory && (
        <History
          visible={visible}
          onClose={() => setVisible(false)}
          onNewChat={handleNewChat}
          currentChatId={chatId}
          currentChatTitle={chatTitle}
          lastMessage={messages[messages.length - 1]?.content}
        />
      )}
    </div>
  );
};

export default Chat;
