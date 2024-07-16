import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CVState {
  fontSettings: {
    headerFont: string;
    bodyFont: string;
    fontSize: number;
  };
  personalInfo: {
    name: string;
    last: string;
    alamat: string;
    email: string;
    phone: string;
    ringkasan: string;
  };
  education: {
    school: string;
    degree: string;
    graduationYear: number;
  }[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    // currentlyWorkHere: boolean;
  }[];
  skills: string[];
}

const initialState: CVState = {
  fontSettings: {
    headerFont: "Arial",
    bodyFont: "Helvetica",
    fontSize: 12,
  },
  personalInfo: {
    name: "Nama Depan",
    last: "Belakang",
    alamat: "Jln. Jalan JK 9AK",
    email: "email@contoh.com",
    phone: "0821xxxxxxxx",
    ringkasan: "",
  },
  education: [],
  experience: [],
  skills: [],
};

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    updatePersonalInfo: (
      state,
      action: PayloadAction<Partial<CVState["personalInfo"]>>
    ) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    addEducation: (state, action: PayloadAction<CVState["education"][0]>) => {
      state.education.push(action.payload);
    },
    updateEducation: (
      state,
      action: PayloadAction<{
        index: number;
        education: CVState["education"][0];
      }>
    ) => {
      const { index, education } = action.payload;
      state.education[index] = education;
    },
    removeEducation: (state, action: PayloadAction<number>) => {
      state.education.splice(action.payload, 1);
    },
    addExperience: (state, action: PayloadAction<CVState["experience"][0]>) => {
      state.experience.push(action.payload);
    },
    updateExperience: (
      state,
      action: PayloadAction<{
        index: number;
        experience: CVState["experience"][0];
      }>
    ) => {
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
    updateFontSettings: (
      state,
      action: PayloadAction<Partial<CVState["fontSettings"]>>
    ) => {
      state.fontSettings = { ...state.fontSettings, ...action.payload };
    },
    hydrate: (state, action: PayloadAction<CVState>) => {
      return action.payload;
    },
    reorderEducation: (
      state,
      action: PayloadAction<{ index: number; direction: "up" | "down" }>
    ) => {
      const { index, direction } = action.payload;
      if (direction === "up" && index > 0) {
        [state.education[index - 1], state.education[index]] = [
          state.education[index],
          state.education[index - 1],
        ];
      } else if (direction === "down" && index < state.education.length - 1) {
        [state.education[index], state.education[index + 1]] = [
          state.education[index + 1],
          state.education[index],
        ];
      }
    },
    reorderExperience: (
      state,
      action: PayloadAction<{ index: number; direction: "up" | "down" }>
    ) => {
      const { index, direction } = action.payload;
      if (direction === "up" && index > 0) {
        [state.experience[index - 1], state.experience[index]] = [
          state.experience[index],
          state.experience[index - 1],
        ];
      } else if (direction === "down" && index < state.experience.length - 1) {
        [state.experience[index], state.experience[index + 1]] = [
          state.experience[index + 1],
          state.experience[index],
        ];
      }
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
  updateFontSettings,
  hydrate,
  reorderEducation,
  reorderExperience,
} = cvSlice.actions;

export default cvSlice.reducer;
