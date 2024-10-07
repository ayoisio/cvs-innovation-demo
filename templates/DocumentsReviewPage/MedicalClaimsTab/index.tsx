import React, { useState, useMemo, useEffect } from "react";
import Icon from "@/components/Icon";
import Lottie from "lottie-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import loadingAnimation from "public/lotties/loadingBlueDocuments.json";

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

interface MedicalClaimsTabProps {
  documentsReviewId: string;
  userId: string;
  claimsStatus: "idle" | "processing" | "completed";
  setClaimsStatus: React.Dispatch<
    React.SetStateAction<"idle" | "processing" | "completed">
  >;
  claimsData: Claim[] | null;
  setClaimsData: React.Dispatch<React.SetStateAction<Claim[] | null>>;
}

const MedicalClaimsTab: React.FC<MedicalClaimsTabProps> = ({
  documentsReviewId,
  userId,
  claimsStatus,
  setClaimsStatus,
  claimsData,
  setClaimsData,
}) => {
  const [expandedClaims, setExpandedClaims] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    console.log("MedicalClaimsTab rendered with:");
    console.log("documentsReviewId:", documentsReviewId);
    console.log("userId:", userId);
    console.log("claimsStatus:", claimsStatus);
    console.log("claimsData:", claimsData);
  }, [documentsReviewId, userId, claimsStatus, claimsData]);

  const toggleExpandClaim = (id: string) => {
    console.log(`Toggling expansion for claim: ${id}`);
    setExpandedClaims((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderMarkdown = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => (
          <a className="text-blue-500 hover:underline" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  if (claimsStatus === "idle") {
    console.log("Rendering: Medical claims analysis has not started yet.");
    return <div>Medical claims analysis has not started yet.</div>;
  }

  if (
    claimsStatus === "processing" &&
    (!claimsData || claimsData.length === 0)
  ) {
    console.log("Rendering: Loading animation");
    return (
      <div className="flex justify-center items-center h-64">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

  if (!claimsData || claimsData.length === 0) {
    console.log("Rendering: No medical claims found.");
    return <div>No medical claims found.</div>;
  }

  console.log("Rendering medical claims:", claimsData);

  return (
    <div className="space-y-6">
      {claimsData.map((claim, index) => {
        console.log(`Rendering claim ${index + 1}:`, claim);
        return (
          <div
            key={claim.id}
            className="p-6 bg-theme-on-surface rounded-xl border border-theme-stroke"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Icon
                  name="fact"
                  size={24}
                  className="text-base-1s mr-4"
                  fill="var(--primary)"
                />
                <h3 className="text-title-1s">Claim #{index + 1}</h3>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {claim.topic}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {claim.claim_type}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Claim:</h4>
              {renderMarkdown(claim.claim)}
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Context:</h4>
              {renderMarkdown(claim.context)}
            </div>

            <div
              className={`mb-4 ${
                expandedClaims[claim.id] ? "" : "line-clamp-3"
              }`}
            >
              <h4 className="font-semibold mb-2">Analysis:</h4>
              {renderMarkdown(claim.claim_analysis)}
            </div>

            {expandedClaims[claim.id] && (
              <>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Alternatives:</h4>
                  {claim.alternatives.map((alt, altIndex) => (
                    <div key={altIndex} className="mb-2">
                      <p className="font-medium">
                        Improved Claim {altIndex + 1}:
                      </p>
                      {renderMarkdown(alt.improved_claim)}
                      <p className="font-medium mt-2">Explanation:</p>
                      {renderMarkdown(alt.explanation)}
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Citations:</h4>
                  {renderMarkdown("## Citations")}
                </div>
              </>
            )}

            <button
              className="inline-flex items-center mt-3 text-button-1 text-theme-brand"
              onClick={() => toggleExpandClaim(claim.id)}
            >
              View {expandedClaims[claim.id] ? "less" : "more"}
              <Icon
                className={`!w-4 !h-4 ml-2 fill-theme-brand transition-transform ${
                  expandedClaims[claim.id] ? "rotate-180" : ""
                }`}
                name="arrow-down"
              />
            </button>
          </div>
        );
      })}

      {claimsStatus === "processing" && (
        <div className="flex justify-center items-center h-16">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: 50, height: 50 }}
          />
          <span className="ml-2">Analyzing more claims...</span>
        </div>
      )}
    </div>
  );
};

export default MedicalClaimsTab;
