import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const postsListLoadState = createSlice({
  name: 'postsListLoadState',
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

const postLoadState = createSlice({
  name: 'postLoadState',
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

const authState = createSlice({
  name: 'authState',
  initialState: {
    userName: null,
    email: null,
    tokenJWT: null,
    isLoading: false,
    createUserRequestError: null,
    authErrorsList: {},
  },
  reducers: {
    saveUserAuthData: (state, action) => ({
      ...state,
      isLoading: false,
      userName: action.payload.username,
      email: action.payload.email,
      tokenJWT: action.payload.token,
    }),
    saveAuthErrorsList: (state, action) => ({ ...state, isLoading: false, authErrorsList: action.payload }),
    saveCreateUserRequestError: (state, action) => ({
      ...state,
      isLoading: false,
      createUserRequestError: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(asyncCreateUserRequest.pending, (state) => ({
      ...state,
      isLoading: true,
      createUserRequestError: null,
      authErrorsList: {},
    }))
  },
})

export const asyncRequestPostsList = createAsyncThunk(
  'postsListLoadState/requestPostsList',
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

export const asyncRequestPost = createAsyncThunk(
  'postLoadState/requestPost',
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

export const asyncCreateUserRequest = createAsyncThunk(
  'authState/createUserRequest',
  ({ apiClientInstance, regData }, { dispatch }) => {
    apiClientInstance
      .createNewUser(regData)
      .then((response) => {
        if (response.user) {
          dispatch(saveUserAuthData(response.user))
        } else {
          dispatch(saveAuthErrorsList(response.errors))
        }
      })
      .catch((requestError) => {
        dispatch(saveCreateUserRequestError(requestError.message))
      })
  }
)

// export const asyncLogInRequest = createAsyncThunk(
//   'authState/logInRequest',
//   ({ apiClientInstance, slug }, { dispatch }) => {
//     apiClientInstance
//       .getPost(slug)
//       .then(({ article }) => {
//         dispatch(savePost(article))
//       })
//       .catch((getPostError) => {
//         dispatch(savePostError(getPostError.message))
//       })
//   }
// )

export const { savePostsList, savePostsListError, pageChange } = postsListLoadState.actions
export const postsListLoadStateReducer = postsListLoadState.reducer

export const { savePost, savePostError, resetPost } = postLoadState.actions
export const postLoadReducer = postLoadState.reducer

export const { saveUserAuthData, saveAuthErrorsList, saveCreateUserRequestError } = authState.actions
export const authStateReducer = authState.reducer
