import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const asyncRequestPostsList = createAsyncThunk(
  'postsListLoad/requestPostsList',
  ({ apiClientInstance, page }, { dispatch }) => {
    apiClientInstance
      .getPostsList(page)
      .then((responseBody) => {
        dispatch(savePostsList(responseBody))
      })
      .catch((getPostsListError) => {
        dispatch(savePostsListError(getPostsListError))
      })
  }
)

const postsListLoad = createSlice({
  name: 'postsListLoad',
  initialState: {
    isLoading: false,
    error: null,
    postsList: [],
    totalPosts: null,
    page: 1,
  },
  reducers: {
    savePostsList: (state, action) => ({
      ...state,
      isLoading: false,
      postsList: action.payload.articles,
      totalPosts: action.payload.articlesCount,
    }),
    savePostsListError: (state, action) => ({ ...state, isLoading: false, error: action.payload }),
    pageChange: (state, action) => ({ ...state, page: action.payload }),
  },
  extraReducers: (builder) => {
    builder.addCase(asyncRequestPostsList.pending, (state) => ({ ...state, postsList: [], isLoading: true })) /// fulfilled rejected
  },
})

export const asyncRequestPost = createAsyncThunk(
  'postLoad/requestPost',
  ({ apiClientInstance, slug }, { dispatch }) => {
    apiClientInstance
      .getPost(slug)
      .then(({ article }) => {
        dispatch(savePost(article))
      })
      .catch((getPostError) => {
        dispatch(savePostError(getPostError.message))
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

export const { savePostsList, savePostsListError, pageChange } = postsListLoad.actions
export const articlesLoadReducer = postsListLoad.reducer

export const { savePost, savePostError, resetPost } = postLoad.actions
export const postLoadReducer = postLoad.reducer
