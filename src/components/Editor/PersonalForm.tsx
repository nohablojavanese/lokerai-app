import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updatePersonalInfo } from "../../redux/cvSlice";
import { Input, Textarea } from "@nextui-org/input";
import { HiSparkles } from "react-icons/hi";
import AIButton from "../ui/aisparkle";
import { rewriteSummary } from "@/app/action";
import { readStreamableValue } from "ai/rsc";

const personalInfoSchema = yup.object().shape({
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

const PersonalInfoForm: React.FC = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.cv.personalInfo);
  const [wordCount, setWordCount] = useState(0);
  const [isAILoading, setIsAILoading] = useState(false);
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  const ringkasanValue = watch("ringkasan");

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        dispatch(updatePersonalInfo({ [name]: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  useEffect(() => {
    if (ringkasanValue) {
      setWordCount(ringkasanValue.trim().split(/\s+/).length);
    } else {
      setWordCount(0);
    }
  }, [ringkasanValue]);

  const handleAIRewrite = async () => {
    setIsAILoading(true);
    try {
      const { output } = await rewriteSummary(ringkasanValue);
      let rewrittenSummary = "";

      for await (const delta of readStreamableValue(output)) {
        rewrittenSummary += delta;
        setValue("ringkasan", rewrittenSummary);
      }
    } catch (error) {
      console.error("Error rewriting summary:", error);
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <form noValidate>
      <div className="mb-10 grid grid-cols-2 gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nama Depan"
              isRequired
              labelPlacement="outside"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              className="z-0"
            />
          )}
        />
        <Controller
          name="last"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nama Belakang"
              labelPlacement="outside"
              isInvalid={!!errors.last}
              errorMessage={errors.last?.message}
              className="z-0"
            />
          )}
        />
      </div>
      <div className="mb-4">
        <Controller
          name="alamat"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Alamat"
              labelPlacement="outside"
              isInvalid={!!errors.alamat}
              errorMessage={errors.alamat?.message}
              className="z-0"
            />
          )}
        />
      </div>
      <div className="mb-10 grid grid-cols-2 gap-4">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Email"
              isRequired
              description="Tip: Pastikan email kamu aktif"
              labelPlacement="outside"
              type="email"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              className="z-0"
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Phone"
              isRequired
              labelPlacement="outside"
              type="tel"
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message}
              className="z-0"
            />
          )}
        />
      </div>
      <div className="mb-4 relative">
        <Controller
          name="ringkasan"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Summary/Ringkasan"
              isRequired
              labelPlacement="outside"
              isInvalid={!!errors.ringkasan}
              errorMessage={errors.ringkasan?.message}
              description={`Kolom ini berisi ${wordCount} kata`}
              className="z-0"
            />
          )}
        />
        <AIButton onClick={handleAIRewrite} isLoading={isAILoading} />
      </div>
    </form>
  );
};

export default PersonalInfoForm;
