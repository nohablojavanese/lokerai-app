import React, { useState, lazy, Suspense, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { usePDF } from "react-to-pdf";
import { CVState } from "@/types";
import PreviewControls from "./PreviewUI.tsx/PreviewButton";
import PDFPreviewModal from "./PreviewUI.tsx/PreviewPDFModal";
import CVSidebar from "./Preview/Sidebar/Sidebar";

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
  const [zoom, setZoom] = useState(100);

  const { toPDF, targetRef } = usePDF({
    filename: `${cv.personalInfo.name}_TawaKarir_CV.pdf`,
    page: {
      format: pdfOptions.format as any,
      orientation: pdfOptions.orientation,
      margin: {
        top: pdfOptions.marginTop,
        bottom: pdfOptions.marginBottom,
        left: pdfOptions.marginLeft,
        right: pdfOptions.marginRight,
      },
    },
    method: "save",
  });

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

  const handlePreviewPDF = () => {
    setShowPreview(true);
  };

  const handleDownloadPDF = () => {
    toPDF();
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
        isGenerating={false}
      />
      <div id="wrapper" className="relative w-full pb-[141.4%]">
        <div
          className="absolute inset-0 bg-white shadow-xl text-black overflow-y"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <div
            ref={targetRef}
            id="cv-preview"
            className="w-full h-auto bg-white overflow-y"
            style={{
              padding: `${pdfOptions.marginTop}mm ${pdfOptions.marginRight}mm ${pdfOptions.marginBottom}mm ${pdfOptions.marginLeft}mm`,
            }}
          >
            <div className="isolate">
              <Suspense fallback={<div>Loading template...</div>}>
                <SelectedTemplate cv={cv} />
              </Suspense>
            </div>
            <p className="absolute text-xs text-gray-200 right-1 top-1">
              LokerAI.com
            </p>
          </div>
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
          onClose={() => setShowPreview(false)}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>
    </div>
  );
};

export default CVPreview;
