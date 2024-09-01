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
        dispatch(saveArticlesError(getArticlesError))
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
    saveArticlesError: (state, action) => ({ ...state, isLoading: false, error: action.payload }),
    pageChange: (state, action) => ({ ...state, page: action.payload }),
  },
  extraReducers: (builder) => {
    builder.addCase(asyncRequestArticles.pending, (state) => ({ ...state, articles: [], isLoading: true })) /// fulfilled rejected
  },
})

export const asyncRequestPost = createAsyncThunk(
  'articleLoad/requestPost',
  ({ apiClientInstance, slug }, { dispatch }) => {
    apiClientInstance
      .getPost(slug)
      .then(({ article }) => {
        dispatch(savePost(article))
      })
      .catch((getArticlesError) => {
        dispatch(savePostError(getArticlesError.message))
      })
  }
)

const postLoad = createSlice({
  name: 'postLoad',
  initialState: {
    isLoading: false,
    error: null,
    post: null,
  },
  reducers: {
    savePost: (state, action) => ({ ...state, isLoading: false, post: action.payload }),
    savePostError: (state, action) => ({ ...state, isLoading: false, error: action.payload }),
    resetPost: () => ({ isLoading: false, error: null, post: null }),
  },
  extraReducers: (builder) => {
    builder.addCase(asyncRequestPost.pending, (state) => ({ ...state, post: null, isLoading: true })) /// fulfilled rejected
  },
})

export const { saveArticles, saveArticlesError, pageChange } = articlesLoad.actions
export const articlesLoadReducer = articlesLoad.reducer

export const { savePost, savePostError, resetPost } = postLoad.actions
export const postLoadReducer = postLoad.reducer
