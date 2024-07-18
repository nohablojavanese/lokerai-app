import React from "react";
import { CVState } from "../../redux/cvSlice";

interface ATSTemplateProps {
  cv: CVState;
  className?: string;
}

const formatDescription = (description: string) => {
  const lines = description.split('\n').map(line => line.trim());
  
  if (lines[0].match(/^(-|\d+\.)/)) {
    return (
      <ul className="list-disc list-inside">
        {lines.map((item, index) => {
          const cleanItem = item.replace(/^(-|\d+\.)/, '').trim();
          return cleanItem && <li key={index}>{cleanItem}</li>;
        })}
      </ul>
    );
  } else {
    return <p>{description}</p>;
  }
};

const formatDate = (dateString: string) => {
  if (dateString === "Present") return "Present";
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const ATSTemplate: React.FC<ATSTemplateProps> = ({ cv, className = "" }) => {
  const { name, last, email, phone } = cv.personalInfo;
  const headerParts = [
    `${name} ${last}`,
    email,
    phone
  ].filter(Boolean);

  return (
 <div className={`font-sans w-full h-full ${className}`}>
      <div className="flex flex-col items-center">
        <h1 className="text-4vw font-bold text-center">
          {headerParts.join(" \u2022 ")}
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
            {edu.degree} - Graduated: {formatDate(edu.graduationYear)}
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
            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
          </p>
          <div className="mt-1 text-1.5vw">
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
