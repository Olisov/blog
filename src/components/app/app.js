/* eslint-disable react/self-closing-comp */
import { React, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import { appContext } from '../../utilities'
import { asyncUserDataRequest } from '../../store/slices'
import PageLayout from '../page-layout'
import PostsList from '../posts-list'
import SignIn from '../sign-in'
import SignUp from '../sign-up'
import Profile from '../profile'
import Post from '../post'
import PostConfig from '../post-config'

const profile = 'profile'
const articles = 'articles'
const article = 'articles/:slug'
const editArticle = 'articles/:slug/edit'
const createArticle = 'new-article'
const signIn = 'sign-in'
const signUp = 'sign-Up'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/articles" />,
      },
      {
        path: articles,
        element: <PostsList />,
      },
      {
        path: article,
        element: <Post />,
      },
      {
        path: editArticle,
        element: <PostConfig />,
      },
      {
        path: createArticle,
        element: <PostConfig />,
      },
      {
        path: signIn,
        element: <SignIn />,
      },
      {
        path: signUp,
        element: <SignUp />,
      },
      {
        path: profile,
        element: <Profile />,
      },
    ],
  },
])

function App() {
  const { tokenJWT } = useSelector((state) => state.authState)
  const dispatch = useDispatch()
  const apiClientInstance = useContext(appContext)

  const savedTokenJWT = localStorage.getItem('tokenJWT')

  useEffect(() => {
    if (savedTokenJWT && !tokenJWT) {
      dispatch(asyncUserDataRequest({ apiClientInstance, tokenJWT: savedTokenJWT }))
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App
