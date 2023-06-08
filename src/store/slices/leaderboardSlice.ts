import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface InitLeaderboardState {
  maxWpm: any[];
}

const initialState: InitLeaderboardState = {
  maxWpm: [],
};

const leaderboardSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {
    setLeaderboards(
      state: InitLeaderboardState,
      action: PayloadAction<any>
    ): void {
      let max = action.payload;
      max = max.map((score: any, idx: number) => ({
        ...score,
        id: idx + 1,
        accuracy: score.accuracy * 100,
      }));
      state.maxWpm = max;
    },
  },
});

export const { setLeaderboards } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
