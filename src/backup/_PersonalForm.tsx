import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { updatePersonalInfo } from "../redux/cvSlice";
import { Input, Textarea } from "@nextui-org/input";
import { HiSparkles } from "react-icons/hi";
import AIButton from "../components/ui/aisparkle";
import { rewriteSummary } from "@/app/action";
import { readStreamableValue } from "ai/rsc";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";

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
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    setError(null);
    try {
      const { output } = await rewriteSummary(ringkasanValue);
      let rewrittenSummary = "";

      for await (const delta of readStreamableValue(output)) {
        if (delta) {
          if (typeof delta === "string") {
            rewrittenSummary += delta;
            setValue("ringkasan", rewrittenSummary);
          } else if ("error" in delta) {
            throw new Error("An unexpected error occurred");
          }
        }
      }
    } catch (error) {
      console.error("Error rewriting summary:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      if (
        error instanceof Error &&
        error.message.includes("API rate limit exceeded")
      ) {
        onOpen();
      }
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
      <div className=" relative Z-0">
        <Controller
          name="ringkasan"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Summary/Ringkasan"
              isRequired
              className="text-xs md:text-base z-0"
              labelPlacement="outside"
              isInvalid={!!errors.ringkasan}
              errorMessage={errors.ringkasan?.message}
              description={`Kolom ini berisi ${wordCount} kata${
                20 - wordCount > 0
                  ? `, tambah ${20 - wordCount} kata untuk gunakan AI`
                  : ""
              }`}
            />
          )}
        />
        <AIButton
          onClick={handleAIRewrite}
          isLoading={isAILoading}
          disabled={wordCount < 20}
        />
      </div>
      {/* {error && <p className="text-red-500 text-xs font-bold">{error}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Penggunaan AI Mencapai Batas</ModalHeader>
          <ModalBody>
            Saya masih Nombok, Jangan Boros-Boros pakai nya ya!
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </p>
      } */}
    </form>
  );
};

export default PersonalInfoForm;
