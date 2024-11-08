import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db, getCurrentUserId } from "@/utils/firebaseUtils";
import Icon from "@/components/Icon";
import Image from "@/components/Image";

type HistoryProps = {
  visible: boolean;
  onClose: () => void;
  onNewChat: () => void;
  currentChatId?: string;
  currentChatTitle?: string | null;
  lastMessage?: string;
};

type ChatHistoryItem = {
  id: string;
  title?: string;
  lastMessage?: string;
  createdAt: Date;
  image?: string;
};

const History: React.FC<HistoryProps> = ({
  visible,
  onClose,
  onNewChat,
  currentChatId,
  currentChatTitle,
  lastMessage,
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserId()
      .then(setUserId)
      .catch((error) => console.error("Failed to get user ID:", error));
  }, []);

  useEffect(() => {
    if (userId) {
      const q = query(
        collection(db, `users/${userId}/chats`),
        orderBy("updatedAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log("History snapshot updated");
        const chatHistory: ChatHistoryItem[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Chat history item:", doc.id, data);
          return {
            id: doc.id,
            title: data.title || "Untitled Chat",
            lastMessage: data.lastMessage || "No messages yet",
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            image: data.image,
          };
        });
        setHistory(chatHistory);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  useEffect(() => {
    if (currentChatId && (currentChatTitle || lastMessage)) {
      setHistory((prevHistory) =>
        prevHistory.map((item) =>
          item.id === currentChatId
            ? {
                ...item,
                title: currentChatTitle || item.title,
                lastMessage: lastMessage || item.lastMessage,
              }
            : item
        )
      );
    }
  }, [currentChatId, currentChatTitle, lastMessage]);

  const filteredHistory = history.filter((item) => {
    const title = item.title || "";
    const lastMessage = item.lastMessage || "";
    const searchLower = search.toLowerCase();

    return (
      title.toLowerCase().includes(searchLower) ||
      lastMessage.toLowerCase().includes(searchLower)
    );
  });

  const handleChatClick = (chatId: string) => {
    setActiveId(chatId);
    router.push(`/chat/${chatId}`);
  };

  return (
    <div
      className={`relative shrink-0 w-[21.25rem] ml-2 pt-16 pb-24 bg-theme-on-surface-1 rounded-2xl 2xl:w-80 xl:absolute xl:top-0 xl:right-0 xl:bottom-0 xl:w-[21rem] xl:border-l xl:border-theme-stroke xl:rounded-none xl:transition-all md:w-full md:border-l-0 ${
        visible ? "xl:translate-x-0 xl:shadow-depth-1" : "xl:translate-x-full"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 shadow-[inset_0_-0.0625rem_0_0_#EFEFEF] dark:shadow-[inset_0_-0.0625rem_0_0_#272b30] xl:flex xl:pr-3">
        <div className="relative xl:grow">
          <input
            className="w-full h-16 pl-14 pr-4 bg-transparent text-base-1s text-theme-primary outline-none placeholder:text-theme-tertiary md:text-[1rem]"
            type="text"
            placeholder="Search for chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
          <div className="absolute top-1/2 left-4 flex justify-center items-center w-9 h-9 -translate-y-1/2">
            <Icon className="fill-theme-tertiary" name="search" />
          </div>
        </div>
        <button
          className="hidden relative w-6 h-6 shrink-0 self-center text-0 before:absolute before:inset-0.5 before:border-2 before:border-theme-secondary before:opacity-40 before:rounded-md xl:inline-block"
          onClick={onClose}
        >
          <Icon className="fill-theme-secondary" name="arrow-right-fat" />
        </button>
      </div>
      <div className="max-h-full pt-3 px-3 overflow-auto scrollbar-none scroll-smooth">
        <div className="space-y-2 md:space-y-0">
          {filteredHistory.map((item) => (
            <div
              className={`flex items-center p-3 border border-transparent rounded-xl transition-all cursor-pointer tap-highlight-color hover:bg-theme-n-8 ${
                activeId === item.id
                  ? "!border-theme-stroke shadow-[0_0_0.875rem_-0.25rem_rgba(0,0,0,0.05),0_2rem_3rem_-0.5rem_rgba(0,0,0,0.05)] !bg-transparent"
                  : ""
              }`}
              key={item.id}
              onClick={() => handleChatClick(item.id)}
            >
              <div className="grow">
                <div className="text-base-2 line-clamp-1">{item.title}</div>
                <div className="mt-1 text-[0.75rem] leading-[1rem] font-medium text-theme-secondary line-clamp-2">
                  {item.lastMessage}
                </div>
              </div>
              {item.image && (
                <div className="shrink-0 ml-3">
                  <Image
                    className="w-16 h-16 rounded-xl object-cover"
                    src={item.image}
                    width={64}
                    height={64}
                    alt=""
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-0 p-6">
        <button className="btn-secondary w-full" onClick={onNewChat}>
          New chat
        </button>
      </div>
    </div>
  );
};

export default History;
