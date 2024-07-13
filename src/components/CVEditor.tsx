import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  updatePersonalInfo,
  addEducation,
  addExperience,
  addSkill,
} from '../redux/cvSlice';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
});

const CVEditor: React.FC = () => {
  const dispatch = useDispatch();
  const cv = useSelector((state: RootState) => state.cv);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: cv.personalInfo,
  });

  const onSubmit = (data: any) => {
    dispatch(updatePersonalInfo(data));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">CV Editor</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full p-2 border rounded"
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full p-2 border rounded"
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2">Phone</label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            className="w-full p-2 border rounded"
          />
          {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Personal Info
        </button>
      </form>
      {/* Add forms for education, experience, and skills here */}
    </div>
  );
};

export default CVEditor;