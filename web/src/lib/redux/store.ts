import { configureStore } from "@reduxjs/toolkit"
import { postFormReducer } from "./reducers/create-post"

export const store = configureStore({
  reducer: {
    postForm: postFormReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
