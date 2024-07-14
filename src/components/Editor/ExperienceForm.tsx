import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addExperience, removeExperience, CVState } from "../../redux/cvSlice";
import { RootState } from "../../redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const experienceSchema = yup.object().shape({
  company: yup.string().required("Company is required"),
  position: yup.string().required("Position is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  description: yup.string().required("Description is required"),
});

const ExperienceForm: React.FC = () => {
  const dispatch = useDispatch();
  const experience = useSelector((state: RootState) => state.cv.experience);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(experienceSchema),
  });

  const onSubmit = (data: CVState["experience"][0]) => {
    dispatch(addExperience(data));
    reset();
  };

  const handleRemove = (index: number) => {
    dispatch(removeExperience(index));
  };

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-2xl font-bold mb-0">
            Experience
          </AccordionTrigger>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
            <AccordionContent className="mb-4">
              <label htmlFor="company" className="block mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                {...register("company")}
                className="w-full p-2 border rounded"
              />
              {errors.company && (
                <span className="text-red-500">{errors.company.message}</span>
              )}
            </AccordionContent>
            <AccordionContent className="mb-4">
              <label htmlFor="position" className="block mb-2">
                Position
              </label>
              <input
                type="text"
                id="position"
                {...register("position")}
                className="w-full p-2 border rounded"
              />
              {errors.position && (
                <span className="text-red-500">{errors.position.message}</span>
              )}
            </AccordionContent>
            <AccordionContent className="mb-4">
              <label htmlFor="startDate" className="block mb-2">
                Start Date
              </label>
              <input
                type="text"
                id="startDate"
                {...register("startDate")}
                className="w-full p-2 border rounded"
              />
              {errors.startDate && (
                <span className="text-red-500">{errors.startDate.message}</span>
              )}
            </AccordionContent>
            <AccordionContent className="mb-4">
              <label htmlFor="endDate" className="block mb-2">
                End Date
              </label>
              <input
                type="text"
                id="endDate"
                {...register("endDate")}
                className="w-full p-2 border rounded"
              />
              {errors.endDate && (
                <span className="text-red-500">{errors.endDate.message}</span>
              )}
            </AccordionContent>
            <AccordionContent className="mb-4">
              <label htmlFor="description" className="block mb-2">
                Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                className="w-full p-2 border rounded"
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </AccordionContent>
            <AccordionContent>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Experience
              </button>
            </AccordionContent>
          </form>

          {/* <AccordionContent className="text-xl font-semibold mb-4">
            Added Experience
          </AccordionContent> */}

          {experience.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border rounded bg-white">
              <p>
                <strong>Company:</strong> {exp.company}
              </p>
              <p>
                <strong>Position:</strong> {exp.position}
              </p>
              <p>
                <strong>Start Date:</strong> {exp.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {exp.endDate}
              </p>
              <p>
                <strong>Description:</strong> {exp.description}
              </p>
              <button
                onClick={() => handleRemove(index)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ExperienceForm;
