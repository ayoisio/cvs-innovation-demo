// Firebase configuration imports
import { app } from "../firebaseConfig";
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { MessageType } from "@/components/Message";
import { v4 as uuidv4 } from "uuid";

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Type definition for files being uploaded
type UploadedFile = {
  fileName: string;
  fileMimeType: string;
  preview?: string; // Optional preview URL for the file
  file?: File; // Optional File object
};

// Type definition for files after they've been uploaded to Firebase Storage
type FileReference = {
  fileName: string;
  fileMimeType: string;
  downloadUrl: string; // URL to download the file
  storagePath: string; // Path where file is stored in Firebase Storage
};

// Type definition for chat update data structure
export type ChatUpdateData = {
  title: string;
  messages: MessageType[];
  status: string;
  lastMessage: string;
  mode?: string;
};

// Type definition for chat data structure
export type ChatData = {
  title: string;
  messages: MessageType[];
  lastMessage: string;
  status: string;
  mode?: string;
};

/**
 * Gets the current user's ID from Firebase Auth
 * @returns Promise resolving to the user ID string
 */
export const getCurrentUserId = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      unsubscribe(); // Unsubscribe immediately after getting the user
      if (user) {
        resolve(user.uid);
      } else {
        reject(new Error("No user is signed in"));
      }
    });
  });
};

/**
 * Gets the current user's authentication token
 * @returns Promise resolving to the auth token string
 */
export const getAuthToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  throw new Error("No user is signed in");
};

/**
 * Retrieves user data from Firestore
 * @param userId - The ID of the user to fetch data for
 * @returns Promise resolving to the user data or null if not found
 */
export const getUserData = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
};

/**
 * Creates a new chat document in Firestore
 * @param userId - The ID of the user creating the chat
 * @param message - Optional initial message for the chat
 * @param customChatId - Optional custom ID for the chat
 * @returns Promise resolving to the chat ID
 */
export const createNewChat = async (
  userId: string,
  message?: string,
  customChatId?: string
): Promise<string> => {
  const chatId = customChatId || uuidv4();
  const chatRef = doc(db, `users/${userId}/chats`, chatId);
  await setDoc(chatRef, {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: message || "",
    lastReplyType: message ? "Question" : null,
    title: "New Chat",
    messages: [],
  });
  return chatId;
};

/**
 * Uploads files to Firebase Storage
 * @param files - Array of files to upload
 * @param userId - ID of the user uploading the files
 * @param chatId - ID of the chat the files belong to
 * @param messageId - ID of the message the files are attached to
 * @returns Promise resolving to array of file references
 */
export const uploadFilesToStorage = async (
  files: UploadedFile[],
  userId: string,
  chatId: string,
  messageId: string
): Promise<FileReference[]> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  const uploadPromises = files.map(async (file) => {
    if (!file.file) throw new Error("File object is missing");

    const filePath = `users/${userId}/chats/${chatId}/uploadedMedia/${messageId}/${file.fileName}`;
    const storageRef = ref(storage, filePath);

    await uploadBytes(storageRef, file.file);
    const downloadUrl = await getDownloadURL(storageRef);

    return {
      fileName: file.fileName,
      fileMimeType: file.fileMimeType,
      downloadUrl,
      storagePath: filePath,
    };
  });

  return Promise.all(uploadPromises);
};

/**
 * Adds a new message to a chat, including handling file uploads
 * @param userId - ID of the user adding the message
 * @param chatId - ID of the chat to add the message to
 * @param message - The message content and metadata
 * @param uploadedFiles - Array of files to upload with the message
 * @returns Promise resolving to the message ID
 */
export const addMessageToChat = async (
  userId: string,
  chatId: string,
  message: Omit<MessageType, "id" | "uploadedFiles">,
  uploadedFiles: UploadedFile[]
) => {
  const chatRef = doc(db, `users/${userId}/chats`, chatId);
  const messagesRef = collection(chatRef, "messages");

  const messageId = uuidv4(); // Generate the messageId here

  // Upload files if any
  let fileReferences: FileReference[] = [];
  if (uploadedFiles.length > 0) {
    fileReferences = await uploadFilesToStorage(
      uploadedFiles,
      userId,
      chatId,
      messageId
    );
  }

  const messageToStore = {
    id: messageId,
    ...message,
    uploadedFiles: fileReferences,
    timestamp: serverTimestamp(),
  };

  await addDoc(messagesRef, messageToStore);
  await updateDoc(chatRef, {
    lastMessage: message.content,
    lastReplyType: message.type === "question" ? "Question" : "Answer",
    updatedAt: serverTimestamp(),
    status: message.type === "question" ? "processing" : "completed",
  });

  return messageId;
};

/**
 * Retrieves all data for a specific chat
 * @param userId - ID of the user who owns the chat
 * @param chatId - ID of the chat to retrieve
 * @returns Promise resolving to the chat data or null if not found
 */
export const getChatData = async (
  userId: string,
  chatId: string
): Promise<ChatData | null> => {
  console.log(`Fetching chat data for user ${userId}, chat ${chatId}`);
  const chatRef = doc(db, `users/${userId}/chats`, chatId);
  const chatDoc = await getDoc(chatRef);

  if (chatDoc.exists()) {
    const chatData = chatDoc.data();
    console.log("Chat document data:", chatData);

    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp"));
    const messagesSnapshot = await getDocs(messagesQuery);

    const messages = messagesSnapshot.docs.map((doc) => {
      const messageData = doc.data();
      console.log("Message data:", messageData);
      return {
        id: doc.id,
        ...messageData,
        timestamp: messageData.timestamp?.toDate() || new Date(),
      } as MessageType;
    });

    console.log("All messages:", messages);

    return {
      title: chatData.title || "New Chat",
      messages: messages,
      lastMessage: chatData.lastMessage || "",
      status: chatData.status || "completed",
      mode: chatData.mode,
    };
  }

  console.log("Chat document does not exist");
  return null;
};

/**
 * Updates the title of a chat
 * @param userId - ID of the user who owns the chat
 * @param chatId - ID of the chat to update
 * @param title - New title for the chat
 */
export const updateChatTitle = async (
  userId: string,
  chatId: string,
  title: string
): Promise<void> => {
  const chatRef = doc(db, `users/${userId}/chats`, chatId);
  await updateDoc(chatRef, { title });
};

/**
 * Generates a title for a chat based on its first message
 * @param chatId - ID of the chat
 * @param firstMessage - First message in the chat
 * @returns Promise resolving to the generated title
 */
export const getChatTitle = async (
  chatId: string,
  firstMessage: string
): Promise<string> => {
  const authToken = await getAuthToken();
  const response = await fetch(
    "https://public-chat-179280619779.us-central1.run.app/chat/title",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ chatId, text: firstMessage }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get chat title");
  }

  const data = await response.json();
  console.log("data: " + data);
  console.log("data.title: " + data.title);
  return data.title;
};

/**
 * Sets up real-time listeners for changes to a chat and its messages
 * @param userId - ID of the user who owns the chat
 * @param chatId - ID of the chat to listen to
 * @param callback - Function to call when changes occur
 * @returns Unsubscribe function to stop listening
 */
export const listenToChatChanges = (
  userId: string,
  chatId: string,
  callback: (data: ChatUpdateData) => void
) => {
  console.log(`Setting up listeners for user ${userId}, chat ${chatId}`);
  const chatRef = doc(db, `users/${userId}/chats`, chatId);

  return onSnapshot(chatRef, (docSnapshot) => {
    console.log("Chat document updated:", docSnapshot.data());
    if (docSnapshot.exists()) {
      const chatData = docSnapshot.data();
      const messagesRef = collection(chatRef, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp"));

      onSnapshot(messagesQuery, (messagesSnapshot) => {
        console.log("Messages updated, count:", messagesSnapshot.docs.length);
        const messages = messagesSnapshot.docs.map((doc) => {
          const messageData = doc.data();
          console.log("Message data:", messageData);
          return {
            id: doc.id,
            ...messageData,
            timestamp: messageData.timestamp?.toDate() || new Date(),
          } as MessageType;
        });

        callback({
          title: chatData.title || "New Chat",
          messages: messages,
          status: chatData.status || "completed",
          lastMessage: chatData.lastMessage || "",
          mode: chatData.mode,
        });
      });
    } else {
      console.log("Chat document does not exist");
      callback({
        title: "New Chat",
        messages: [],
        status: "completed",
        lastMessage: "",
      });
    }
  });
};
