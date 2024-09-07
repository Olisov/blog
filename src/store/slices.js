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
    saveRatePost: (state, action) => ({
      ...state,
      // isLoading: false,
      postsList: state.postsList.map((post) =>
        post.slug === action.payload.article.slug ? action.payload.article : post
      ),
    }),
    savePostsListError: (state, action) => ({ ...state, isLoading: false, error: action.payload }),
    pageChange: (state, action) => ({ ...state, page: action.payload }),
  },
  extraReducers: (builder) => {
    builder.addCase(asyncRequestPostsList.pending, (state) => ({ ...state, postsList: [], isLoading: true })) /// fulfilled rejected
    // .addCase(asyncRatePost.pending, (state) => ({ ...state, isLoading: true }))
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
    builder.addCase(asyncRequestPost.pending, (state) => ({ ...state, post: null, isLoading: true }))
  },
})

const authState = createSlice({
  name: 'authState',
  initialState: {
    userName: null,
    email: null,
    tokenJWT: null,
    avatarImg: null,
    isLoading: false,
    authRequestError: null,
    authErrorsList: {},
  },
  reducers: {
    saveUserAuthData: (state, action) => ({
      ...state,
      isLoading: false,
      userName: action.payload.username,
      email: action.payload.email,
      tokenJWT: action.payload.token,
      avatarImg: action.payload.image,
    }),
    resetUserAuthData: (state) => ({ ...state, userName: null, email: null, tokenJWT: null }),
    saveAuthErrorsList: (state, action) => ({ ...state, isLoading: false, authErrorsList: action.payload }),
    saveAuthRequestError: (state, action) => ({
      ...state,
      isLoading: false,
      authRequestError: action.payload,
    }),
    resetAuthErrorsList: (state) => ({ ...state, authErrorsList: {} }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncAuthRequest.pending, (state) => ({
        ...state,
        isLoading: true,
        authRequestError: null,
        authErrorsList: {},
      }))
      .addCase(asyncUpdateUserAuthRequest.pending, (state) => ({
        ...state,
        isLoading: true,
        authRequestError: null,
        authErrorsList: {},
      }))
  },
})

export const asyncRequestPostsList = createAsyncThunk(
  'postsListLoadState/requestPostsList',
  ({ apiClientInstance, page, tokenJWT }, { dispatch }) => {
    apiClientInstance
      .getPostsList({ page, tokenJWT })
      .then((responseBody) => {
        dispatch(savePostsList(responseBody))
      })
      .catch((getPostsListError) => {
        dispatch(savePostsListError(getPostsListError))
      })
  }
)

export const asyncRatePost = createAsyncThunk(
  'postsListLoadState/requestRatePost',
  ({ apiClientInstance, requestData }, { dispatch }) => {
    apiClientInstance
      .ratePost(requestData)
      .then((responseBody) => {
        dispatch(saveRatePost(responseBody))
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

export const asyncAuthRequest = createAsyncThunk(
  'authState/authRequest',
  ({ apiClientInstance, regData }, { dispatch }) => {
    apiClientInstance
      .userAuth(regData)
      .then((response) => {
        if (response.user) {
          dispatch(saveUserAuthData(response.user))
        } else {
          dispatch(saveAuthErrorsList(response.errors))
        }
      })
      .catch((requestError) => {
        dispatch(saveAuthRequestError(requestError.message))
      })
  }
)

export const asyncUpdateUserAuthRequest = createAsyncThunk(
  'authState/updateUserAuthRequest',
  ({ apiClientInstance, regData }, { dispatch }) => {
    apiClientInstance
      .updateUserAuth(regData)
      .then((response) => {
        dispatch(saveUserAuthData(response.user))
      })
      .catch((requestError) => {
        dispatch(saveAuthRequestError(requestError.message))
      })
  }
)

export const { savePostsList, savePostsListError, pageChange, saveRatePost } = postsListLoadState.actions
export const postsListLoadStateReducer = postsListLoadState.reducer

export const { savePost, savePostError, resetPost } = postLoadState.actions
export const postLoadReducer = postLoadState.reducer

export const { saveUserAuthData, saveAuthErrorsList, saveAuthRequestError, resetUserAuthData, resetAuthErrorsList } =
  authState.actions
export const authStateReducer = authState.reducer
