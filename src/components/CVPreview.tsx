import React, { useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CVSidebar from "./Preview/Sidebar/Sidebar";
import { CVState } from "@/types";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PreviewControls from "./PreviewUI.tsx/zoom";
import PDFPreviewModal from "./PreviewUI.tsx/previewmodal";

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
  // const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
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
      pdf.save(`${cv.personalInfo.name}_TawaKarir_CV.pdf`);
    }
  };

  const SelectedTemplate = templates[selectedTemplate];

  return (
    <div className="w-full h-full max-w-3xl mx-auto">
       <PreviewControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            showSidebar={showSidebar}
            onToggleSidebar={() => setShowSidebar(!showSidebar)}
            onPreviewPDF={handlePreviewPDF}
            onDownloadPDF={handleDownloadPDF}
            isGenerating={isGenerating}
            
          />
      <div className="relative w-full pb-[141.4%] ">
        <div
          className="absolute inset-0 bg-red-100 shadow-xl text-black overflow-hidden"
          style={{ transform: `scale(${zoom / 100})` }}
          id="cv-preview"
        >
          <div
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
          <p className="absolute text-xs text-gray-200 right-10 bottom-10">LokerAI.com</p>
      </div>

          <div
            className={`fixed z-40 left-0 top-0 h-full w-1/2 bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto transition-transform duration-300 ease-in-out drop-shadow-xl ${
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
          <PDFPreviewModal
            show={showPreview}
            pdfBlobUrl={pdfBlobUrl}
            onClose={() => {
              setShowPreview(false);
              if (pdfBlobUrl) {
                URL.revokeObjectURL(pdfBlobUrl);
              }
              setPdfBlobUrl(null);
            }}
          />
        </div>
    </div>
  );
};

export default CVPreview;
