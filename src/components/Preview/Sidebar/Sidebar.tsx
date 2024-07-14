import React from 'react';

interface CVOptionsSidebarProps {
  templates: string[];
  selectedTemplate: string;
  pdfOptions: {
    format: 'a4' | 'letter';
    orientation: 'portrait' | 'landscape';
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
    addPageNumbers: boolean;
  };
  onTemplateChange: (template: string) => void;
  onPdfOptionChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const CVSidebar: React.FC<CVOptionsSidebarProps> = ({
  templates,
  selectedTemplate,
  pdfOptions,
  onTemplateChange,
  onPdfOptionChange,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">CV Options</h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Template</h3>
        {templates.map((template) => (
          <button
            key={template}
            className={`block w-full text-left px-4 py-2 rounded mb-2 ${
              selectedTemplate === template ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            onClick={() => onTemplateChange(template)}
          >
            {template.charAt(0).toUpperCase() + template.slice(1)} Template
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">PDF Options</h3>
        <label className="block mb-2">
          Format:
          <select
            name="format"
            onChange={onPdfOptionChange}
            value={pdfOptions.format}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
          </select>
        </label>
        <label className="block mb-2">
          Orientation:
          <select
            name="orientation"
            onChange={onPdfOptionChange}
            value={pdfOptions.orientation}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>
        <label className="block mb-2">
          Top Margin (pt):
          <input
            type="number"
            name="marginTop"
            value={pdfOptions.marginTop}
            onChange={onPdfOptionChange}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Bottom Margin (pt):
          <input
            type="number"
            name="marginBottom"
            value={pdfOptions.marginBottom}
            onChange={onPdfOptionChange}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Left Margin (pt):
          <input
            type="number"
            name="marginLeft"
            value={pdfOptions.marginLeft}
            onChange={onPdfOptionChange}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Right Margin (pt):
          <input
            type="number"
            name="marginRight"
            value={pdfOptions.marginRight}
            onChange={onPdfOptionChange}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block">
          Add Page Numbers:
          <input
            type="checkbox"
            name="addPageNumbers"
            checked={pdfOptions.addPageNumbers}
            onChange={onPdfOptionChange}
            className="ml-2"
          />
        </label>
      </div>
    </div>
  );
};

export default CVSidebar;