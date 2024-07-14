// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../redux/store";
// import {
//   updatePersonalInfo,
//   addEducation,
//   removeEducation,
//   addExperience,
//   removeExperience,
//   addSkill,
//   removeSkill,
// } from "../redux/cvSlice";

// const personalInfoSchema = yup.object().shape({
//   name: yup.string().required("Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   phone: yup.number().required("Phone is required"),
// });

// const educationSchema = yup.object().shape({
//   school: yup.string().required("School is required"),
//   degree: yup.string().required("Degree is required"),
//   graduationYear: yup.string().required("Graduation year is required"),
// });

// const experienceSchema = yup.object().shape({
//   company: yup.string().required("Company is required"),
//   position: yup.string().required("Position is required"),
//   startDate: yup.string().required("Start date is required"),
//   endDate: yup.string().required("End date is required"),
//   description: yup.string().required("Description is required"),
// });

// const CVEditor: React.FC = () => {
//   const dispatch = useDispatch();
//   const cv = useSelector((state: RootState) => state.cv);
//   const [newSkill, setNewSkill] = useState("");

//   const {
//     register: registerPersonalInfo,
//     handleSubmit: handleSubmitPersonalInfo,
//     formState: { errors: errorsPersonalInfo },
//   } = useForm({
//     resolver: yupResolver(personalInfoSchema),
//     defaultValues: cv.personalInfo,
//   });

//   const {
//     register: registerEducation,
//     handleSubmit: handleSubmitEducation,
//     formState: { errors: errorsEducation },
//     reset: resetEducation,
//   } = useForm({
//     resolver: yupResolver(educationSchema),
//   });

//   const {
//     register: registerExperience,
//     handleSubmit: handleSubmitExperience,
//     formState: { errors: errorsExperience },
//     reset: resetExperience,
//   } = useForm({
//     resolver: yupResolver(experienceSchema),
//   });

//    const onSubmitPersonalInfo = (data: any) => {
//     dispatch(updatePersonalInfo(data));
//   };

//   const onSubmitEducation = (data: any) => {
//     dispatch(addEducation(data));
//     resetEducation();
//   };

//   const onRemoveEducation = (index: number) => {
//     dispatch(removeEducation(index));
//   };

//   const onSubmitExperience = (data: any) => {
//     dispatch(addExperience(data));
//     resetExperience();
//   };

//   const onRemoveExperience = (index: number) => {
//     dispatch(removeExperience(index));
//   };

//   const onAddSkill = () => {
//     if (newSkill.trim()) {
//       dispatch(addSkill(newSkill.trim()));
//       setNewSkill('');
//     }
//   };

//   const onRemoveSkill = (index: number) => {
//     dispatch(removeSkill(index));
//   };

//   return (
//     <div className="space-y-8">
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
//         <form onSubmit={handleSubmitPersonalInfo(onSubmitPersonalInfo)}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block mb-2">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               {...registerPersonalInfo("name")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsPersonalInfo.name && (
//               <span className="text-red-500">
//                 {errorsPersonalInfo.name.message}
//               </span>
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="email" className="block mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               {...registerPersonalInfo("email")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsPersonalInfo.email && (
//               <span className="text-red-500">
//                 {errorsPersonalInfo.email.message}
//               </span>
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="phone" className="block mb-2">
//               Phone
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               {...registerPersonalInfo("phone")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsPersonalInfo.phone && (
//               <span className="text-red-500">
//                 {errorsPersonalInfo.phone.message}
//               </span>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Save Personal Info
//           </button>
//         </form>
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold mb-4">Education</h2>
//         <form onSubmit={handleSubmitEducation(onSubmitEducation)}>
//           <div className="mb-4">
//             <label htmlFor="school" className="block mb-2">
//               School
//             </label>
//             <input
//               type="text"
//               id="school"
//               {...registerEducation("school")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsEducation.school && (
//               <span className="text-red-500">
//                 {errorsEducation.school.message}
//               </span>
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="degree" className="block mb-2">
//               Degree
//             </label>
//             <input
//               type="text"
//               id="degree"
//               {...registerEducation("degree")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsEducation.degree && (
//               <span className="text-red-500">
//                 {errorsEducation.degree.message}
//               </span>
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="graduationYear" className="block mb-2">
//               Graduation Year
//             </label>
//             <input
//               type="text"
//               id="graduationYear"
//               {...registerEducation("graduationYear")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsEducation.graduationYear && (
//               <span className="text-red-500">
//                 {errorsEducation.graduationYear.message}
//               </span>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Add Education
//           </button>
//         </form>
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold mb-4">Experience</h2>
//         <form onSubmit={handleSubmitExperience(onSubmitExperience)}>
//           <div className="mb-4">
//             <label htmlFor="company" className="block mb-2">
//               Company
//             </label>
//             <input
//               type="text"
//               id="company"
//               {...registerExperience("company")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsExperience.company && (
//               <span className="text-red-500">
//                 {errorsExperience.company.message}
//               </span>
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="position" className="block mb-2">
//               Position
//             </label>
//             <input
//               type="text"
//               id="position"
//               {...registerExperience("position")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsExperience.position && (
//               <span className="text-red-500">
//                 {errorsExperience.position.message}
//               </span>
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="startDate" className="block mb-2">
//               Start Date
//             </label>
//             <input
//               type="text"
//               id="startDate"
//               {...registerExperience("startDate")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsExperience.startDate && (
//               <span className="text-red-500">
//                 {errorsExperience.startDate.message}
//               </span>
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="endDate" className="block mb-2">
//               End Date
//             </label>
//             <input
//               type="text"
//               id="endDate"
//               {...registerExperience("endDate")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsExperience.endDate && (
//               <span className="text-red-500">
//                 {errorsExperience.endDate.message}
//               </span>
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="description" className="block mb-2">
//               Description
//             </label>
//             <textarea
//               id="description"
//               {...registerExperience("description")}
//               className="w-full p-2 border rounded"
//             />
//             {errorsExperience.description && (
//               <span className="text-red-500">
//                 {errorsExperience.description.message}
//               </span>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Add Experience
//           </button>
//         </form>
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold mb-4">Skills</h2>
//         <div className="flex mb-4">
//           <input
//             type="text"
//             value={newSkill}
//             onChange={(e) => setNewSkill(e.target.value)}
//             className="flex-grow p-2 border rounded-l"
//             placeholder="Enter a skill"
//           />
//           <button
//             onClick={onAddSkill}
//             className="bg-blue-500 text-white px-4 py-2 rounded-r"
//           >
//             Add Skill
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CVEditor;
