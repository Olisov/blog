/* eslint-disable react/self-closing-comp */
import { React, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { saveUserAuthData } from '../../store/slices'
import PageLayout from '../page-layout'
import PostsList from '../posts-list'
import SignIn from '../sign-in'
import SignUp from '../sign-up'
import Profile from '../profile'
import Post from '../post'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        path: '/articles',
        element: <PostsList />,
      },
      {
        path: '/articles/:slug',
        element: <Post />,
      },
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-Up',
        element: <SignUp />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
])

function App() {
  const { tokenJWT } = useSelector((state) => state.authState)
  const dispatch = useDispatch()

  const savedUserName = localStorage.getItem('userName')
  const savedEmail = localStorage.getItem('email')
  const savedTokenJWT = localStorage.getItem('tokenJWT')

  useEffect(() => {
    if (savedTokenJWT && !tokenJWT) {
      dispatch(
        saveUserAuthData({
          userName: savedUserName,
          email: savedEmail,
          tokenJWT: savedTokenJWT,
        })
      )
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App
