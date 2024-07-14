import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CVState {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  education: {
    school: string;
    degree: string;
    graduationYear: string;
  }[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
}

const initialState: CVState = {
  personalInfo: {
    name: 'Nama Kamu',
    email: 'email@example.com',
    phone: "0821xxxxxxxx",
  },
  education: [],
  experience: [],
  skills: [],
};


const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    updatePersonalInfo: (state, action: PayloadAction<Partial<CVState['personalInfo']>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    addEducation: (state, action: PayloadAction<CVState['education'][0]>) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<{ index: number; education: CVState['education'][0] }>) => {
      const { index, education } = action.payload;
      state.education[index] = education;
    },
    removeEducation: (state, action: PayloadAction<number>) => {
      state.education.splice(action.payload, 1);
    },
    addExperience: (state, action: PayloadAction<CVState['experience'][0]>) => {
      state.experience.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<{ index: number; experience: CVState['experience'][0] }>) => {
      const { index, experience } = action.payload;
      state.experience[index] = experience;
    },
    removeExperience: (state, action: PayloadAction<number>) => {
      state.experience.splice(action.payload, 1);
    },
    addSkill: (state, action: PayloadAction<string>) => {
      state.skills.push(action.payload);
    },
    removeSkill: (state, action: PayloadAction<number>) => {
      state.skills.splice(action.payload, 1);
    },
  },
});

export const {
  updatePersonalInfo,
  addEducation,
  updateEducation,
  removeEducation,
  addExperience,
  updateExperience,
  removeExperience,
  addSkill,
  removeSkill,
} = cvSlice.actions;

export default cvSlice.reducer;