/* eslint-disable react/self-closing-comp */
import { React } from 'react'
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route } from 'react-router-dom'

import PageLayout from '../page-layout'
import PostsList from '../posts-list'
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
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
