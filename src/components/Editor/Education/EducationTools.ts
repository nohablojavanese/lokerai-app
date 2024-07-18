import * as yup from "yup";

export const educationSchema = yup.object().shape({
  school: yup.string().required("School is required"),
  degree: yup.string().required("Degree is required"),
  graduationYear: yup
    .number()
    .typeError("Graduation year must be a number")
    .required("Graduation year is required")
    .min(1945, "Graduation year must be 1945 or later")
    .max(2040, "Graduation year must be 2040 or earlier"),
});

export const formatEducation = (education: any) => {
  return {
    school: education.school,
    degree: education.degree,
    graduationYear: education.graduationYear,
  };
};

export const validateEducation = (education: any) => {
  try {
    educationSchema.validateSync(education, { abortEarly: false });
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.errors;
    }
    return false;
  }
};