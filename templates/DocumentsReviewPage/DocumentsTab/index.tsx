import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface UploadedFile {
  fileName: string;
  fileMimeType: string;
  downloadUrl?: string;
  storagePath?: string;
}

interface DocumentsTabProps {
  userId: string;
  chatId: string;
  uploadedFiles: (UploadedFile & { messageId: string })[];
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  userId,
  chatId,
  uploadedFiles,
}) => {
  const [files, setFiles] = useState<(UploadedFile & { messageId: string })[]>(
    []
  );

  useEffect(() => {
    console.log("DocumentsTab rendered with:");
    console.log("userId:", userId);
    console.log("chatId:", chatId);
    console.log("uploadedFiles:", uploadedFiles);

    const fetchDownloadUrls = async () => {
      console.log("Fetching download URLs...");
      const storage = getStorage();
      const updatedFiles = await Promise.all(
        uploadedFiles.map(async (file) => {
          if (!file.downloadUrl && file.storagePath) {
            try {
              console.log(`Fetching download URL for file: ${file.fileName}`);
              const downloadUrl = await getDownloadURL(
                ref(storage, file.storagePath)
              );
              console.log(
                `Download URL fetched for ${file.fileName}: ${downloadUrl}`
              );
              return { ...file, downloadUrl };
            } catch (error) {
              console.error(
                `Error fetching download URL for ${file.fileName}:`,
                error
              );
              return file;
            }
          }
          return file;
        })
      );
      console.log("Updated files with download URLs:", updatedFiles);
      setFiles(updatedFiles);
    };

    fetchDownloadUrls();
  }, [uploadedFiles, userId, chatId]);

  useEffect(() => {
    console.log("Files state updated:", files);
  }, [files]);

  if (files.length === 0) {
    console.log("Rendering: No Documents Loaded");
    return <div>No Documents Loaded</div>;
  }

  console.log("Rendering document list");
  return (
    <div>
      {files.map((file, index) => {
        console.log(`Rendering file ${index + 1}:`, file);
        return (
          <div key={index}>
            <h3>{file.fileName}</h3>
            {file.fileMimeType === "application/pdf" ? (
              <iframe
                src={file.downloadUrl}
                width="100%"
                height="500px"
                title={file.fileName}
              />
            ) : file.fileMimeType.startsWith("image/") ? (
              <img src={file.downloadUrl} alt={file.fileName} />
            ) : (
              <p>Unsupported file type: {file.fileMimeType}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DocumentsTab;
