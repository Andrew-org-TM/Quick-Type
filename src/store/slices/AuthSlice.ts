import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { RootState } from '..';

export interface InitAuthState {
  user: User;
  loading: boolean;
  error: string;
}

const initialState: InitAuthState = {
  user: <User>{},
  loading: false,
  error: '',
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state: InitAuthState, action: PayloadAction<User>): void {
      state.user = action.payload;
    },
    logOut(state: InitAuthState) {
      state.user = <User>{};
    },
  },
});

export const { setUser, logOut } = AuthSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;

export default AuthSlice.reducer;
