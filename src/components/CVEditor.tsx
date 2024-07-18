import React from "react";
import PersonalInfoForm from "./Editor/Personal/PersonalForm";
import EducationForm from "./Editor/Education/EducationForm";
import ExperienceForm from "./Editor/Experience/ExperienceForm";
import SkillsForm from "./Editor/SkillsForm";
import LinkedInProfileForm from "./ui/profile";

const CVEditor: React.FC = () => {
  return (
    <div className="space-y-8 text-black dark:text-white max-w-full mx-auto px-0 sm:px-6 lg:px-8 -z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold md:mb-4 mb-0">CV Editor</h1>
        {/* <ModeToggle /> */}
      </div>
      <div className="space-y-6 md:space-y-12">
        <LinkedInProfileForm />
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-4">Personal Information</h2>
          <PersonalInfoForm />
        </section>
        <section>
          <EducationForm />
        </section>
        <section>
          <ExperienceForm />
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <SkillsForm />
        </section>
      </div>
    </div>
  );
};

export default CVEditor;
