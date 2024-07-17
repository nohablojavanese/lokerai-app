import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
interface PDFPreviewModalProps {
  show: boolean;
  pdfBlobUrl: string | null;
  onClose: () => void;
  onDownloadPDF: () => void;
  isGenerating: boolean;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  show,
  pdfBlobUrl,
  onClose,
  onDownloadPDF,
  isGenerating,
}) => {
  const [error, setError] = useState<string | null>(null);
  if (!show || !pdfBlobUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-4 rounded-lg w-full h-full max-w-5xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl mb-4">PDF Preview</h2>
        <iframe
          src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="flex-grow w-full h-full"
          style={{ border: "1px solid #ccc" }}
        />
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded "
          onClick={onClose}
        >
          Close Preview
        </button>
        <button
          className={`px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded ${
            isGenerating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onDownloadPDF}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Download PDF"}
        </button>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default PDFPreviewModal;
