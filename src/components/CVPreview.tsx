import React, { useState, lazy, Suspense, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CVSidebar from "./Preview/Sidebar/Sidebar";
import { CVState } from "@/types";
import PreviewControls from "./PreviewUI.tsx/zoom";
import PDFPreviewModal from "./PreviewUI.tsx/previewmodal";
import Image from "next/image";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const previewRef = useRef<HTMLDivElement>(null);

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

  const generatePDF = useCallback(async (): Promise<string | null> => {
    if (!previewRef.current) return null;
    setIsGenerating(true);
    setError(null);
    try {
      const element = previewRef.current;
      const pdf = new jsPDF({
        unit: "mm",
        format: pdfOptions.format,
        orientation: pdfOptions.orientation,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const scale = 2;
      const elementWidth = element.scrollWidth;
      const elementHeight = element.scrollHeight;

      const canvas = await html2canvas(element, {
        scale: scale,
        width: elementWidth,
        height: elementHeight,
        useCORS: true,
        logging: false,
        windowWidth: elementWidth,
        windowHeight: elementHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth - 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      let pageCount = 0;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 2;
        position -= pageHeight;
        pageCount++;

        if (heightLeft > 0) {
          pdf.addPage();
        }
      }

      if (pdfOptions.addPageNumbers) {
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 5, {
            align: "center",
          });
        }
      }

      setIsGenerating(false);

      const pdfBlob = pdf.output("blob");
      console.log("Number of pages in PDF:", pageCount);
      return URL.createObjectURL(pdfBlob);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
      setIsGenerating(false);
      return null;
    }
  }, [pdfOptions, setIsGenerating, setError]);

  const handlePreviewPDF = async () => {
    const pdfBlobUrl = await generatePDF();
    if (pdfBlobUrl) {
      setPdfBlobUrl(pdfBlobUrl);
      setShowPreview(true);
    }
  };

  const handleDownloadPDF = async () => {
    const pdfBlobUrl = await generatePDF();
    if (pdfBlobUrl) {
      const link = document.createElement("a");
      link.href = pdfBlobUrl;
      link.download = `${cv.personalInfo.name}_TawaKarir_CV.pdf`;
      link.click();
      URL.revokeObjectURL(pdfBlobUrl);
    }
  };

  const SelectedTemplate = templates[selectedTemplate];

  return (
    <div className="w-full h-full md:max-w-3xl mx-auto z-10">
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
      <div id="wrapper" className="relative w-full pb-[141.4%] ">
        <div
          className="absolute inset-0 bg-white shadow-xl text-black overflow-hidden"
          style={{ transform: `scale(${zoom / 100})` }}
          // id="cv-preview"
          // ref={previewRef}
        >
          <div
            ref={previewRef}
            id="cv-preview"
            className="w-full h-full bg-white overflow-y text-xs md:text-base"
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
          <p className="absolute text-xs text-gray-200 right-2 bottom-0">
            LokerAI.com
          </p>
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
          onDownloadPDF={handleDownloadPDF}
          isGenerating={isGenerating}
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
