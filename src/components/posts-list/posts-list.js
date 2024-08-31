import { React, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Pagination, ConfigProvider, Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import PostPreview from '../post-preview'
import ApiClient from '../../api-client'
import { asyncRequestArticles, pageChange } from '../../store/slices'

import stl from './posts-list.module.scss'

function PostsList() {
  const { page, articles, error, isLoading, totalArticles } = useSelector((state) => state.articlesLoad)
  const dispatch = useDispatch()
  const apiClientInstance = new ApiClient()

  const changePage = (newPage) => {
    // console.log(page)
    dispatch(pageChange(newPage))
  }

  useEffect(() => {
    dispatch(asyncRequestArticles({ apiClientInstance, page }))
  }, [page])

  const loadingSpinner = isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null
  const errorMessage = error ? <Alert message={error} type="error" /> : null
  const pagination = articles.length ? (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            itemActiveBg: '#1890FF',
            itemBg: 'transparent',
            colorText: 'rgba(0, 0, 0, 0.88)',
            colorPrimary: '#ffffff',
            colorPrimaryHover: 'black',
          },
        },
      }}
    >
      <Pagination
        align="center"
        current={page}
        defaultPageSize="5"
        onChange={changePage}
        showSizeChanger={false}
        total={totalArticles}
      />
    </ConfigProvider>
  ) : null
  const content = articles.length
    ? articles.map((article) => {
        const { slug, updatedAt } = article
        // console.log('key', `${slug}_${updatedAt}`)
        return <PostPreview key={`${slug}_${updatedAt}`} data={article} />
      })
    : null

  return (
    <main className={stl.main}>
      {/* <PostPreview />
      <PostPreview />
      <PostPreview /> */}
      {loadingSpinner}
      {errorMessage}
      {content}
      {pagination}
    </main>
  )
}

export default PostsList
