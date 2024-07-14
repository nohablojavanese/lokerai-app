import React from "react";
import PersonalInfoForm from "./Editor/PersonalForm";
import EducationForm from "./Editor/EducationalForm";
import ExperienceForm from "./Editor/ExperienceForm";
import SkillsForm from "./Editor/SkillsForm";
import { ModeToggle } from "./Provider/Theme/DarkMode";

const CVEditor: React.FC = () => {
  return (
    <div className="space-y-8 text-black dark:text-white max-w-full mx-auto ">
      <div>
        <ModeToggle />
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Personal Information
        </h2>
        <PersonalInfoForm />
      </div>
      <div>
        <EducationForm />
      </div>
      <div>
        {/* <h2 className="text-2xl font-bold mb-4">Experience</h2> */}
        <ExperienceForm />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <SkillsForm />
      </div>
    </div>
  );
};

export default CVEditor;
