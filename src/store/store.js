import { configureStore } from '@reduxjs/toolkit'

import { articlesLoadReducer, postLoadReducer } from './slices'

const store = configureStore({
  reducer: {
    articlesLoad: articlesLoadReducer,
    postLoad: postLoadReducer,
  },
})

export default store
