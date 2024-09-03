import { configureStore } from '@reduxjs/toolkit'

import { postsListLoadStateReducer, postLoadReducer, authStateReducer } from './slices'

const store = configureStore({
  reducer: {
    postsListLoadState: postsListLoadStateReducer,
    postLoadState: postLoadReducer,
    authState: authStateReducer,
  },
})

export default store
