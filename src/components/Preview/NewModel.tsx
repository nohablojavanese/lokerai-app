import React from 'react';
import { useSelector } from 'react-redux';
import { CVState } from '../../redux/cvSlice';

const Template4: React.FC = () => {
  const cv = useSelector((state: { cv: CVState }) => state.cv);

  return (
    <div className="bg-white text-gray-800 p-8 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-teal-600 mb-2">{cv.personalInfo.name}</h1>
        <p className="text-sm">{cv.personalInfo.phone}</p>
        <p className="text-sm">{cv.personalInfo.email}</p>
      </header>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-teal-600 mb-4">Experience</h2>
        {cv.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{exp.company}</h3>
              <span className="text-sm">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-sm font-semibold">{exp.position}</p>
            <p className="text-sm mt-1">{exp.description}</p>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-teal-600 mb-4">Education</h2>
        {cv.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{edu.school}</h3>
              <span className="text-sm">{edu.graduationYear}</span>
            </div>
            <p className="text-sm">{edu.degree}</p>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-semibold text-teal-600 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {cv.skills.map((skill, index) => (
            <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm">
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Template4;