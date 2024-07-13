import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addEducation, removeEducation } from "../../redux/cvSlice";

const educationSchema = yup.object().shape({
  school: yup.string().required("School is required"),
  degree: yup.string().required("Degree is required"),
  graduationYear: yup.string().required("Graduation year is required"),
});

const EducationForm: React.FC = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(educationSchema),
  });

  const onSubmitEducation = (data: any) => {
    dispatch(addEducation(data));
    resetEducation();
  };
  
  const onRemoveEducation = (index: number) => {
    dispatch(removeEducation(index));
  };

  const {
    register: registerEducation,
    handleSubmit: handleSubmitEducation,
    formState: { errors: errorsEducation },
    reset: resetEducation,
  } = useForm({
    resolver: yupResolver(educationSchema),
  });

  const onSubmit = (data: any) => {
    dispatch(addEducation(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmitEducation(onSubmitEducation)}>
      <div className="mb-4 ">
        <label htmlFor="school" className="block mb-2 text-black dark:text-white">
          School
        </label>
        <input
          type="text"
          id="school"
          {...registerEducation("school")}
          className="w-full p-2 border rounded text-black dark:text-white"
        />
        {errorsEducation.school && (
          <span className="text-red-500">{errorsEducation.school.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="degree" className="block mb-2">
          Degree
        </label>
        <input
          type="text"
          id="degree"
          {...registerEducation("degree")}
          className="w-full p-2 border rounded text-black dark:text-white"
        />
        {errorsEducation.degree && (
          <span className="text-red-500">{errorsEducation.degree.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="graduationYear" className="block mb-2">
          Graduation Year
        </label>
        <input
          type="text"
          id="graduationYear"
          {...registerEducation("graduationYear")}
          className="w-full p-2 border rounded text-black"
        />
        {errorsEducation.graduationYear && (
          <span className="text-red-500">
            {errorsEducation.graduationYear.message}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Education
      </button>
    </form>
  );
};

export default EducationForm;
