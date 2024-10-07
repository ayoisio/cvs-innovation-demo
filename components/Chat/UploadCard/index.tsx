import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Lottie from "lottie-react";
import blueCheckmarkLottie from "public/lotties/blueCheckmarkLottie.json";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
  createNewChat,
  addMessageToChat,
  getChatTitle,
  updateChatTitle,
} from "@/utils/firebaseUtils";

export type UploadedFile = {
  fileName: string;
  fileMimeType: string;
  preview?: string;
  file?: File;
  messageId?: string;
};

interface UploadCardProps {
  className?: string;
  onUploadComplete: (
    chatId: string,
    messageId: string,
    content: string
  ) => Promise<void>;
}

const UploadCard: React.FC<UploadCardProps> = ({
  className,
  onUploadComplete,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      setIsUploading(false);
      return;
    }

    try {
      const uploadedFiles: UploadedFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!isValidFileType(file.type)) {
          console.error("Invalid file type:", file.type);
          continue;
        }
        uploadedFiles.push({
          fileName: file.name,
          fileMimeType: file.type,
          file: file,
        });
      }

      if (uploadedFiles.length === 0) {
        console.error("No valid files to upload");
        setIsUploading(false);
        return;
      }

      // Create a new chat
      const newChatId = await createNewChat(user.uid);

      // Create a message for the uploaded files
      const messageContent =
        "Please find all medical claims and instances of imprecise language. Be thorough and complete.";

      const messageData = {
        content: messageContent,
        type: "question" as const,
        timestamp: new Date(),
      };

      const messageId = await addMessageToChat(
        user.uid,
        newChatId,
        messageData,
        uploadedFiles
      );

      // Generate and update chat title
      const chatTitle = await getChatTitle(newChatId, messageContent);
      await updateChatTitle(user.uid, newChatId, chatTitle);

      // Call the onUploadComplete function
      await onUploadComplete(newChatId, messageId, messageContent);

      setIsUploading(false);
      setShowCheckmark(true);
      setTimeout(() => {
        setShowCheckmark(false);
        router.push(`/documents-review/${newChatId}`);
      }, 1700);
    } catch (error) {
      console.error("Error uploading files:", error);
      setIsUploading(false);
    }
  };

  const isValidFileType = (mimeType: string) => {
    const validTypes = [
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];
    return validTypes.includes(mimeType);
  };
  return (
    <div className={`relative shrink-0 w-[50%] mr-4 aspect-[3/2] ${className}`}>
      <div className="absolute inset-0 rounded-[1.25rem] bg-theme-on-surface-2" />
      <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-r from-theme-on-surface-3 via-[#687aff] to-theme-on-surface-3 animate-gradient-x opacity-100 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
      <div className="absolute inset-[2px] rounded-[calc(1.25rem-2px)] bg-theme-on-surface-2 hover:bg-theme-on-surface-2-bg-hover overflow-hidden">
        <div
          className="relative flex flex-col items-center justify-center w-full h-full p-8 cursor-pointer transition-colors duration-200 ease-in-out"
          onClick={handleUpload}
        >
          {showCheckmark ? (
            <Lottie
              animationData={blueCheckmarkLottie}
              loop={false}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <>
              <Icon
                name="upload-file"
                className="w-10 h-10 mb-4 text-theme-secondary group-hover:text-[#0a84ff] transition-colors duration-200 ease-in-out"
                fill="currentColor"
              />
              <span className="text-theme-secondary group-hover:text-[#0a84ff] text-lg font-inter transition-colors duration-200 ease-in-out">
                {isUploading ? "Uploading..." : "Upload Document(s) for Review"}
              </span>
            </>
          )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
        accept=".txt,.docx,.pdf,.png,.jpg,.jpeg"
      />
    </div>
  );
};

export default UploadCard;
