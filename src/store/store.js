import { configureStore } from '@reduxjs/toolkit'

import { articlesLoadReducer } from './slices'

const store = configureStore({
  reducer: {
    articlesLoad: articlesLoadReducer,
  },
})

export default store
