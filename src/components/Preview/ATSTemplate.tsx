import React from 'react';
import { CVState } from '../../redux/cvSlice';

interface ATSTemplateProps {
  cv: CVState;
}

const ATSTemplate: React.FC<ATSTemplateProps> = ({ cv }) => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <h1 className="text-3xl font-bold mb-4">{cv.personalInfo.name}</h1>
      <p className="mb-2">{cv.personalInfo.email} | {cv.personalInfo.phone}</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-3">Education</h2>
      {cv.education.map((edu, index) => (
        <div key={index} className="mb-2">
          <p className="font-semibold">{edu.school}</p>
          <p>{edu.degree} - Graduated: {edu.graduationYear}</p>
        </div>
      ))}
      
      <h2 className="text-2xl font-semibold mt-6 mb-3">Experience</h2>
      {cv.experience.map((exp, index) => (
        <div key={index} className="mb-4">
          <p className="font-semibold">{exp.company} - {exp.position}</p>
          <p className="text-sm">{exp.startDate} - {exp.endDate}</p>
          <p className="mt-1">{exp.description}</p>
        </div>
      ))}
      
      <h2 className="text-2xl font-semibold mt-6 mb-3">Skills</h2>
      <ul className="list-disc list-inside">
        {cv.skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default ATSTemplate;