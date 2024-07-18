import React from "react";
import { CVState } from "../../redux/cvSlice";

interface ATSTemplateProps {
  cv: CVState;
  className?: string;
}

const formatDescription = (description: string) => {
  if (description.trim().startsWith('-')) {
    // If the description starts with a dash, treat it as a bullet list
    return (
      <ul className="list-disc list-outside">
        {description.split('-').map((item, index) => (
          item.trim() && <li className="text-left text-balance" key={index}>{item.trim()}</li>
        ))}
      </ul>
    );
  } else {
    // Otherwise, treat it as a paragraph
    return <p>{description}</p>;
  }
};

const ATSTemplate: React.FC<ATSTemplateProps> = ({ cv}) => {
  return (
    <div className={`font-sans w-full h-full `}>
      <div className="flex flex-col items-center">
        <h1 className="text-4vw font-bold text-center">
          {cv.personalInfo.name} {cv.personalInfo.last} | {cv.personalInfo.email} | {cv.personalInfo.phone}
        </h1>
        <h2 className="text-sm text-center font-base pb-2 border-b-2 border-gray-900 inline-block outline-offset-2">
          {cv.personalInfo.ringkasan}
        </h2>
      </div>
      <h2 className="text-xl font-semibold mt-6 mb-3 border-b-2 border-black pb-2">Education</h2>
      {cv.education.map((edu, index) => (
        <div key={index} className="mb-2">
          <p className="font-semibold text-2vw">{edu.school}</p>
          <p className="text-1.5vw">
            {edu.degree} - Graduated: {edu.graduationYear}
          </p>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-6 mb-3 border-b-2 border-black pb-2">Experience</h2>
      {cv.experience.map((exp, index) => (
        <div key={index} className="mb-4">
          <p className="font-semibold text-2vw">
            {exp.company} - {exp.position}
          </p>
          <p className="text-1.5vw">
            {exp.startDate} - {exp.endDate}
          </p>
          <div className="mt-1 text-1.5vw text-pretty">
            {formatDescription(exp.description)}
          </div>
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