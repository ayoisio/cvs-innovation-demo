"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Tabs from "@/components/Tabs";
import Select from "@/components/Select";
import ChatTab from "@/templates/DocumentsReviewPage/ChatTab";
import DocumentsTab from "@/templates/DocumentsReviewPage/DocumentsTab";
import MedicalClaimsTab from "@/templates/DocumentsReviewPage/MedicalClaimsTab";
import ImpreciseLanguageTab from "@/templates/DocumentsReviewPage/ImpreciseLanguageTab";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";
import Lottie from "lottie-react";
import blueCheckmarkLottie from "public/lotties/blueCheckmarkLottie.json";

interface DocumentsReviewPageProps {
  documentsReviewId?: string;
}

interface UploadedFile {
  fileName: string;
  fileMimeType: string;
  downloadUrl?: string;
  storagePath?: string;
}

type UploadedFileWithMessageId = UploadedFile & { messageId: string };

interface DocumentsReviewPageProps {
  documentsReviewId?: string;
}

interface Message {
  id: string;
  content: string;
  type: "question" | "answer";
  timestamp: Date;
  uploadedFiles?: UploadedFile[];
}

interface Message {
  id: string;
  content: string;
  type: "question" | "answer";
  timestamp: Date;
  uploadedFiles?: UploadedFile[];
}

interface Alternative {
  explanation: string;
  improved_claim: string;
}

interface Claim {
  id: string;
  claim: string;
  claim_analysis: string;
  claim_type: string;
  context: string;
  topic: string;
  alternatives: Alternative[];
}

interface ImpreciseLanguageInstance {
  id: string;
  context: string;
  imprecise_phrase: string;
  imprecise_type: string;
  improvement_suggestion: string;
  severity: string;
  confidence_score: number;
}

const typeItems = [
  { id: "0", title: "Documents" },
  { id: "1", title: "Chat with Your Documents" },
  { id: "2", title: "Medical Claims" },
  { id: "3", title: "Imprecise Language" },
];

const DocumentsReviewPage: React.FC<DocumentsReviewPageProps> = ({
  documentsReviewId,
}) => {
  const [type, setType] = useState(typeItems[0]);
  const [documentsReviewData, setDocumentsReviewData] = useState<{
    messages: Message[];
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [documentsReviewTitle, setDocumentsReviewTitle] = useState<
    string | null
  >(null);
  const [claimsData, setClaimsData] = useState<Claim[] | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    UploadedFileWithMessageId[]
  >([]);
  const [claimsStatus, setClaimsStatus] = useState<
    "idle" | "processing" | "completed"
  >("idle");
  const [impreciseLanguageData, setImpreciseLanguageData] = useState<
    ImpreciseLanguageInstance[] | null
  >(null);
  const [impreciseLanguageStatus, setImpreciseLanguageStatus] = useState<
    "idle" | "processing" | "completed"
  >("idle");
  const [showCheckmark, setShowCheckmark] = useState(false);
  const router = useRouter();

  const handleApprove = () => {
    setShowCheckmark(true);
    setTimeout(() => {
      setShowCheckmark(false);
      router.push("/");
    }, 1700);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!documentsReviewId || !userId) return;

    console.log(
      "useEffect triggered with documentsReviewId:",
      documentsReviewId,
      "and userId:",
      userId
    );

    const db = getFirestore();
    const chatDocRef = doc(db, `users/${userId}/chats/${documentsReviewId}`);
    const messagesCollectionRef = collection(chatDocRef, "messages");
    const claimsCollectionRef = collection(chatDocRef, "processed_claims");
    const impreciseLanguageCollectionRef = collection(
      chatDocRef,
      "imprecise_language_instances"
    );

    const unsubscribe = onSnapshot(chatDocRef, async (docSnap) => {
      console.log("Chat document snapshot received");
      if (docSnap.exists()) {
        const chatData = docSnap.data() as { title?: string; status?: string };
        console.log("Chat data:", chatData);
        setDocumentsReviewTitle(
          chatData.title || `Documents Review: ${documentsReviewId}`
        );

        // Fetch messages and their uploaded files
        const messagesSnapshot = await getDocs(messagesCollectionRef);
        const allUploadedFiles: UploadedFileWithMessageId[] = [];
        const messages: Message[] = [];
        messagesSnapshot.forEach((messageDoc) => {
          const messageData = messageDoc.data() as Message;
          messages.push({ ...messageData });
          if (messageData.uploadedFiles) {
            allUploadedFiles.push(
              ...messageData.uploadedFiles.map((file) => ({
                ...file,
                messageId: messageDoc.id,
              }))
            );
          }
        });
        console.log("Fetched messages:", messages);
        console.log("Fetched uploaded files:", allUploadedFiles);
        setUploadedFiles(allUploadedFiles);
        setDocumentsReviewData({ messages });

        if (
          chatData.status === "completed" ||
          chatData.status === "processing"
        ) {
          // Fetch claims
          const claimsSnapshot = await getDocs(claimsCollectionRef);
          const claims: Claim[] = [];
          claimsSnapshot.forEach((claimDoc) => {
            const claimData = claimDoc.data().claim_data as Claim;
            claims.push({ ...claimData });
          });
          console.log("Fetched claims:", claims);
          setClaimsData(claims);
          setClaimsStatus(
            chatData.status === "completed" ? "completed" : "processing"
          );
          console.log(
            "Set claims status:",
            chatData.status === "completed" ? "completed" : "processing"
          );

          // Fetch imprecise language instances
          const impreciseLanguageSnapshot = await getDocs(
            impreciseLanguageCollectionRef
          );
          const impreciseLanguageInstances: ImpreciseLanguageInstance[] = [];
          impreciseLanguageSnapshot.forEach((instanceDoc) => {
            const instanceData = instanceDoc.data()
              .instance_data as ImpreciseLanguageInstance;
            impreciseLanguageInstances.push({
              ...instanceData,
            });
          });
          console.log(
            "Fetched imprecise language instances:",
            impreciseLanguageInstances
          );
          setImpreciseLanguageData(impreciseLanguageInstances);
          setImpreciseLanguageStatus(
            chatData.status === "completed" ? "completed" : "processing"
          );
          console.log(
            "Set imprecise language status:",
            chatData.status === "completed" ? "completed" : "processing"
          );
        } else {
          console.log(
            "Chat status is neither completed nor processing. Setting statuses to idle."
          );
          setClaimsStatus("idle");
          setImpreciseLanguageStatus("idle");
        }
      } else {
        console.log("Chat document does not exist");
      }
    });

    console.log("Snapshot listener set up");

    return () => {
      console.log("Cleaning up snapshot listener");
      unsubscribe();
    };
  }, [documentsReviewId, userId]);

  const handleTabChange = (newType: (typeof typeItems)[0]) => {
    setType(newType);
  };

  const memoizedDocumentsTab = useMemo(() => {
    if (!documentsReviewId || !userId) {
      console.log("Conditions not met for DocumentsTab:", {
        documentsReviewId,
        userId,
      });
      return null;
    }

    console.log("Prepared uploadedFiles for DocumentsTab:", uploadedFiles);

    return (
      <DocumentsTab
        userId={userId}
        chatId={documentsReviewId}
        uploadedFiles={uploadedFiles}
      />
    );
  }, [documentsReviewId, userId, uploadedFiles]);

  const memoizedMedicalClaimsTab = useMemo(() => {
    if (!documentsReviewId || !userId) return null;

    return (
      <MedicalClaimsTab
        documentsReviewId={documentsReviewId}
        userId={userId}
        claimsStatus={claimsStatus}
        setClaimsStatus={setClaimsStatus}
        claimsData={claimsData}
        setClaimsData={setClaimsData}
      />
    );
  }, [documentsReviewId, userId, claimsStatus, claimsData]);

  const memoizedImpreciseLanguageTab = useMemo(() => {
    if (!documentsReviewId || !userId) return null;

    return (
      <ImpreciseLanguageTab
        documentsReviewId={documentsReviewId}
        userId={userId}
        impreciseLanguageStatus={impreciseLanguageStatus}
        setImpreciseLanguageStatus={setImpreciseLanguageStatus}
        impreciseLanguageData={impreciseLanguageData}
        setImpreciseLanguageData={setImpreciseLanguageData}
      />
    );
  }, [
    documentsReviewId,
    userId,
    impreciseLanguageStatus,
    impreciseLanguageData,
  ]);

  const memoizedChatTab = useMemo(() => {
    if (!documentsReviewId) return null;

    return <ChatTab documentsReviewId={documentsReviewId} />;
  }, [documentsReviewId]);

  return (
    <Layout
      title={documentsReviewTitle || `Documents Review: ${documentsReviewId}`}
      showNavActionButton={false}
    >
      <div className="px-20 py-10 rounded-2xl bg-theme-on-surface-1 2xl:px-10 xl:p-6 md:p-4">
        <div className="flex mb-12 md:hidden">
          <Tabs
            className="mr-auto"
            items={typeItems}
            value={type}
            setValue={handleTabChange}
          />
          <button
            className="btn-secondary shrink-0 ml-6 min-w-[8.8rem] h-10"
            onClick={handleApprove}
          >
            Approve
          </button>
        </div>
        <Select
          className="hidden mb-6 md:block"
          value={type}
          onChange={handleTabChange}
          items={typeItems}
        />
        <div className="flex-grow overflow-auto">
          {showCheckmark ? (
            <div className="flex justify-center items-center h-full">
              <Lottie
                animationData={blueCheckmarkLottie}
                loop={false}
                style={{ width: 200, height: 200 }}
              />
            </div>
          ) : (
            <>
              {type.id === "0" && memoizedDocumentsTab}
              {type.id === "1" && memoizedChatTab}
              {type.id === "2" && memoizedMedicalClaimsTab}
              {type.id === "3" && memoizedImpreciseLanguageTab}
            </>
          )}
        </div>
        <button
          className="hidden btn-secondary w-full h-10 mt-4 md:flex justify-center items-center"
          onClick={handleApprove}
        >
          Approve
        </button>
      </div>
    </Layout>
  );
};

export default DocumentsReviewPage;
