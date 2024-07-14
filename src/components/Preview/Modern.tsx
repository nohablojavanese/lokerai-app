import React from 'react';
import { CVState } from '../../redux/cvSlice';

interface ModernTemplateProps {
  cv: CVState;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ cv }) => {
  return (
    <div className="bg-white p-8 font-sans text-gray-800 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-red-600 mb-2">{cv.personalInfo.name}</h1>
        {/* <p className="text-sm">{cv.personalInfo.address}</p> */}
        <p className="text-sm">{cv.personalInfo.phone}</p>
        <p className="text-sm">{cv.personalInfo.email}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Summary</h2>
        {/* <p className="text-sm">{cv.summary}</p> */}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Experience</h2>
        {cv.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{exp.company}</h3>
              {/* <span className="text-sm">{exp.location}</span> */}
            </div>
            <p className="text-sm font-semibold">{exp.position}</p>
            <p className="text-sm text-gray-600">{exp.startDate} to {exp.endDate}</p>
            {/* <ul className="list-disc list-inside text-sm mt-2">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul> */}
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Education</h2>
        {cv.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{edu.school}</h3>
              {/* <span className="text-sm">{edu.location}</span> */}
            </div>
            <p className="text-sm">{edu.degree}</p>
            <p className="text-sm text-gray-600">{edu.graduationYear}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Skills</h2>
        <div className="grid grid-cols-2 gap-2">
          {cv.skills.map((skill, index) => (
            <p key={index} className="text-sm">{skill}</p>
          ))}
        </div>
      </section>

      {/* <section>
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Languages</h2>
        <div className="grid grid-cols-2 gap-4">
          {cv.languages.map((lang, index) => (
            <div key={index} className="flex flex-col">
              <p className="text-sm font-semibold">{lang.language}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-600 h-2.5 rounded-full" 
                  style={{ width: `${lang.proficiency}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{lang.level}</p>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default ModernTemplate;