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
import PostConfig from '../post-config'

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
        path: '/articles/:slug/edit',
        element: <PostConfig />,
      },
      {
        path: '/new-article',
        element: <PostConfig />,
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
  const savedAvatarImg = localStorage.getItem('avatarImg')

  useEffect(() => {
    if (savedTokenJWT && !tokenJWT) {
      dispatch(
        saveUserAuthData({
          username: savedUserName,
          email: savedEmail,
          token: savedTokenJWT,
          image: savedAvatarImg,
        })
      )
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App
