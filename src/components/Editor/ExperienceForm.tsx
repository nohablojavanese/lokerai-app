import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addExperience,
  removeExperience,
  updateExperience,
  reorderExperience,
  CVState,
} from "../../redux/cvSlice";
import { RootState } from "../../redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const experienceSchema = yup.object().shape({
  company: yup.string().required("Company is required"),
  position: yup.string().required("Position is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("Start date is required"),
  description: yup.string().required("Description is required"),
  currentlyWorkHere: yup.boolean().default(false),
});

const ExperienceForm: React.FC = () => {
  const dispatch = useDispatch();
  const experience = useSelector((state: RootState) => state.cv.experience);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(experienceSchema),
    defaultValues: {
      currentlyWorkHere: false,
    },
  });

  const currentlyWorkHere = watch("currentlyWorkHere");

  const onSubmit = (
    data: CVState["experience"][0] & { currentlyWorkHere: boolean }
  ) => {
    const { currentlyWorkHere, ...experienceData } = data;
    if (currentlyWorkHere) {
      experienceData.endDate = "Present";
    }
    if (editIndex !== null) {
      dispatch(
        updateExperience({ index: editIndex, experience: experienceData })
      );
      setEditIndex(null);
    } else {
      dispatch(addExperience(experienceData));
    }
    reset();
  };

  const handleRemove = (index: number) => {
    dispatch(removeExperience(index));
  };

  const handleEdit = (index: number) => {
    const experienceItem = experience[index];
    setValue("company", experienceItem.company);
    setValue("position", experienceItem.position);
    setValue("startDate", experienceItem.startDate);
    setValue("endDate", experienceItem.endDate);
    setValue("description", experienceItem.description);
    setValue("currentlyWorkHere", experienceItem.endDate === "Present");
    setEditIndex(index);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    reset();
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
              <Input
                {...register("company")}
                label="Company"
                isRequired
                labelPlacement="outside"
                isInvalid={!!errors.company}
                errorMessage={errors.company?.message}
              />
            </AccordionContent>
            <AccordionContent className="mb-4">
              <Input
                {...register("position")}
                label="Position"
                isRequired
                labelPlacement="outside"
                isInvalid={!!errors.position}
                errorMessage={errors.position?.message}
              />
            </AccordionContent>
            <AccordionContent className="mb-4">
              <Input
                {...register("startDate")}
                label="Start Date"
                type="date"
                isRequired
                labelPlacement="outside"
                isInvalid={!!errors.startDate}
                errorMessage={errors.startDate?.message}
              />
            </AccordionContent>
            <AccordionContent className="mb-4">
              <Input
                {...register("endDate")}
                label="End Date"
                type="date"
                // isRequired={!currentlyWorkHere}
                labelPlacement="outside"
                isInvalid={!!errors.endDate}
                errorMessage={errors.endDate?.message}
                // isDisabled={currentlyWorkHere}
              />
            </AccordionContent>
            <AccordionContent className="mb-4">
              <Checkbox {...register("currentlyWorkHere")} color="primary">
                I currently work here
              </Checkbox>
            </AccordionContent>
            <AccordionContent className="mb-4">
              <Textarea
                {...register("description")}
                label="Description"
                isRequired
                labelPlacement="outside"
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
              />
            </AccordionContent>
            <AccordionContent className="mb-4">
              <Button type="submit" color="primary">
                {editIndex !== null ? "Update Experience" : "Add Experience"}
              </Button>
              {editIndex !== null && (
                <Button onClick={cancelEdit} color="secondary" className="ml-2">
                  Cancel Edit
                </Button>
              )}
            </AccordionContent>
          </form>
          <AnimatePresence>
            {experience.map((exp, index) => (
              <motion.div
                key={exp.company + exp.startDate}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <ExperienceItem
                  exp={exp}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === experience.length - 1}
                  onEdit={(updatedExp) =>
                    dispatch(
                      updateExperience({ index, experience: updatedExp })
                    )
                  }
                  onRemove={() => dispatch(removeExperience(index))}
                  onReorder={(direction) =>
                    dispatch(reorderExperience({ index, direction }))
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

interface ExperienceItemProps {
  exp: CVState["experience"][0];
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (updatedExp: CVState["experience"][0]) => void;
  onRemove: () => void;
  onReorder: (direction: "up" | "down") => void;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  exp,
  index,
  onEdit,
  onRemove,
  isFirst,
  isLast,
  onReorder,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(experienceSchema),
    defaultValues: {
      ...exp,
      currentlyWorkHere: exp.endDate === "Present",
    },
  });

  const currentlyWorkHere = watch("currentlyWorkHere");

  const onSubmit = (
    data: CVState["experience"][0] & { currentlyWorkHere: boolean }
  ) => {
    const { currentlyWorkHere, ...experienceData } = data;
    if (currentlyWorkHere) {
      experienceData.endDate = "Present";
    }
    dispatch(updateExperience({ index, experience: experienceData }));
    setIsEditing(false);
  };

  return (
    <div className="mb-4 p-4 border rounded bg-white">
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("company")}
            label="Company"
            isRequired
            labelPlacement="outside"
            isInvalid={!!errors.company}
            errorMessage={errors.company?.message}
          />
          <Input
            {...register("position")}
            label="Position"
            isRequired
            labelPlacement="outside"
            isInvalid={!!errors.position}
            errorMessage={errors.position?.message}
          />
          <Input
            {...register("startDate")}
            label="Start Date"
            type="date"
            isRequired
            labelPlacement="outside"
            isInvalid={!!errors.startDate}
            errorMessage={errors.startDate?.message}
          />
          <Input
            {...register("endDate")}
            label="End Date"
            type="date"
            isRequired={!currentlyWorkHere}
            labelPlacement="outside"
            isInvalid={!!errors.endDate}
            errorMessage={errors.endDate?.message}
            isDisabled={currentlyWorkHere}
          />
          <Checkbox {...register("currentlyWorkHere")} color="primary">
            I currently work here
          </Checkbox>
          <Textarea
            {...register("description")}
            label="Description"
            isRequired
            labelPlacement="outside"
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
          />
          <Button type="submit" color="primary" className="mt-2 mr-2">
            Save
          </Button>
          <Button
            onClick={() => setIsEditing(false)}
            color="secondary"
            className="mt-2"
          >
            Cancel
          </Button>
        </form>
      ) : (
        <>
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
          <Button
            onClick={() => setIsEditing(true)}
            color="primary"
            className="mt-2 mr-2"
          >
            Edit
          </Button>
          <Button onClick={onRemove} color="danger" className="mt-2">
            Remove
          </Button>
        </>
      )}
      <Button
        onClick={() => onReorder("up")}
        color="secondary"
        className="mt-2 mr-2"
        isDisabled={isFirst}
      >
        <FaCaretUp /> Move Up
      </Button>
      <Button
        onClick={() => onReorder("down")}
        color="secondary"
        className="mt-2"
        isDisabled={isLast}
      >
        <FaCaretDown /> Move Down
      </Button>
    </div>
  );
};

export default ExperienceForm;
