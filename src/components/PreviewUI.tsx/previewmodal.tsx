// import React from 'react';

interface PDFPreviewModalProps {
  show: boolean;
  pdfBlobUrl: string | null;
  onClose: () => void;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ show, pdfBlobUrl, onClose }) => {
    if (!show || !pdfBlobUrl) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded-lg w-full h-full max-w-5xl max-h-[90vh] flex flex-col">
          <h2 className="text-2xl mb-4">PDF Preview</h2>
          <iframe
            src={pdfBlobUrl}
            className="flex-grow w-full h-[80vh]"
            style={{ border: "1px solid #ccc" }}
          />
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded self-end"
            onClick={onClose}
          >
            Close Preview
          </button>
        </div>
      </div>
    );
  };
  
  export default PDFPreviewModal;