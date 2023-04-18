import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { RootState } from '..';

export interface InitAuthState {
  user: User;
  loading: boolean;
  error: string;
  username: string;
}

const initialState: InitAuthState = {
  user: <User>{},
  loading: false,
  error: '',
  username: '',
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
    setUsername(state: InitAuthState, action: PayloadAction<string>): void {
      state.username = action.payload;
    },
    setError(state: InitAuthState, action: PayloadAction<string>): void {
      state.error = action.payload;
    },
    setLoading(state: InitAuthState, action: PayloadAction<boolean>): void {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logOut, setUsername } = AuthSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;

export default AuthSlice.reducer;
