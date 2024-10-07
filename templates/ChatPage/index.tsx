"use client";

import Layout from "@/components/Layout";
import Chat from "@/components/Chat";

interface ChatPageProps {
  chatId?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ chatId }) => {
  return (
    <Layout title="CVS AI" showTitle={false} showNavActionButton={false}>
      <Chat chatId={chatId} />
    </Layout>
  );
};

export default ChatPage;
