import React from "react";
import { CVState } from "../../redux/cvSlice";

interface ATSTemplateProps {
  cv: CVState;
  className?: string;
  useResponsive?: boolean;
}

const formatDescription = (description: string) => {
  const lines = description.split("\n").map((line) => line.trim());

  if (lines[0].match(/^(-|\d+\.)/)) {
    return (
      <ul className="list-disc list-outside text-left">
        {lines.map((item, index) => {
          const cleanItem = item.replace(/^(-|\d+\.)/, "").trim();
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
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

const ATSTemplate: React.FC<ATSTemplateProps> = ({ cv, className = "", useResponsive = false }) => {
  const { name, last, email, phone } = cv.personalInfo;
  const headerParts = [`${name} ${last}`, email, phone].filter(Boolean);

  const textSizes = useResponsive
    ? {
        name: "text-[4vw]",
        summary: "text-[2vw]",
        sectionTitle: "text-[3vw]",
        itemTitle: "text-[2.5vw]",
        itemSubtitle: "text-[2vw]",
        normal: "text-[1.5vw]",
      }
    : {
        name: "text-md",
        summary: "text-sm",
        sectionTitle: "text-sm",
        itemTitle: "text-md",
        itemSubtitle: "text-md",
        normal: "text-sm",
      };

  return (
    <div className={`font-sans w-full h-full ${className}`}>
      <div className="flex flex-col items-center">
        <h1 className={`${textSizes.name} font-bold text-center`}>
          {headerParts.join(" \u2022 ")}
        </h1>
        <h2 className={`${textSizes.summary} text-center font-base pb-2 inline-block outline-offset-2`}>
          {cv.personalInfo.ringkasan}
        </h2>
      </div>
      <h2 className={`${textSizes.sectionTitle} font-semibold my-2 border-b-2 border-black pb-2`}>
        Education
      </h2>

      {cv.education.map((edu, index) => (
        <div key={index} className="mb-2 flex justify-between">
          <div>
            <p className={`${textSizes.itemTitle} font-semibold`}>{edu.school}</p>
            <p className={textSizes.itemSubtitle}>{edu.degree}</p>
          </div>
          <p className={`${textSizes.normal} self-end`}>
            {formatDate(edu.graduationYear)}
          </p>
        </div>
      ))}

      <h2 className={`${textSizes.sectionTitle} font-semibold my-2 border-b-2 border-black pb-2`}>
        Experience
      </h2>
      {cv.experience.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-baseline">
            <p className={`${textSizes.itemTitle} font-semibold`}>{exp.company}</p>
            <p className={textSizes.normal}>
              {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
            </p>
          </div>
          <p className={textSizes.itemSubtitle}>{exp.position}</p>
          <div className={`mt-1 ${textSizes.normal}`}>
            {formatDescription(exp.description)}
          </div>
        </div>
      ))}

      <h2 className={`${textSizes.sectionTitle} font-semibold my-2 border-b-2 border-black pb-2`}>
        Skills
      </h2>
      <ul className={`list-disc list-outside ${textSizes.normal} grid grid-cols-3 gap-2`}>
        {cv.skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default ATSTemplate;