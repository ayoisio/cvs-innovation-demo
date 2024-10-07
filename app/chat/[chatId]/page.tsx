import { NextPage } from "next";
import ChatPage from "@/templates/ChatPage";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

const DynamicChatPage: NextPage<ChatPageProps> = ({ params }) => {
  return <ChatPage chatId={params.chatId} />;
};

export default DynamicChatPage;
