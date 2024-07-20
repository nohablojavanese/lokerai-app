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
import { useDisclosure } from "@nextui-org/modal";
import AIButton from "@/components/ui/aisparkle";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { JobDescAI, rewriteSummary } from "./action";
import { readStreamableValue } from "ai/rsc";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  const experience = useSelector((state: RootState) => state.cv.experience);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const { isOpen, onOpen } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(experienceSchema),
    defaultValues: {
      ...exp,
      currentlyWorkHere: exp.endDate === "Present",
    },
  });

  const currentlyWorkHere = watch("currentlyWorkHere");
  const [error, setError] = useState<string | null>(null);
  const description = watch("description");

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
  const renderDescription = (description: string) => {
    const words = description.split(" ");
    if (isExpanded || words.length <= 20) {
      return description;
    }
    return words.slice(0, 20).join(" ") + "...";
  };
  const formatDate = (dateString: string) => {
    if (dateString === "Present") return "Present";
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "short", year: "2-digit" });
  };
  const handleAIRewrite = async () => {
    setIsAILoading(true);
    setError(null);
    try {
      const { output } = await JobDescAI(description);
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
          <div className="">
            <Textarea
              {...register("description")}
              label="Description"
              isRequired
              labelPlacement="outside"
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
            />
            <div className="mt-2 justify-end">
              <AIButton
                onClick={handleAIRewrite}
                isLoading={isAILoading}
                disabled={!description || description.split(/\s+/).length < 20}
              />
            </div>
          </div>
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
          <div className="flex items-start justify-end mb-2  text-right">
            <div>
              <p className="text-gray-500 text-sm ">
                <strong>Start Date: </strong>{formatDate(exp.startDate)}

              </p>
              <p className="text-gray-500 text-sm">
                <strong>End Date: </strong>{formatDate(exp.endDate)}
              </p>
            </div>
          </div>
          <div className="mb-2">
            <p className="text-lg font-semibold text-gray-800">{exp.company}</p>
          </div>
          <div className="mb-2">
            <p className="text-md text-gray-700">
              <strong>Position:</strong> {exp.position}
            </p>
          </div>
          <div className="mb-2">
            <p className="text-md text-gray-700">
              <strong>Description:</strong> {renderDescription(exp.description)}
              {exp.description.split(" ").length > 20 && (
                <span
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-500 cursor-pointer ml-2"
                >
                  {isExpanded ? "Tutup" : "Baca Lebih"}
                </span>
              )}
            </p>
          </div>
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
      {/* <div className="mt-2 justify-end">
        <AIButton
          onClick={handleAIRewrite}
          isLoading={isAILoading}
          disabled={!description || description.split(/\s+/).length < 20}
        />
      </div> */}
    </div>
  );
};

export default ExperienceItem;
