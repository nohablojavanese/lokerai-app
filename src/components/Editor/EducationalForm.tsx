import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addEducation,
  removeEducation,
  updateEducation,
  reorderEducation,
  CVState,
} from "../../redux/cvSlice";
import { RootState } from "../../redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const educationSchema = yup.object().shape({
  school: yup.string().required("School is required"),
  degree: yup.string().required("Degree is required"),
  graduationYear: yup
    .number()
    .typeError("Graduation year must be a number")
    .required("Graduation year is required")
    .min(1945, "")
    .max(2040, "Format Tahun Salah"),
});

const EducationForm: React.FC = () => {
  const dispatch = useDispatch();
  const education = useSelector((state: RootState) => state.cv.education);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(educationSchema),
  });

  const onSubmit = (data: CVState["education"][0]) => {
    if (editIndex !== null) {
      dispatch(updateEducation({ index: editIndex, education: data }));
      setEditIndex(null);
    } else {
      dispatch(addEducation(data));
    }
    reset();
  };

  const handleRemove = (index: number) => {
    dispatch(removeEducation(index));
  };

  const handleEdit = (index: number) => {
    const educationItem = education[index];
    setValue("school", educationItem.school);
    setValue("degree", educationItem.degree);
    setValue("graduationYear", educationItem.graduationYear);
    setEditIndex(index);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    reset();
  };

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-2xl font-bold">
            Education
          </AccordionTrigger>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
            <AccordionContent className="mb-4">
              <Input
                {...register("school")}
                label="School"
                isRequired
                labelPlacement="outside"
                isInvalid={!!errors.school}
                errorMessage={errors.school?.message}
              />
            </AccordionContent>
            <AccordionContent className="mb-4">
              <Input
                {...register("degree")}
                label="Degree"
                isRequired
                labelPlacement="outside"
                isInvalid={!!errors.degree}
                errorMessage={errors.degree?.message}
              />
            </AccordionContent>
            <AccordionContent className="mb-4">
              <Input
                {...register("graduationYear")}
                label="Graduation Year"
                type="number"
                isRequired
                labelPlacement="outside"
                isInvalid={!!errors.graduationYear}
                // errorMessage={errors.graduationYear?.message}
                errorMessage={errors.graduationYear?.message as string}
              />
            </AccordionContent>
            <AccordionContent>
              <Button type="submit" color="primary">
                {editIndex !== null ? "Update Education" : "Add Education"}
              </Button>
              {editIndex !== null && (
                <Button onClick={cancelEdit} color="secondary" className="ml-2">
                  Cancel Edit
                </Button>
              )}
            </AccordionContent>
          </form>

          <AccordionContent className="mt-6">
            <AnimatePresence>
              {education.map((edu, index) => (
                <motion.div
                  key={edu.school + edu.graduationYear}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <EducationItem
                    edu={edu}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === education.length - 1}
                    onEdit={(updatedEdu) =>
                      dispatch(
                        updateEducation({ index, education: updatedEdu })
                      )
                    }
                    onRemove={() => dispatch(removeEducation(index))}
                    onReorder={(direction) =>
                      dispatch(reorderEducation({ index, direction }))
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

interface EducationItemProps {
  edu: CVState["education"][0];
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (updatedEdu: CVState["education"][0]) => void;
  onRemove: () => void;
  onReorder: (direction: "up" | "down") => void;
}

const EducationItem: React.FC<EducationItemProps> = ({
  edu,
  index,
  onEdit,
  onRemove,
  isFirst,
  isLast,
  onReorder,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(educationSchema),
    defaultValues: edu,
  });

  const onSubmit = (data: CVState["education"][0]) => {
    onEdit(data);
    setIsEditing(false);
  };

  return (
    <div className="mb-4 p-4 border rounded bg-white">
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("school")}
            label="School"
            isRequired
            labelPlacement="outside"
            isInvalid={!!errors.school}
            errorMessage={errors.school?.message}
          />
          <Input
            {...register("degree")}
            label="Degree"
            isRequired
            labelPlacement="outside"
            isInvalid={!!errors.degree}
            errorMessage={errors.degree?.message}
          />
          <Input
            {...register("graduationYear")}
            label="Graduation Year"
            type="number"
            isRequired
            labelPlacement="outside"
            isInvalid={!!errors.graduationYear}
            errorMessage={errors.graduationYear?.message}
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
            <strong>School:</strong> {edu.school}
          </p>
          <p>
            <strong>Degree:</strong> {edu.degree}
          </p>
          <p>
            <strong>Graduation Year:</strong> {edu.graduationYear}
          </p>
          <Button
            onClick={() => setIsEditing(true)}
            color="primary"
            className="mt-2 mr-2"
          >
            Edit
          </Button>
          <Button onClick={onRemove} color="danger" className="mt-2 mr-2">
            Remove
          </Button>
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
        </>
      )}
    </div>
  );
};

export default EducationForm;
