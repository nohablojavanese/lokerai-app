import React, { useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import CVSidebar from './Preview/Sidebar/Sidebar';
import { CVState } from '@/types';

// Lazy load template components
const ATSTemplate = lazy(() => import('./Preview/ATSTemplate'));
const StylizedTemplate = lazy(() => import('./Preview/StylizedTemplate'));
const ModernTemplate = lazy(() => import('./Preview/Modern'));
const Template4 = lazy(() => import('./Preview/NewModel'));


const templates: Record<string, React.ComponentType<{ cv: CVState }>> = {
  ats: ATSTemplate,
  stylized: StylizedTemplate,
  modern: ModernTemplate,
  template4: Template4,
};

interface PdfOptions {
  format: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
}

const CVPreview: React.FC = () => {
  const cv = useSelector((state: RootState) => state.cv);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('ats');
  const [pdfOptions, setPdfOptions] = useState<PdfOptions>({
    format: 'a4',
    orientation: 'portrait',
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  const handleTemplateChange = (template: string) => setSelectedTemplate(template);

  const handlePdfOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPdfOptions((prev) => ({ ...prev, [name]: value as 'a4' | 'letter' | 'portrait' | 'landscape' }));
  };

  const generatePDF = async (): Promise<jsPDF | null> => {
    const element = document.getElementById('cv-preview');
    if (!element) return null;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: pdfOptions.orientation,
      format: pdfOptions.format,
      unit: 'px',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const imgX = (pageWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    return pdf;
  };

  const handlePreviewPDF = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      const dataUrl = pdf.output('dataurlstring');
      setPdfDataUrl(dataUrl);
      setShowPreview(true);
    }
  };

  const handleDownloadPDF = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      pdf.save('cv.pdf');
    }
  };

  const SelectedTemplate = templates[selectedTemplate];

  return (
    <div className="relative h-full">
      <button
        className="absolute top-4 right-4 z-10 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? 'Hide Options' : 'Show Options'}
      </button>
      
      <div className={`flex transition-all duration-300 ease-in-out ${showSidebar ? 'ml-0' : 'ml-0'}`}>
        <div className="flex-grow">
          <div id="cv-preview" className="mb-4 p-8 bg-white shadow-lg">
            <Suspense fallback={<div>Loading template...</div>}>
              <SelectedTemplate cv={cv} />
            </Suspense>
          </div>
          <div className="flex space-x-2 justify-center mt-4">
            <button
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              onClick={handlePreviewPDF}
            >
              Preview PDF
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`fixed left-0 top-0 h-full w-64 bg-gray-100 p-4 overflow-y-auto transition-transform duration-300 ease-in-out drop-shadow-xl	 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
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
            <iframe src={pdfDataUrl} className="flex-grow w-full" />
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