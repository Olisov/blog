import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const postsListLoadState = createSlice({
  name: 'postsListLoadState',
  initialState: {
    isLoading: false,
    error: null,
    currentPost: null,
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
    saveUpdatePost: (state, action) => ({
      ...state,
      postsList: state.postsList.map((post) =>
        post.slug === action.payload.article.slug ? action.payload.article : post
      ),
      currentPost: action.payload.article,
    }),
    savePostsListError: (state, action) => ({ ...state, isLoading: false, error: action.payload }),
    pageChange: (state, action) => ({ ...state, page: action.payload }),
    saveNewPost: (state, action) => ({
      ...state,
      isLoading: false,
      postsList: [action.payload.article, ...state.postsList],
      currentPost: action.payload.article,
    }),
    deletePost: (state, action) => ({
      ...state,
      currentPost: null,
      postsList: state.postsList.filter((post) => post.slug !== action.payload),
    }),
    savePost: (state, action) => ({ ...state, isLoading: false, currentPost: action.payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncRequestPostsList.pending, (state) => ({ ...state, postsList: [], isLoading: true }))
      .addCase(asyncRequestPost.pending, (state) => ({ ...state, currentPost: null, isLoading: true }))
      .addCase(asyncDeletePost.pending, (state) => ({ ...state, currentPost: null, isLoading: true }))
      .addCase(asyncUpdatePost.pending, (state) => ({ ...state, isLoading: true }))
      .addCase(asyncUpdatePost.fulfilled, (state, action) => ({
        ...state,
        postsList: state.postsList.map((post) =>
          post.slug === action.payload.article.slug ? action.payload.article : post
        ),
        currentPost: action.payload.article,
        isLoading: false,
        error: null,
      }))
      .addCase(asyncUpdatePost.rejected, (state, action) => ({
        ...state,
        error: action.payload,
        isLoading: false,
      }))
      .addCase(asyncCreatePost.pending, (state) => ({ ...state, isLoading: true }))
  },
})

const authState = createSlice({
  name: 'authState',
  initialState: {
    userName: null,
    email: null,
    tokenJWT: null,
    avatarImg: undefined,
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
      avatarImg: action.payload.image ? action.payload.image : undefined,
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
        dispatch(savePostsListError(getPostsListError.message))
      })
  }
)

export const asyncRatePost = createAsyncThunk(
  'postsListLoadState/ratePostRequest',
  ({ apiClientInstance, requestData }, { dispatch }) => {
    apiClientInstance
      .ratePost(requestData)
      .then((responseBody) => {
        dispatch(saveUpdatePost(responseBody))
      })
      .catch((getPostsListError) => {
        dispatch(savePostsListError(getPostsListError.message))
      })
  }
)

export const asyncCreatePost = createAsyncThunk(
  'postsListLoadState/createPostRequest',
  ({ apiClientInstance, tokenJWT, newArticle }, { dispatch }) => {
    apiClientInstance
      .sentNewPost({ tokenJWT, newArticle })
      .then((responseBody) => {
        dispatch(saveNewPost(responseBody))
      })
      .catch((getPostsListError) => {
        dispatch(savePostsListError(getPostsListError.message))
      })
  }
)

export const asyncUpdatePost = createAsyncThunk(
  'postsListLoadState/updatePostRequest',
  async ({ tokenJWT, slug, updatedArticle }, { rejectWithValue }) => {
    try {
      const targetUrl = new URL(`/api/articles/${slug}`, 'https://blog.kata.academy/api/')
      const optionsPut = {
        method: 'PUT',
        'Content-Type': 'application/json',
        headers: {
          Authorization: `Token ${tokenJWT}`,
        },
        body: JSON.stringify({ article: updatedArticle }),
      }

      const serverResponse = await fetch(targetUrl, optionsPut)

      if (!serverResponse.ok) {
        throw new Error(`Server failure, received ${serverResponse.status}`)
      }
      const serverResponseBody = await serverResponse.json()
      return serverResponseBody
    } catch (error) {
      return rejectWithValue(`Error - ${error.message}`)
    }
  }
)

export const asyncDeletePost = createAsyncThunk(
  'postsListLoadState/deletePostRequest',
  ({ apiClientInstance, tokenJWT, slug }, { dispatch }) => {
    apiClientInstance
      .deletePost({ tokenJWT, slug })
      .then(() => {
        dispatch(deletePost(slug))
      })
      .catch((getPostsListError) => {
        dispatch(savePostsListError(getPostsListError.message))
      })
  }
)

export const asyncRequestPost = createAsyncThunk(
  'postsListLoadState/requestPost',
  ({ apiClientInstance, slug }, { dispatch }) => {
    apiClientInstance
      .getPost(slug)
      .then((responseBody) => {
        dispatch(savePost(responseBody.article))
      })
      .catch((getPostError) => {
        dispatch(savePostsListError(getPostError.message))
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

export const { savePostsList, savePostsListError, pageChange, saveUpdatePost, saveNewPost, deletePost, savePost } =
  postsListLoadState.actions
export const postsListLoadStateReducer = postsListLoadState.reducer

export const { saveUserAuthData, saveAuthErrorsList, saveAuthRequestError, resetUserAuthData, resetAuthErrorsList } =
  authState.actions
export const authStateReducer = authState.reducer
