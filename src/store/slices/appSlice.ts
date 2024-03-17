import { createAppSlice } from "../app/createAppSlice";

export interface AppSliceState {
  editing: boolean;
}

const initialState: AppSliceState = {
  editing: true,
};

export const appSlice = createAppSlice({
  name: "app",
  initialState,
  reducers: (create) => ({
    toggleEditing: create.reducer((state) => {
      state.editing = !state.editing;
    }),
  }),
  selectors: {
    selectEditing: (state) => state.editing,
  },
});

export const { toggleEditing } = appSlice.actions;

export const { selectEditing } = appSlice.selectors;
