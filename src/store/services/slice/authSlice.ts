import { createSlice } from "@reduxjs/toolkit";

type User = {
name: string;
email: string;
phone: string;
role: 'Donor'|'NGO'
}
type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loggedOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
  