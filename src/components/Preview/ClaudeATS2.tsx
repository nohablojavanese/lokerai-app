import React from 'react';
import { useSelector } from 'react-redux';
import { CVState } from '../../redux/cvSlice';
import { RootState } from '@/redux/store';

interface ClaudeATS2Props {
  cv: CVState;
}

const ClaudeATS2: React.FC<ClaudeATS2Props> = ({ cv }) => {
  const fontSettings = useSelector((state: RootState) => state.cv.fontSettings);

  return (
    <div style={{
      fontFamily: fontSettings.bodyFont,
      fontSize: `${fontSettings.fontSize}px`,
    }} className="max-w-4xl mx-auto p-8 bg-white shadow-lg">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontFamily: fontSettings.headerFont }} className="text-4xl font-bold mb-2">
            {cv.personalInfo.name} {cv.personalInfo.last}
          </h1>
          <p>{cv.personalInfo.email} | {cv.personalInfo.phone}</p>
        </div>
        <div className="text-right">
          <p>{cv.personalInfo.alamat}</p>
        </div>
      </header>

      <section className="mb-6">
        <h2 style={{ fontFamily: fontSettings.headerFont }} className="text-2xl font-semibold bg-gray-100 p-2 mb-3">
          Professional Summary
        </h2>
        {/* <p>{cv.personalInfo.summary}</p> */}
      </section>

      <div className="grid grid-cols-3 gap-6">
        <section className="col-span-2">
          <h2 style={{ fontFamily: fontSettings.headerFont }} className="text-2xl font-semibold bg-gray-100 p-2 mb-3">
            Work Experience
          </h2>
          {cv.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{exp.position}</h3>
              <p className="font-medium">{exp.company}</p>
              <p className="text-sm">{exp.startDate} - {exp.endDate}</p>
              <p className="mt-2">{exp.description}</p>
            </div>
          ))}
        </section>

        <div>
          <section className="mb-6">
            <h2 style={{ fontFamily: fontSettings.headerFont }} className="text-2xl font-semibold bg-gray-100 p-2 mb-3">
              Education
            </h2>
            {cv.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                <p>{edu.school}, Graduated: {edu.graduationYear}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 style={{ fontFamily: fontSettings.headerFont }} className="text-2xl font-semibold bg-gray-100 p-2 mb-3">
              Skills
            </h2>
            <ul className="list-disc list-inside">
              {cv.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClaudeATS2;