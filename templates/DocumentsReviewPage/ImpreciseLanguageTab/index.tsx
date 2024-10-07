import React, { useState, useMemo, useEffect } from "react";
import Icon from "@/components/Icon";
import Lottie from "lottie-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import loadingAnimation from "public/lotties/loadingBlueDocuments.json";

interface ImpreciseLanguageInstance {
  id: string;
  context: string;
  imprecise_phrase: string;
  imprecise_type: string;
  improvement_suggestion: string;
  severity: string;
  confidence_score: number;
}

interface ImpreciseLanguageTabProps {
  documentsReviewId: string;
  userId: string;
  impreciseLanguageStatus: "idle" | "processing" | "completed";
  setImpreciseLanguageStatus: React.Dispatch<
    React.SetStateAction<"idle" | "processing" | "completed">
  >;
  impreciseLanguageData: ImpreciseLanguageInstance[] | null;
  setImpreciseLanguageData: React.Dispatch<
    React.SetStateAction<ImpreciseLanguageInstance[] | null>
  >;
}

const ImpreciseLanguageTab: React.FC<ImpreciseLanguageTabProps> = ({
  documentsReviewId,
  userId,
  impreciseLanguageStatus,
  setImpreciseLanguageStatus,
  impreciseLanguageData,
  setImpreciseLanguageData,
}) => {
  const [expandedInstances, setExpandedInstances] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    console.log("ImpreciseLanguageTab rendered with:");
    console.log("documentsReviewId:", documentsReviewId);
    console.log("userId:", userId);
    console.log("impreciseLanguageStatus:", impreciseLanguageStatus);
    console.log("impreciseLanguageData:", impreciseLanguageData);
  }, [
    documentsReviewId,
    userId,
    impreciseLanguageStatus,
    impreciseLanguageData,
  ]);

  const toggleExpandInstance = (id: string) => {
    setExpandedInstances((prev) => ({
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

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (impreciseLanguageStatus === "idle") {
    console.log("Rendering: Imprecise language analysis has not started yet.");
    return <div>Imprecise language analysis has not started yet.</div>;
  }

  if (
    impreciseLanguageStatus === "processing" &&
    (!impreciseLanguageData || impreciseLanguageData.length === 0)
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

  if (!impreciseLanguageData || impreciseLanguageData.length === 0) {
    console.log("Rendering: No imprecise language instances found.");
    return <div>No imprecise language instances found.</div>;
  }

  console.log("Rendering imprecise language instances:", impreciseLanguageData);

  return (
    <div className="space-y-6">
      {impreciseLanguageData.map((instance, index) => (
        <div
          key={instance.id}
          className="p-6 bg-theme-on-surface rounded-xl border border-theme-stroke"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Icon
                name="alert-triangle"
                size={24}
                className="text-base-1s mr-4"
                fill="var(--warning)"
              />
              <h3 className="text-title-1s">Imprecise Language #{index + 1}</h3>
            </div>
            <div className="flex space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(
                  instance.severity
                )}`}
              >
                {instance.severity}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {instance.imprecise_type}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Context:</h4>
            {renderMarkdown(instance.context)}
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Imprecise Phrase:</h4>
            {renderMarkdown(instance.imprecise_phrase)}
          </div>

          <div
            className={`mb-4 ${
              expandedInstances[instance.id] ? "" : "line-clamp-3"
            }`}
          >
            <h4 className="font-semibold mb-2">Improvement Suggestion:</h4>
            {renderMarkdown(instance.improvement_suggestion)}
          </div>

          {expandedInstances[instance.id] && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Confidence Score:</h4>
              <p>{(instance.confidence_score * 100).toFixed(2)}%</p>
            </div>
          )}

          <button
            className="inline-flex items-center mt-3 text-button-1 text-theme-brand"
            onClick={() => toggleExpandInstance(instance.id)}
          >
            View {expandedInstances[instance.id] ? "less" : "more"}
            <Icon
              className={`!w-4 !h-4 ml-2 fill-theme-brand transition-transform ${
                expandedInstances[instance.id] ? "rotate-180" : ""
              }`}
              name="arrow-down"
            />
          </button>
        </div>
      ))}

      {impreciseLanguageStatus === "processing" && (
        <div className="flex justify-center items-center h-16">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: 50, height: 50 }}
          />
          <span className="ml-2">Analyzing more instances...</span>
        </div>
      )}
    </div>
  );
};

export default ImpreciseLanguageTab;
