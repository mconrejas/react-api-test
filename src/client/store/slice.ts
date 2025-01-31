import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReferralWithId } from "../../types/referrals";

interface ReferralsState {
  data: ReferralWithId[];
  selectedReferral: ReferralWithId | null;
}

export const initialState: ReferralsState = {
  data: [],
  selectedReferral: null
};

const referralsSlice = createSlice({
  name: "referrals",
  initialState,
  reducers: {
    setReferrals: (state, action: PayloadAction<ReferralWithId[]>) => {
      state.data = action.payload;
    },
    setSelectReferral: (state, action: PayloadAction<number | null>) => {
      state.selectedReferral = state.data.find((referral) => referral.id === action.payload) || null;
    },
    addReferral: (state, action: PayloadAction<ReferralWithId>) => {
      state.data.push(action.payload);
    },
    updateSelectedReferral: (state, action: PayloadAction<{ id: number; formData: Partial<ReferralWithId> }>) => {
      state.data = state.data.map((referral) =>
        referral.id === action.payload.id
          ? { ...referral, ...action.payload.formData }
          : referral
      );
    },
    removeSelectedReferral: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter(referral => referral.id !== action.payload);
    },
  },
});

export const { setReferrals, setSelectReferral, addReferral, updateSelectedReferral, removeSelectedReferral } = referralsSlice.actions;

export const referralsReducer = referralsSlice.reducer;
