/* eslint-disable react/self-closing-comp */
import { React } from 'react'
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route } from 'react-router-dom'

import PageLayout from '../page-layout'
import PostsList from '../posts-list'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        path: '/',
        element: <PostsList />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
