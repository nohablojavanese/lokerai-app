import React from "react";
import PersonalInfoForm from "./Editor/PersonalForm";
import EducationForm from "./Editor/EducationalForm";
import ExperienceForm from "./Editor/ExperienceForm";
import SkillsForm from "./Editor/SkillsForm";
import { ModeToggle } from "./Provider/Theme/DarkMode";

const CVEditor: React.FC = () => {
  return (
    <div className="space-y-8 text-black dark:text-white max-w-full mx-auto px-4 sm:px-6 lg:px-8 -z-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CV Editor</h1>
        <ModeToggle />
      </div>
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
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