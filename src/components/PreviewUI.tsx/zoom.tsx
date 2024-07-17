import React,{useState} from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface PreviewControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onPreviewPDF: () => void;
  onDownloadPDF: () => void;
  isGenerating: boolean;

}

const PreviewControls: React.FC<PreviewControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  showSidebar,
  onToggleSidebar,
  onPreviewPDF,
  onDownloadPDF,
  isGenerating,
}) => {
    const [error, setError] = useState<string | null>(null);

  return (
    <div className="fixed bottom-2 right-2 z-20">
      <div className="flex space-x-2 justify-center mt-4 buttom-0 text-xs md:text-md">
        <div className="mt-4 flex justify-center items-center">
          <button
            onClick={onZoomOut}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            - Zoom Out
          </button>
          <span className="mx-2">{zoom}%</span>
          <button
            onClick={onZoomIn}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            + Zoom In
          </button>
        </div>
        <button
          className={`px-4 py-2 bg-gray-600 hover:bg-blue-600 text-white rounded ${
            isGenerating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onToggleSidebar}
        >
          {showSidebar ? "Hide Options" : "Show Options"}
        </button>
        <button
          className={`px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded ${
            isGenerating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onPreviewPDF}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Preview PDF"}
        </button>
        {/* <button
          className={`px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded ${
            isGenerating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onDownloadPDF}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Download PDF"}
        </button> */}
      </div>
      {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
    </div>
  );
};

export default PreviewControls;