import { NextPage } from "next";
import DocumentsReviewPage from "@/templates/DocumentsReviewPage";

interface DocumentsReviewPageProps {
  params: {
    documentsReviewId: string;
  };
}

const DynamicDocumentsReviewPage: NextPage<DocumentsReviewPageProps> = ({
  params,
}) => {
  return <DocumentsReviewPage documentsReviewId={params.documentsReviewId} />;
};

export default DynamicDocumentsReviewPage;
