// src/components/CVPreview.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const CVPreview: React.FC = () => {
  const cv = useSelector((state: RootState) => state.cv);

  return (
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">CV Preview</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
        <p><strong>Name:</strong> {cv.personalInfo.name}</p>
        <p><strong>Email:</strong> {cv.personalInfo.email}</p>
        <p><strong>Phone:</strong> {cv.personalInfo.phone}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Education</h3>
        {cv.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <p><strong>{edu.school}</strong> - {edu.degree}</p>
            <p>Graduated: {edu.graduationYear}</p>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Experience</h3>
        {cv.experience.map((exp, index) => (
          <div key={index} className="mb-2">
            <p><strong>{exp.company}</strong> - {exp.position}</p>
            <p>{exp.startDate} - {exp.endDate}</p>
            <p>{exp.description}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Skills</h3>
        <ul className="list-disc list-inside">
          {cv.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CVPreview;