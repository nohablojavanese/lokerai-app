import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addEducation, removeEducation, updateEducation, CVState } from "../../redux/cvSlice";
import { RootState } from "../../redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

const educationSchema = yup.object().shape({
  school: yup.string().required("School is required"),
  degree: yup.string().required("Degree is required"),
  graduationYear: yup
  .number()
  .typeError('Graduation year must be a number') 
  .required('Graduation year is required')
  .min(1945, 'Veteran Anda Ya!?!')
  .max(2040, 'Sekolah di Masa Depan?'),
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
            {education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <p><strong>School:</strong> {edu.school}</p>
                <p><strong>Degree:</strong> {edu.degree}</p>
                <p><strong>Graduation Year:</strong> {edu.graduationYear}</p>
                <Button onClick={() => handleEdit(index)} color="primary" size="sm" className="mt-2 mr-2">
                  Edit
                </Button>
                <Button onClick={() => handleRemove(index)} color="danger" size="sm" className="mt-2">
                  Remove
                </Button>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EducationForm;