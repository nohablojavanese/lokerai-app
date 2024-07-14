import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addEducation, removeEducation, CVState } from "../../redux/cvSlice";
import { RootState } from "../../redux/store";
// import { AccordionContent } from "../ui/accordion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const educationSchema = yup.object().shape({
  school: yup.string().required("School is required"),
  degree: yup.string().required("Degree is required"),
  graduationYear: yup.string().required("Graduation year is required"),
});

const EducationForm: React.FC = () => {
  const dispatch = useDispatch();
  const education = useSelector((state: RootState) => state.cv.education);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(educationSchema),
  });

  const onSubmit = (data: CVState["education"][0]) => {
    dispatch(addEducation(data));
    reset();
  };

  const handleRemove = (index: number) => {
    dispatch(removeEducation(index));
  };

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-2xl font-bold mb-0">
            Education
          </AccordionTrigger>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
            <AccordionContent className="mb-4">
              <label
                htmlFor="school"
                className="block mb-2 text-black dark:text-white"
              >
                School
              </label>
              <input
                type="text"
                id="school"
                {...register("school")}
                className="w-full p-2 border rounded text-black dark:text-white"
              />
              {errors.school && (
                <span className="text-red-500">{errors.school.message}</span>
              )}
            </AccordionContent>
            <AccordionContent className="mb-4">
              <label htmlFor="degree" className="block mb-2">
                Degree
              </label>
              <input
                type="text"
                id="degree"
                {...register("degree")}
                className="w-full p-2 border rounded text-black dark:text-white"
              />
              {errors.degree && (
                <span className="text-red-500">{errors.degree.message}</span>
              )}
            </AccordionContent>
            <AccordionContent className="mb-4">
              <label htmlFor="graduationYear" className="block mb-2">
                Graduation Year
              </label>
              <input
                type="text"
                id="graduationYear"
                {...register("graduationYear")}
                className="w-full p-2 border rounded text-black dark:text-white"
              />
              {errors.graduationYear && (
                <span className="text-red-500">
                  {errors.graduationYear.message}
                </span>
              )}
            </AccordionContent>
            <AccordionContent>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Education
              </button>
            </AccordionContent>
          </form>

          <AccordionContent className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Added Education</h3>
            {education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <p>
                  <strong>School:</strong> {edu.school}
                </p>
                <p>
                  <strong>Degree:</strong> {edu.degree}
                </p>
                <p>
                  <strong>Graduation Year:</strong> {edu.graduationYear}
                </p>
                <button
                  onClick={() => handleRemove(index)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EducationForm;
