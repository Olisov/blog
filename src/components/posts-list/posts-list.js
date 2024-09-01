import { React, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Pagination, ConfigProvider, Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { shortenDescription, appContext } from '../../utilities'
import PostHeader from '../post-header'
import { asyncRequestArticles, pageChange } from '../../store/slices'

import stl from './posts-list.module.scss'

function PostsList() {
  const { page, articles, error, isLoading, totalArticles } = useSelector((state) => state.articlesLoad)
  const dispatch = useDispatch()
  const apiClientInstance = useContext(appContext)

  const changePage = (newPage) => {
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
        const { slug, updatedAt, title, author, favoritesCount, favorited, description, tagList } = article
        return (
          <Link to={`/articles/${slug}`} key={`${slug}_${updatedAt}`} className={classNames(stl.link, stl.post)}>
            {/* // < key={`${slug}_${updatedAt}`} className={stl.post}> */}
            <PostHeader
              title={title}
              updatedAt={updatedAt}
              author={author}
              favoritesCount={favoritesCount}
              favorited={favorited}
              description={shortenDescription(description, 230)}
              tagList={tagList}
            />
          </Link>
        )
      })
    : null

  return (
    <main className={stl.main}>
      {/* <PostHeader />
      <PostHeader />
      <PostHeader /> */}
      {loadingSpinner}
      {errorMessage}
      {content}
      {pagination}
    </main>
  )
}

export default PostsList
