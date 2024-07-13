import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSkill, removeSkill } from "../../redux/cvSlice";

const SkillsForm: React.FC = () => {
  const dispatch = useDispatch();
  const [newSkill, setNewSkill] = useState("");

  const onAddSkill = () => {
    if (newSkill.trim()) {
      dispatch(addSkill(newSkill.trim()));
      setNewSkill("");
    }
  };
  const onRemoveSkill = (index: number) => {
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
    </div>
  );
};

export default SkillsForm;
