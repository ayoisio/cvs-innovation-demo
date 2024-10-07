// ChatTab.tsx
import React, { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import Lottie from "lottie-react";
import loadingDocumentsAnimation from "public/lotties/loadingBlueDocuments.json";
import {
  getCurrentUserId,
  createNewChat,
  getChatData,
  listenToChatChanges,
} from "@/utils/firebaseUtils";

interface ChatTabProps {
  documentsReviewId: string;
}

const ChatTab: React.FC<ChatTabProps> = ({ documentsReviewId }) => {
  const [chatExists, setChatExists] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatData, setChatData] = useState<any>(null);
  const [heightClass, setHeightClass] = useState("h-screen");
  const [chatTabHeight, setChatTabHeight] = useState("100vh");

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const currentUserId = await getCurrentUserId();
        setUserId(currentUserId);

        // Check if the chat exists
        const data = await getChatData(currentUserId, documentsReviewId);

        if (!data) {
          // If the chat doesn't exist, create a new one using the documentsReviewId as the chatId
          await createNewChat(
            currentUserId,
            `Initial message for documents review ${documentsReviewId}`,
            documentsReviewId
          );
          console.log(
            `Created new chat for documents review ${documentsReviewId}`
          );
        } else {
          setChatData(data);
        }

        setChatExists(true);
        setLoading(false);

        // If there's no initial chat data, set up a listener
        if (!data || data.messages.length === 0) {
          const unsubscribe = listenToChatChanges(
            currentUserId,
            documentsReviewId,
            (newData) => {
              if (newData.messages.length > 0) {
                setChatData(newData);
                // Remove the listener once we've detected messages
                unsubscribe();
              }
            }
          );

          // Clean up the listener when the component unmounts
          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        setLoading(false);
      }
    };

    initializeChat();
  }, [documentsReviewId]);

  useEffect(() => {
    if (chatData && chatData.messages && chatData.messages.length > 0) {
      setHeightClass("h-[calc(100vh)]");
      setChatTabHeight("calc(100vh)");
    } else {
      setHeightClass("h-screen");
      setChatTabHeight("100vh");
    }
  }, [chatData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Lottie
          animationData={loadingDocumentsAnimation}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

  if (!chatExists || !userId) {
    return <div>Error: Unable to initialize chat</div>;
  }

  return (
    <div className={`${heightClass} overflow-hidden`}>
      <Chat
        chatId={documentsReviewId}
        documentsReviewId={documentsReviewId}
        disableRedirect={true}
        hideHistory={true}
        updateStateInPlace={true}
        useFullWidth={true}
        firstMessageTopPadding={-16}
        chatTabHeight={chatTabHeight}
      />
    </div>
  );
};

export default ChatTab;
