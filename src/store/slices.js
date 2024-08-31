/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const asyncRequestArticles = createAsyncThunk(
  'articleLoad/requestArticles',
  ({ apiClientInstance, page }, { dispatch }) => {
    apiClientInstance
      .getArticles(page)
      .then((responseBody) => {
        dispatch(saveArticles(responseBody))
      })
      .catch((getArticlesError) => {
        dispatch(saveError(getArticlesError))
      })
  }
)

const articlesLoad = createSlice({
  name: 'articlesLoad',
  initialState: {
    isLoading: false,
    error: null,
    articles: [],
    totalArticles: null,
    page: 1,
  },
  reducers: {
    saveArticles: (state, action) => ({
      ...state,
      isLoading: false,
      articles: action.payload.articles,
      totalArticles: action.payload.articlesCount,
    }),
    saveError: (state, action) => ({ ...state, isLoading: false, error: action.payload }),
    pageChange: (state, action) => ({ ...state, page: action.payload }),
  },
  extraReducers: (builder) => {
    builder.addCase(asyncRequestArticles.pending, (state) => ({ ...state, isLoading: true })) /// fulfilled rejected
  },
})

export const { saveArticles, saveError, pageChange } = articlesLoad.actions
export const articlesLoadReducer = articlesLoad.reducer
