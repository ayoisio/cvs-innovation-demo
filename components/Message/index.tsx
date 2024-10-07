import React, { ChangeEventHandler, useRef, useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { UploadedFile } from "@/components/Chat/UploadCard";
import Icon from "@/components/Icon";
import dynamic from "next/dynamic";

export type MessageType = {
  id: string;
  content: string;
  type: "question" | "answer";
  timestamp: Date;
  uploadedFiles?: UploadedFile[];
};

type MessageProps = {
  className?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit: (
    messageText: string,
    uploadedFiles: UploadedFile[]
  ) => Promise<boolean>;
  isSubmitting: boolean;
};

const MessageComponent: React.FC<MessageProps> = ({
  className,
  value,
  onChange,
  placeholder,
  autoFocus,
  onSubmit,
  isSubmitting,
}) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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

  const filterValidFiles = (files: (UploadedFile | null)[]): UploadedFile[] => {
    return files.filter(
      (file): file is UploadedFile =>
        file !== null &&
        typeof file === "object" &&
        "fileName" in file &&
        "fileMimeType" in file
    );
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    const newUploadedFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        if (!isValidFileType(file.type)) {
          console.error("Invalid file type:", file.type);
          return null;
        }

        let preview: string;
        if (typeof window === "undefined") {
          preview = "/images/document-1.svg";
        } else if (file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file);
        } else if (file.type.startsWith("video/")) {
          preview = await generateVideoThumbnail(file);
        } else {
          preview = "/images/document-1.svg";
        }

        return {
          fileName: file.name,
          fileMimeType: file.type,
          preview,
          file,
        };
      })
    );

    setUploadedFiles((prevFiles) => [
      ...prevFiles,
      ...filterValidFiles(newUploadedFiles),
    ]);

    setIsUploading(false);
  };

  const generateVideoThumbnail = async (file: File): Promise<string> => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return "/images/document-1.svg"; // fallback image for server-side rendering
    }
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Set to 1 second to avoid black frames
        video.onseeked = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            resolve(canvas.toDataURL());
          } else {
            resolve("/images/document-1.svg");
          }
        };
      };
    });
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];

    if (index >= 0 && index < newFiles.length) {
      const file = newFiles[index];
      if (
        typeof window !== "undefined" &&
        file &&
        file.preview &&
        typeof file.preview === "string" &&
        !file.preview.startsWith("/")
      ) {
        URL.revokeObjectURL(file.preview);
      }
      newFiles.splice(index, 1);
      setUploadedFiles(newFiles);
    } else {
      console.error("Invalid index for file removal");
    }
  };

  const handleFilePreview = (file: File) => {
    if (typeof window === "undefined") return;
    if (file.type.startsWith("video/")) {
      // Don't preview videos
      return;
    }
    const fileUrl = URL.createObjectURL(file);
    setPreviewFile(fileUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() && uploadedFiles.length === 0) return;
    if (isSubmitting || isUploading) return;

    try {
      const success = await onSubmit(value.trim(), uploadedFiles);
      if (success) {
        // Reset state only if submission was successful
        onChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.preview && !file.preview.startsWith("/")) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 max-h-24 overflow-y-auto p-1">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative group w-14 h-14 flex-shrink-0">
              <img
                src={file.preview}
                alt={file.fileName}
                className="w-12 h-12 object-cover rounded cursor-pointer absolute bottom-0 left-0"
                onClick={() => file.file && handleFilePreview(file.file)}
              />
              {file.fileMimeType.startsWith("video/") && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                  <Icon
                    name="play"
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-10 hover:bg-red-600"
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[8px] p-1 truncate">
                {file.fileName.length > 10
                  ? file.fileName.slice(0, 7) + "..."
                  : file.fileName}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-75 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-hidden flex items-center justify-center text-center">
                {file.fileName}
              </div>
            </div>
          ))}
        </div>
      )}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <img
              src={previewFile}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button
              type="button"
              onClick={() => setPreviewFile(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
      <div
        className={`flex items-center p-1 pl-4 min-h-[3rem] bg-theme-n-8 rounded-3xl transition-all hover:shadow-[inset_0_0_0_0.0625rem_#EFEFEF] hover:bg-theme-on-surface-1 dark:hover:shadow-[inset_0_0_0_0.0625rem_#272B30] md:pl-3 ${
          value !== ""
            ? "!shadow-[inset_0_0_0_0.0625rem_#0C68E9] !bg-theme-on-surface-1"
            : ""
        }`}
      >
        <div
          className="shrink-0 mr-4 md:mr-3 cursor-pointer transform translate-y-0.5"
          onClick={handleUploadClick}
        >
          <Icon
            name="upload"
            className="w-6 h-6 text-theme-secondary"
            fill="currentColor"
          />
        </div>
        <TextareaAutosize
          className="w-full py-2 bg-transparent text-body-1m text-theme-primary outline-none resize-none placeholder:text-theme-tertiary md:text-[1rem]"
          maxRows={5}
          autoFocus={autoFocus}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ask FreeStyle AI anything"}
        />
        <button
          type="button"
          className="shrink-0 w-10 h-10 ml-6 rounded-full bg-theme-brand transition-colors hover:bg-primary-1/90 md:ml-3"
          onClick={handleButtonClick}
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? (
            <Icon
              className="fill-theme-white-fixed animate-spin"
              name="loading"
            />
          ) : (
            <Icon className="fill-theme-white-fixed" name="arrow-right" />
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
          accept=".txt,.docx,.pdf,.png,.jpg,.jpeg"
        />
      </div>
    </div>
  );
};

const Message = dynamic(() => Promise.resolve(MessageComponent), {
  ssr: false,
});

export default Message;
