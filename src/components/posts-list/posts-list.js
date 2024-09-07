import { React, useEffect, useContext, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Pagination, ConfigProvider, Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import { shortenDescription, appContext } from '../../utilities'
import PostHeader from '../post-header'
import { asyncRequestPostsList, pageChange } from '../../store/slices'

import stl from './posts-list.module.scss'

function PostsList() {
  const { page, postsList, error, isLoading, totalPosts } = useSelector((state) => state.postsListLoadState)
  const [currentPage, changeCurrentPage] = useState(page)
  const { tokenJWT } = useSelector((state) => state.authState)
  const dispatch = useDispatch()
  const apiClientInstance = useContext(appContext)
  const navigate = useNavigate()

  const changePage = (newPage) => {
    dispatch(pageChange(newPage))
  }

  // console.log('tokenJWT', tokenJWT)

  useEffect(() => {
    // console.log('useEffect')
    if (!postsList.length || currentPage !== page) {
      dispatch(asyncRequestPostsList({ apiClientInstance, page, tokenJWT }))
      changeCurrentPage(page)
    }
  }, [page, tokenJWT])

  function onClick(evt, slug) {
    if (evt.target.nodeName !== 'path') navigate(`/articles/${slug}`)
  }

  const loadingSpinner = isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null
  const errorMessage = error ? <Alert message={error} type="error" /> : null
  const pagination = postsList.length ? (
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
        total={totalPosts}
      />
    </ConfigProvider>
  ) : null

  const content = postsList.length
    ? postsList.map((article) => {
        const { slug, updatedAt, title, author, favoritesCount, favorited, description, tagList } = article
        return (
          <button
            // to={`/articles/${slug}`}
            onClick={(evt) => onClick(evt, slug)}
            key={`${slug}_${updatedAt}`}
            className={stl.post}
            // className={classNames(stl.link, stl.post)}
            type="button"
            data-type="post"
          >
            {/* // < key={`${slug}_${updatedAt}`} className={stl.post}> */}
            <PostHeader
              slug={slug}
              title={title}
              updatedAt={updatedAt}
              author={author}
              favoritesCount={favoritesCount}
              favorited={favorited}
              description={shortenDescription(description, 230)}
              tagList={tagList}
              data-type="post-header"
            />
          </button>
        )
      })
    : null

  return (
    // <main className={stl.main}>
    //   {/* <PostHeader />
    //   <PostHeader />
    //   <PostHeader /> */}
    //   {loadingSpinner}
    //   {errorMessage}
    //   {content}
    //   {pagination}
    // </main>

    <>
      {loadingSpinner}
      {errorMessage}
      {content}
      {pagination}
    </>
  )
}

export default PostsList
