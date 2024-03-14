import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../app/createAppSlice";
// import type { AppThunk } from "../app/store";
// import { fetchCount } from "./counterAPI";

export interface Component {
  id: string;
  type: string;
}

export interface LayoutSliceState {
  selectedComponentId?: string;
  components: Record<string, Component>;
}

const initialState: LayoutSliceState = {
  selectedComponentId: undefined,
  components: {},
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const layoutSlice = createAppSlice({
  name: "layout",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    setSelectedComponent: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.selectedComponentId = action.payload;
      }
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectSelectedComponentId: (layout) => layout.selectedComponentId,
    selectSelectedComponent: (layout) =>
      layout.selectedComponentId ?
      layout.components[layout.selectedComponentId] : undefined,
  },
});

// Action creators are generated for each case reducer function.
export const { setSelectedComponent } =
  layoutSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectSelectedComponent, selectSelectedComponentId } = layoutSlice.selectors;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());

//     if (currentValue % 2 === 1 || currentValue % 2 === -1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };
