import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updatePersonalInfo } from "../../redux/cvSlice";

const personalInfoSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  last: yup.string().required("Name is required"),
  alamat: yup.string().nullable("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/[0-9]+/, "Nomor kok ada Hurufnya!").required("Phone is required"),
});

const PersonalInfoForm: React.FC = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.cv.personalInfo);

  const {
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name) {
        dispatch(updatePersonalInfo({ [name]: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  return (
    <form noValidate>
      <div className="mb-4 grid grid-cols-2	gap-4">
        <div>
          <label htmlFor="name" className="block mb-2">
            Nama Depan
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="last" className="block mb-2">
            Nama Belakang
          </label>
          <input
            type="text"
            id="last"
            {...register("last")}
            className="w-full p-2 border rounded"
          />
        </div>
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="alamat" className="block mb-2">
          Alamat
        </label>
        <input
          type="alamat"
          id="alamat"
          {...register("alamat")}
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          {...register("phone")}
          className="w-full p-2 border rounded"
        />
        {errors.phone && (
          <span className="text-red-500">{errors.phone.message}</span>
        )}
      </div>
    </form>
  );
};

export default PersonalInfoForm;
