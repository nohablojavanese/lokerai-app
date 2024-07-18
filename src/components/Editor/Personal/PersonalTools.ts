import * as yup from "yup";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const personalInfoSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[^\d]+$/, "Name cannot contain numbers")
    .required("Name is required"),
  last: yup
    .string()
    .matches(/^[^\d]+$/, "Last name cannot contain numbers")
    .required("Last name is required"),
  alamat: yup.string().required("Address is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  ringkasan: yup.string().required("Summary is required"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .required("Phone is required"),
});

export const formatPersonalInfo = (personalInfo: any) => {
  return {
    name: personalInfo.name,
    last: personalInfo.last,
    alamat: personalInfo.alamat,
    email: personalInfo.email,
    ringkasan: personalInfo.ringkasan,
    phone: personalInfo.phone,
  };
};

export const validatePersonalInfo = (personalInfo: any) => {
  try {
    personalInfoSchema.validateSync(personalInfo, { abortEarly: false });
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.errors;
    }
    return false;
  }
};

// export const handleAIRewrite = async (summary: string): Promise<string> => {
//   const { textStream } = await streamText({
//     model: openai("gpt-3.5-turbo"),
//     messages: [
//       {
//         role: "system",
//         content: `
//           You are a professional CV writer. Rewrite the given summary 
//           in a more professional and concise manner. The summary should 
//           follow ATS (Applicant tracking system) standard, pick perfect 
//           language. You become the subject "I" in this summary!
          
//           Match user summary language unless they ask 
//           specifically in English.
//         `,
//       },
//       { role: "user", content: summary },
//     ],
//     maxTokens: 200,
//   });

//   let rewrittenSummary = "";
//   for await (const delta of textStream) {
//     rewrittenSummary += delta;
//   }

//   return rewrittenSummary;
// };