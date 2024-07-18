import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addEducation,
  removeEducation,
  updateEducation,
  reorderEducation,
  CVState,
} from "@/redux/cvSlice";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { educationSchema } from "./EducationTools";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

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
            // errorMessage={errors.graduationYear?.message}
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
          <div className="mb-2">
            <p className="text-lg font-semibold text-gray-800">
              <strong>School:</strong> {edu.school}
            </p>
          </div>
          <div className="mb-2">
            <p className="text-md text-gray-700">
              <strong>Degree:</strong> {edu.degree}
            </p>
          </div>
          <div className="mb-2">
            <p className="text-md text-gray-700">
              <strong>Graduation Year:</strong> {edu.graduationYear}
            </p>
          </div>
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

export default EducationItem;
