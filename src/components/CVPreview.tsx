import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import ATSTemplate from './Preview/ATSTemplate'
import StylizedTemplate from './Preview/StylizedTemplate';

const CVPreview: React.FC = () => {
  const cv = useSelector((state: RootState) => state.cv);
  const [template, setTemplate] = useState<'ats' | 'stylized'>('ats');

  return (
    <div>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${template === 'ats' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTemplate('ats')}
        >
          ATS Template
        </button>
        <button
          className={`px-4 py-2 rounded ${template === 'stylized' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTemplate('stylized')}
        >
          Stylized Template
        </button>
      </div>
      {template === 'ats' ? <ATSTemplate cv={cv} /> : <StylizedTemplate cv={cv} />}
    </div>
  );
};

export default CVPreview;