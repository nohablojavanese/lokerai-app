import React, { useState, lazy, Suspense, useCallback } from "react";
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

const templates: Record<string, React.ComponentType<{ cv: CVState }>> = {
  ats: ATSTemplate,
  stylized: StylizedTemplate,
  modern: ModernTemplate,
  template4: Template4,
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
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 40,
    addPageNumbers: false,
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const generatePDF = useCallback(async (): Promise<jsPDF | null> => {
    setIsGenerating(true);
    setError(null);
    const element = document.getElementById("cv-preview");
    if (!element) {
      setError("CV preview element not found");
      setIsGenerating(false);
      return null;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const pdf = new jsPDF({
        orientation: pdfOptions.orientation,
        format: pdfOptions.format,
        unit: "pt",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth =
        pageWidth - pdfOptions.marginLeft - pdfOptions.marginRight;
      const contentHeight =
        pageHeight - pdfOptions.marginTop - pdfOptions.marginBottom;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = contentWidth / imgWidth;
      const scaledImgHeight = imgHeight * ratio;
      let heightLeft = scaledImgHeight;
      let position = 0;
      let pageCount = 1;

      pdf.addImage(
        canvas,
        "JPEG",
        pdfOptions.marginLeft,
        pdfOptions.marginTop,
        contentWidth,
        scaledImgHeight
      );

      if (pdfOptions.addPageNumbers) {
        pdf.setFontSize(10);
        pdf.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      }

      heightLeft -= contentHeight;

      while (heightLeft >= 0) {
        position = heightLeft - scaledImgHeight;
        pdf.addPage();
        pageCount++;

        pdf.addImage(
          canvas,
          "JPEG",
          pdfOptions.marginLeft,
          position + pdfOptions.marginTop,
          contentWidth,
          scaledImgHeight
        );

        if (pdfOptions.addPageNumbers) {
          pdf.setFontSize(10);
          pdf.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, {
            align: "center",
          });
        }

        heightLeft -= contentHeight;
      }

      setIsGenerating(false);
      return pdf;
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
      setIsGenerating(false);
      return null;
    }
  }, [pdfOptions]);

  const handlePreviewPDF = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      const dataUrl = pdf.output("dataurlstring");
      setPdfDataUrl(dataUrl);
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
    <div className="relative h-full overflow-y-auto">
      <div
        id="cv-preview"
        className="relative p-4 bg-white w-a4 h-a4 shadow-xl mx-auto"
      >
        <Suspense fallback={<div>Loading template...</div>}>
          <SelectedTemplate cv={cv} />
        </Suspense>
      </div>

      <div className="fixed bottom-2 right-2">
        <div className="flex space-x-2 justify-center mt-4 buttom-0">
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
      {/* </div> */}

      <div
        className={`fixed left-0 top-0 h-full w-1/2 bg-gray-100 p-4 overflow-y-auto transition-transform duration-300 ease-in-out drop-shadow-xl ${
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

      {showPreview && pdfDataUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-full h-full max-w-5xl max-h-[90vh] flex flex-col">
            <h2 className="text-2xl mb-4">PDF Preview</h2>
            <iframe
              src={pdfDataUrl}
              className="flex-grow w-full"
              allow="fullscreen" // Allow fullscreen mode, disables download button in most browsers
              // sandbox=""
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded self-end"
              onClick={() => setShowPreview(false)}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVPreview;
