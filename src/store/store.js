import { configureStore } from '@reduxjs/toolkit'

import { postsListLoadStateReducer, authStateReducer } from './slices'

const store = configureStore({
  reducer: {
    postsListLoadState: postsListLoadStateReducer,
    authState: authStateReducer,
  },
})

export default store
