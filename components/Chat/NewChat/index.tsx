import React, { useState, useEffect } from "react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { variantsChat } from "@/mocks/variantsChat";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserData } from "@/utils/firebaseUtils";
import { useRouter } from "next/navigation";
import UploadCard from "@/components/Chat/UploadCard";

type NewChatProps = {
  onNewChat: (initialQuestion?: string) => Promise<string | undefined>;
  onUploadComplete: (
    chatId: string,
    messageId: string,
    content: string
  ) => Promise<void>;
};

const NewChat: React.FC<NewChatProps> = ({ onNewChat, onUploadComplete }) => {
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user.uid);
        if (userData) {
          setUserName(userData.firstName || "");
        }
      }
    });

    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 2 && currentHour < 12) {
        setGreeting("Good morning");
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Good afternoon");
      } else if (currentHour >= 18 && currentHour < 23) {
        setGreeting("Good evening");
      } else {
        setGreeting("Happy late night");
      }
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000); // Update every minute

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const handleVariantClick = async (content: string) => {
    const newChatId = await onNewChat(content);
    if (newChatId) {
      router.push(`/chat/${newChatId}`);
    } else {
      console.error("Failed to create new chat");
    }
  };

  return (
    <div className="w-full my-auto px-12 2xl:px-6">
      <div className="mb-16 text-h2 text-theme-secondary 2xl:mb-8 2xl:text-h3 md:mb-4 md:text-h5">
        <span className="block text-theme-primary">
          {greeting} {userName},
        </span>{" "}
        How can I help you today?
      </div>
      <div className="flex overflow-x-auto overflow-y-hidden scrollbar-none scroll-smooth -mx-12 before:shrink-0 before:w-12 after:shrink-0 after:w-12 2xl:-mx-6 2xl:before:w-6 2xl:after:w-6">
        <UploadCard
          className="shrink-0 w-[50%] mr-4 group"
          onUploadComplete={onUploadComplete}
        />
        {variantsChat.map((variant) => (
          <div
            className="card-color group flex flex-col shrink-0 w-66 mr-4 p-8 rounded-[1.25rem] last:mr-0 md:p-4 cursor-pointer aspect-[3/2]"
            key={variant.id}
            onClick={() => handleVariantClick(variant.content)}
          >
            <div className="mb-2 text-title-1s">{variant.title}</div>
            <div className="mb-18 text-body-2s 2xl:mb-10 overflow-hidden">
              {variant.content}
            </div>
            <div className="card-icon-color relative inline-flex justify-center items-center w-10 h-10 mt-auto rounded-xl">
              <Image
                className="w-6 opacity-100 group-hover:opacity-0"
                src={variant.icon}
                width={24}
                height={24}
                alt=""
              />
              <Icon
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 fill-theme-white-fixed transition-opacity group-hover:opacity-100"
                name="arrow-up-right-thin"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChat;
