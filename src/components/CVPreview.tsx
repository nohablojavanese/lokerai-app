import React, { useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CVSidebar from "./Preview/Sidebar/Sidebar";
import { CVState } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ATSTemplate = lazy(() => import("./Preview/ATSTemplate"));
const StylizedTemplate = lazy(() => import("./Preview/StylizedTemplate"));
const ModernTemplate = lazy(() => import("./Preview/Modern"));
const Template4 = lazy(() => import("./Preview/NewModel"));
const ATS1 = lazy(() => import("./Preview/ClaudeATS1"));
const ATS2 = lazy(() => import("./Preview/ClaudeATS2"));

const templates: Record<string, React.ComponentType<{ cv: CVState }>> = {
  ats: ATSTemplate,
  stylized: StylizedTemplate,
  modern: ModernTemplate,
  template4: Template4,
  ATS1: ATS1,
  ATS2: ATS2,
};

interface PdfOptions {
  format: "a4" | "letter";
  orientation: "portrait" | "landscape";
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  addPageNumbers: boolean;
}

const CVPreview: React.FC = () => {
  const cv = useSelector((state: RootState) => state.cv);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("ats");
  const [pdfOptions, setPdfOptions] = useState<PdfOptions>({
    format: "a4",
    orientation: "portrait",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    addPageNumbers: false,
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  const handleTemplateChange = (template: string) =>
    setSelectedTemplate(template);

  const handlePdfOptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setPdfOptions((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const generatePDF = async (): Promise<jsPDF | null> => {
    setIsGenerating(true);
    setError(null);
    const element = document.getElementById("cv-preview");
    if (!element) {
      setError("CV preview element not found");
      setIsGenerating(false);
      return null;
    }

    try {
      const pdf = new jsPDF({
        unit: "mm",
        format: pdfOptions.format,
        orientation: pdfOptions.orientation,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const scale = 5; // Increase scale for better quality
      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;

      const canvas = await html2canvas(element, {
        scale: scale,
        width: elementWidth,
        height: elementHeight,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // Calculate the scaling factor to fit the entire content
      const scaleFactor = Math.min(
        pageWidth / elementWidth,
        pageHeight / elementHeight
      );

      const xOffset = (pageWidth - elementWidth * scaleFactor) / 2;
      const yOffset = (pageHeight - elementHeight * scaleFactor) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        xOffset,
        yOffset,
        elementWidth * scaleFactor,
        elementHeight * scaleFactor
      );

      if (pdfOptions.addPageNumbers) {
        pdf.setFontSize(10);
        pdf.text(`Page 1`, pageWidth / 2, pageHeight - 5, { align: "center" });
      }

      setIsGenerating(false);
      return pdf;
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
      setIsGenerating(false);
      return null;
    }
  };

  const handlePreviewPDF = async () => {
    const pdf = await generatePDF();
    console.log("Generating PDF", pdf);
    if (pdf) {
      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      console.log("PDF Blob URL:", blobUrl);
      setPdfBlobUrl(blobUrl);
      setShowPreview(true);
    }
  };

  const handleDownloadPDF = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      pdf.save("LokerAI_CVMaker.pdf");
    }
  };

  const SelectedTemplate = templates[selectedTemplate];

  return (
    <div className="w-full h-full max-w-3xl mx-auto">
      <div className="relative w-full pb-[141.4%] ">
        <div
          className="absolute inset-0 bg-red-100 shadow-xl text-black overflow-hidden"
          style={{
          }}
        >
          <div
            id="cv-preview"
            className="w-full h-full overflow-auto bg-white"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center",
              padding: `${pdfOptions.marginTop}mm ${pdfOptions.marginRight}mm ${pdfOptions.marginBottom}mm ${pdfOptions.marginLeft}mm`,

            }}
          >
            <Suspense fallback={<div>Loading template...</div>}>
              <SelectedTemplate cv={cv} />
            </Suspense>
          </div>
        

          <div className="fixed bottom-2 right-2">
            <div className="flex space-x-2 justify-center mt-4 buttom-0 text-xs md:text-md">
              <div className="mt-4 flex justify-center items-center">
                <button
                  onClick={handleZoomOut}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  - Zoom Out
                </button>
                <span className="mx-2">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  + Zoom In
                </button>
              </div>
              <button
                className={`px-4 py-2 bg-gray-600 hover:bg-blue-600 text-white rounded ${
                  isGenerating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? "Hide Options" : "Show Options"}
              </button>
              <button
                className={`px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded ${
                  isGenerating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePreviewPDF}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Preview PDF"}
              </button>
              <button
                className={`px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded ${
                  isGenerating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleDownloadPDF}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Download PDF"}
              </button>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <div
            className={`fixed left-0 top-0 h-full w-1/2 bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto transition-transform duration-300 ease-in-out drop-shadow-xl ${
              showSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <CVSidebar
              templates={Object.keys(templates)}
              selectedTemplate={selectedTemplate}
              pdfOptions={pdfOptions}
              onTemplateChange={handleTemplateChange}
              onPdfOptionChange={handlePdfOptionChange}
            />
          </div>
          {showPreview && pdfBlobUrl && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-4 rounded-lg w-full h-full max-w-5xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl mb-4">PDF Preview</h2>
                <iframe
                  src={pdfBlobUrl ?? ""}
                  className="flex-grow w-full h-[80vh]"
                  style={{ border: "1px solid #ccc" }}
                />
                <button
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded self-end"
                  onClick={() => {
                    setShowPreview(false);
                    if (pdfBlobUrl) {
                      URL.revokeObjectURL(pdfBlobUrl);
                    }
                    setPdfBlobUrl(null);
                  }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
