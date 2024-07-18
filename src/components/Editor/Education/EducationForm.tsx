import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addEducation,
  removeEducation,
  updateEducation,
  reorderEducation,
  CVState

} from "@/redux/cvSlice";
import { RootState } from "@/redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence } from "framer-motion";
import { educationSchema } from "./EducationTools";
import EducationItem from "./EducationItem";

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
                errorMessage={errors.graduationYear?.message}
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

export default EducationForm;
