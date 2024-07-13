import React from 'react';
import { CVState } from '../../redux/cvSlice';

interface StylizedTemplateProps {
  cv: CVState;
}

const StylizedTemplate: React.FC<StylizedTemplateProps> = ({ cv }) => {
  return (
    <div className="bg-gray-100 p-8 font-serif text-gray-800">
      <header className="bg-blue-600 text-white p-6 rounded-t-lg">
        <h1 className="text-4xl font-bold mb-2">{cv.personalInfo.name}</h1>
        <p className="text-lg">{cv.personalInfo.email} | {cv.personalInfo.phone}</p>
      </header>
      
      <main className="bg-white p-6 rounded-b-lg shadow-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Education</h2>
          {cv.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold text-lg">{edu.school}</p>
              <p className="text-gray-600">{edu.degree} - Graduated: {edu.graduationYear}</p>
            </div>
          ))}
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Experience</h2>
          {cv.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <p className="font-semibold text-lg">{exp.company} - {exp.position}</p>
              <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.endDate}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Skills</h2>
          <ul className="list-none grid grid-cols-2 gap-2">
            {cv.skills.map((skill, index) => (
              <li key={index} className="bg-gray-200 rounded-full px-4 py-2 text-center">{skill}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default StylizedTemplate;