import React, { useState, useEffect } from "react";
import Image from "@/components/Image";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getCurrentUserId } from "@/utils/firebaseUtils";

type UploadedFile = {
  fileName: string;
  fileMimeType: string;
  messageId?: string;
};

type QuestionProps = {
  content?: string;
  userPhotoURL: string;
  uploadedFiles?: UploadedFile[];
  chatId: string;
  messageId: string;
  style?: React.CSSProperties;
};

const Question: React.FC<QuestionProps> = ({
  content,
  userPhotoURL,
  uploadedFiles,
  chatId,
  messageId,
  style,
}) => {
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserId().then(setUserId).catch(console.error);
  }, []);

  useEffect(() => {
    if (userId && uploadedFiles) {
      const storage = getStorage();
      const fetchUrls = async () => {
        const urls: { [key: string]: string } = {};
        for (const file of uploadedFiles) {
          try {
            const fileRef = ref(
              storage,
              `users/${userId}/chats/${chatId}/uploadedMedia/${messageId}/${file.fileName}`
            );
            const url = await getDownloadURL(fileRef);
            urls[file.fileName] = url;
          } catch (error) {
            console.error(`Error fetching URL for ${file.fileName}:`, error);
          }
        }
        setFileUrls(urls);
      };
      fetchUrls();
    }
  }, [userId, uploadedFiles, chatId, messageId]);

  const renderFile = (file: UploadedFile, index: number) => {
    const url = fileUrls[file.fileName];
    if (!url) return null;

    if (file.fileMimeType.startsWith("image/")) {
      return (
        <img
          src={url}
          alt={file.fileName}
          className="object-cover rounded-lg w-full h-full"
        />
      );
    } else if (file.fileMimeType.startsWith("video/")) {
      return (
        <video controls className="w-full h-full rounded-lg">
          <source src={url} type={file.fileMimeType} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (file.fileMimeType.startsWith("audio/")) {
      return (
        <audio controls className="w-full">
          <source src={url} type={file.fileMimeType} />
          Your browser does not support the audio tag.
        </audio>
      );
    } else {
      return (
        <div className="flex items-center justify-center bg-gray-200 rounded-lg p-4">
          <a
            href={url}
            download={file.fileName}
            className="text-blue-500 hover:underline"
          >
            {file.fileName}
          </a>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex" style={style}>
        <div className="shrink-0 mr-4">
          <Image
            className="w-8 h-8 rounded-full opacity-100"
            src={userPhotoURL}
            width={32}
            height={32}
            alt="User avatar"
          />
        </div>
        <div className="grow self-center text-body-1m text-theme-secondary">
          {content}
        </div>
      </div>
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="aspect-w-1 aspect-h-1">
              {renderFile(file, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Question;
