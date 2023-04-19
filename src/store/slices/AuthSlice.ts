import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { RootState } from '..';

export interface DatabaseScores {
  accuracy: any;
  created_at: string;
  endingCorrect: number | null;
  endingExtra: number | null;
  endingIncorrect: number | null;
  endingSkipped: number | null;
  id: number;
  incorrectKeys: number;
  language: string;
  raw: number;
  testType: string;
  timeElapsed: number;
  totalKeysPressed: number;
  userId: string | null;
  wpm: number;
}

export interface InitAuthState {
  user: User;
  loading: boolean;
  error: string;
  username: string;
  pastScores: DatabaseScores[];
}

const initialState: InitAuthState = {
  user: <User>{},
  loading: false,
  error: '',
  username: '',
  pastScores: [],
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
    setScores(
      state: InitAuthState,
      action: PayloadAction<DatabaseScores[]>
    ): void {
      const scores = action.payload;

      state.pastScores = scores.map((row) => ({
        ...row,
        accuracy: `${row.accuracy * 100}%`,
        created_at: row.created_at.slice(0, 10),
      }));
    },
  },
});

export const { setUser, logOut, setUsername, setError, setScores, setLoading } =
  AuthSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;

export default AuthSlice.reducer;
