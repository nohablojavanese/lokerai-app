import React from 'react';
import { useSelector } from 'react-redux';
import { CVState } from '../../redux/cvSlice';
import { RootState } from '@/redux/store';

interface ClaudeATS1Props {
  cv: CVState;
}

const ClaudeATS1: React.FC<ClaudeATS1Props> = ({ cv }) => {
  const fontSettings = useSelector((state: RootState) => state.cv.fontSettings);

  return (
    <div style={{
      fontFamily: fontSettings.bodyFont,
      fontSize: `${fontSettings.fontSize}px`,
    }} className="">
      <header className="text-center mb-8">
        <h1 style={{ fontFamily: fontSettings.headerFont }} className="text-4xl font-bold mb-2">
          {cv.personalInfo.name} {cv.personalInfo.last}
        </h1>
        <p>{cv.personalInfo.email} | {cv.personalInfo.phone}</p>
        <p>{cv.personalInfo.alamat}</p>
      </header>

      <section className="mb-6">
        <h2 style={{ fontFamily: fontSettings.headerFont }} className="text-2xl font-semibold border-b-2 border-gray-300 mb-3">
          Professional Summary
        </h2>
        {/* <p>{cv.personalInfo.summary}</p> */}
      </section>

      <section className="mb-6">
        <h2 style={{ fontFamily: fontSettings.headerFont }} className="text-2xl font-semibold border-b-2 border-gray-300 mb-3">
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

      <section className="mb-6">
        <h2 style={{ fontFamily: fontSettings.headerFont }} className="text-2xl font-semibold border-b-2 border-gray-300 mb-3">
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
        <h2 style={{ fontFamily: fontSettings.headerFont }} className="text-2xl font-semibold underline flex underline-offset-4 border-gray-300 mb-3">
          Skills
        </h2>
        <ul className="list-disc list-inside grid grid-cols-2 gap-2">
          {cv.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ClaudeATS1;