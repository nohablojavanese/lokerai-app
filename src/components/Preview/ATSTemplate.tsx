import React from 'react';
import { CVState } from '../../redux/cvSlice';

interface ATSTemplateProps {
  cv: CVState;
}

const ATSTemplate: React.FC<ATSTemplateProps> = ({ cv }) => {
  return (
<div className="font-sans w-full h-fill">
  <h1 className="text-4vw font-bold mb-4">{cv.personalInfo.name}{" "}{cv.personalInfo.last}</h1>
  <p className="mb-2 text-2vw">{cv.personalInfo.email} | {cv.personalInfo.phone}</p>
  
  <h2 className="text-3vw font-semibold mt-6 mb-3">Education</h2>
  {cv.education.map((edu, index) => (
    <div key={index} className="mb-2">
      <p className="font-semibold text-2vw">{edu.school}</p>
      <p className="text-1.5vw">{edu.degree} - Graduated: {edu.graduationYear}</p>
    </div>
  ))}
  
  <h2 className="text-3vw font-semibold mt-6 mb-3">Experience</h2>
  {cv.experience.map((exp, index) => (
    <div key={index} className="mb-4">
      <p className="font-semibold text-2vw">{exp.company} - {exp.position}</p>
      <p className="text-1.5vw">{exp.startDate} - {exp.endDate}</p>
      <p className="mt-1 text-1.5vw">{exp.description}</p>
    </div>
  ))}
  
  <h2 className="text-3vw font-semibold mt-6 mb-3">Skills</h2>
  <ul className="list-disc list-inside text-1.5vw">
    {cv.skills.map((skill, index) => (
      <li key={index}>{skill}</li>
    ))}
  </ul>
</div>
 
  );
};

export default ATSTemplate;