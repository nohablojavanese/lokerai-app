import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updatePersonalInfo } from "../../redux/cvSlice";

const personalInfoSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
});

const PersonalInfoForm: React.FC = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.cv.personalInfo);
  const cv = useSelector((state: RootState) => state.cv);

  const {
    register: registerPersonalInfo,
    handleSubmit: handleSubmitPersonalInfo,
    formState: { errors: errorsPersonalInfo },
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: cv.personalInfo,
  });
  const onSubmitPersonalInfo = (data: any) => {
    dispatch(updatePersonalInfo(data));
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  const onSubmit = (data: any) => {
    dispatch(updatePersonalInfo(data));
  };

  return (
    <form noValidate onSubmit={handleSubmitPersonalInfo(onSubmitPersonalInfo)}>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...registerPersonalInfo("name")}
          className="w-full p-2 border rounded"
        />
        {errorsPersonalInfo.name && (
          <span className="text-red-500 border-red-200">
            {errorsPersonalInfo.name.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...registerPersonalInfo("email")}
          className="w-full p-2 border rounded"
        />
        {errorsPersonalInfo.email && (
          <span className="text-red-500">
            {errorsPersonalInfo.email.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          {...registerPersonalInfo("phone")}
          className="w-full p-2 border rounded"
        />
        {errorsPersonalInfo.phone && (
          <span className="text-red-500">
            {errorsPersonalInfo.phone.message}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Personal Info
      </button>{" "}
    </form>
  );
};

export default PersonalInfoForm;
