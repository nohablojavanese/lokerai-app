import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface PDFPreviewModalProps {
  show: boolean;
  onClose: () => void;
  onDownloadPDF: () => void;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  show,
  onClose,
  onDownloadPDF,
}) => {
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-4 rounded-lg w-full h-full max-w-5xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl mb-4">PDF Preview</h2>
        <div className="flex-grow w-full h-full flex items-center justify-center bg-gray-100 border border-gray-300 rounded">
          <p className="text-lg text-gray-600">
            PDF preview is not available. Click the download button to generate and save the PDF.
          </p>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onClose}
          >
            Close Preview
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
            onClick={onDownloadPDF}
          >
            Download PDF
          </button>
        </div>
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