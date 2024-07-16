import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSkill, removeSkill } from "../../redux/cvSlice";
import { RootState } from "../../redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@nextui-org/Input";


const SkillsForm: React.FC = () => {
  const dispatch = useDispatch();
  const skills = useSelector((state: RootState) => state.cv.skills);
  const [newSkill, setNewSkill] = useState("");

  const onAddSkill = () => {
    if (newSkill.trim()) {
      dispatch(addSkill(newSkill.trim()));
      setNewSkill("");
    }
  };

  const handleRemove = (index: number) => {
    dispatch(removeSkill(index));
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Enter a skill"
        />
        <button
          onClick={onAddSkill}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Add Skill
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Added Skills</h3>
        <div className="flex flex-wrap">
          {skills.map((skill, index) => (
            <div key={index} className="m-2 p-2 bg-gray-200 rounded flex items-center">
              <span>{skill}</span>
              <button
                onClick={() => handleRemove(index)}
                className="ml-2 text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;