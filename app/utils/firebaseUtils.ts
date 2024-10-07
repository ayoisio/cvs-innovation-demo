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

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

type UploadedFile = {
  fileName: string;
  fileMimeType: string;
  preview?: string;
  file?: File;
};

type FileReference = {
  fileName: string;
  fileMimeType: string;
  downloadUrl: string;
  storagePath: string;
};

export type ChatUpdateData = {
  title: string;
  messages: MessageType[];
  status: string;
  lastMessage: string;
  mode?: string;
};

export type ChatData = {
  title: string;
  messages: MessageType[];
  lastMessage: string;
  status: string;
  mode?: string;
};

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

export const getAuthToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  throw new Error("No user is signed in");
};

export const getUserData = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
};

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

  return messageId; // Return the messageId for reference
};

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

export const updateChatTitle = async (
  userId: string,
  chatId: string,
  title: string
): Promise<void> => {
  const chatRef = doc(db, `users/${userId}/chats`, chatId);
  await updateDoc(chatRef, { title });
};

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
