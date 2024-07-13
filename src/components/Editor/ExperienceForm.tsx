import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addExperience, removeExperience } from "../../redux/cvSlice";

const experienceSchema = yup.object().shape({
  company: yup.string().required("Company is required"),
  position: yup.string().required("Position is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  description: yup.string().required("Description is required"),
});

const ExperienceForm: React.FC = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(experienceSchema),
  });

  const onSubmitExperience = (data: any) => {
    dispatch(addExperience(data));
    resetExperience();
  };

  const onRemoveExperience = (index: number) => {
    dispatch(removeExperience(index));
  };
  const {
    register: registerExperience,
    handleSubmit: handleSubmitExperience,
    formState: { errors: errorsExperience },
    reset: resetExperience,
  } = useForm({
    resolver: yupResolver(experienceSchema),
  });

  const onSubmit = (data: any) => {
    dispatch(addExperience(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmitExperience(onSubmitExperience)}>
      <div className="mb-4">
        <label htmlFor="company" className="block mb-2">
          Company
        </label>
        <input
          type="text"
          id="company"
          {...registerExperience("company")}
          className="w-full p-2 border rounded"
        />
        {errorsExperience.company && (
          <span className="text-red-500">
            {errorsExperience.company.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="position" className="block mb-2">
          Position
        </label>
        <input
          type="text"
          id="position"
          {...registerExperience("position")}
          className="w-full p-2 border rounded"
        />
        {errorsExperience.position && (
          <span className="text-red-500">
            {errorsExperience.position.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="startDate" className="block mb-2">
          Start Date
        </label>
        <input
          type="text"
          id="startDate"
          {...registerExperience("startDate")}
          className="w-full p-2 border rounded"
        />
        {errorsExperience.startDate && (
          <span className="text-red-500">
            {errorsExperience.startDate.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="endDate" className="block mb-2">
          End Date
        </label>
        <input
          type="text"
          id="endDate"
          {...registerExperience("endDate")}
          className="w-full p-2 border rounded"
        />
        {errorsExperience.endDate && (
          <span className="text-red-500">
            {errorsExperience.endDate.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">
          Description
        </label>
        <textarea
          id="description"
          {...registerExperience("description")}
          className="w-full p-2 border rounded"
        />
        {errorsExperience.description && (
          <span className="text-red-500">
            {errorsExperience.description.message}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Experience
      </button>
    </form>
  );
};

export default ExperienceForm;
