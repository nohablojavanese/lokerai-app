import * as yup from "yup";

export const experienceSchema = yup.object().shape({
  company: yup.string().required("Company is required"),
  position: yup.string().required("Position is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().when('currentlyWorkHere', {
    is: true,
    then: () => yup.string().notRequired(),
    otherwise: () => yup.string().required("End date is required"),
  }),
  description: yup.string().required("Description is required"),
  currentlyWorkHere: yup.boolean().default(false),
});

export type ExperienceFormData = yup.InferType<typeof experienceSchema>;

export const formatExperience = (experience: any) => {
  return {
    company: experience.company,
    position: experience.position,
    startDate: experience.startDate,
    endDate: experience.endDate,
    description: experience.description,
  };
};

export const validateExperience = (experience: any) => {
  try {
    experienceSchema.validateSync(experience, { abortEarly: false });
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.errors;
    }
    return false;
  }
};


