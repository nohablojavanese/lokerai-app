import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addExperience,
  removeExperience,
  updateExperience,
  reorderExperience,
  CVState,
} from "@/redux/cvSlice";
import { RootState } from "@/redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { experienceSchema } from "./ExperienceTools";
import ExperienceItem from "./ExperienceItem";
import AIButton from "@/components/ui/aisparkle";
import { rewriteSummary } from "./action";
import { readStreamableValue } from "ai/rsc";
import { useDisclosure } from "@nextui-org/modal";
const ExperienceForm: React.FC = () => {
  const dispatch = useDispatch();
  const experience = useSelector((state: RootState) => state.cv.experience);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen } = useDisclosure();

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
  const description = watch("description");

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

  // const handleEdit = (index: number) => {
  //   const experienceItem = experience[index];
  //   setValue("company", experienceItem.company);
  //   setValue("position", experienceItem.position);
  //   setValue("startDate", experienceItem.startDate);
  //   setValue("endDate", experienceItem.endDate);
  //   setValue("description", experienceItem.description);
  //   setValue("currentlyWorkHere", experienceItem.endDate === "Present");
  //   setEditIndex(index);
  // };

  const cancelEdit = () => {
    setEditIndex(null);
    reset();
  };

  const handleAIRewrite = async () => {
    setIsAILoading(true);
    setError(null);
    try {
      const { output } = await rewriteSummary(description);
      let rewrittenSummary = "";

      for await (const delta of readStreamableValue(output)) {
        if (delta) {
          if (typeof delta === "string") {
            rewrittenSummary += delta;
            setValue("description", rewrittenSummary);
          } else if ("error" in delta) {
            throw new Error("An unexpected error occurred");
          }
        }
      }
    } catch (error) {
      console.error("Error rewriting summary:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      if (
        error instanceof Error &&
        error.message.includes("API rate limit exceeded")
      ) {
        onOpen();
      }
    } finally {
      setIsAILoading(false);
    }
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
            </AccordionContent>{" "}
            <AccordionContent className="mb-4 relative">
              <Textarea
                {...register("description")}
                label="Description"
                isRequired
                labelPlacement="outside"
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
              />
              <AIButton
                onClick={handleAIRewrite}
                isLoading={isAILoading}
                disabled={!description || description.split(/\s+/).length < 20}
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

export default ExperienceForm;
