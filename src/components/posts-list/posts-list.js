import { React, useEffect, useContext, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Pagination, ConfigProvider, Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { shortenDescription, appContext } from '../../utilities'
import PostHeader from '../post-header'
import { asyncRequestPostsList, pageChange } from '../../store/slices'

import stl from './posts-list.module.scss'

function PostsList() {
  const { page, postsList, error, isLoading, totalPosts, currentPost } = useSelector(
    (state) => state.postsListLoadState
  )
  const [currentPage, changeCurrentPage] = useState(page)
  const { tokenJWT, isLoading: authIsLoading, error: authError } = useSelector((state) => state.authState)
  const dispatch = useDispatch()
  const apiClientInstance = useContext(appContext)
  const navigate = useNavigate()

  const lastPage = Math.ceil(totalPosts / 5)

  const changePage = (newPage) => {
    dispatch(pageChange(newPage))
  }

  useEffect(() => {
    if ((currentPage !== lastPage && postsList.length !== 5) || currentPage !== page) {
      dispatch(asyncRequestPostsList({ apiClientInstance, page, tokenJWT }))
      if (currentPage !== page) changeCurrentPage(page)
    }
  }, [page, tokenJWT, postsList.length, currentPost])

  function onClick(evt, slug) {
    if (evt.target.nodeName !== 'path') navigate(`/articles/${slug}`)
  }

  const loadingSpinner = isLoading || authIsLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null
  const errorMessage = error ? <Alert message={error} closable type="error" /> : null
  const authErrorMessage = authError ? <Alert message={authError} closable type="error" /> : null
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
            onClick={(evt) => onClick(evt, slug)}
            key={`${slug}_${updatedAt}`}
            className={stl.post}
            type="button"
            data-type="post"
          >
            <PostHeader
              slug={slug}
              title={title}
              updatedAt={updatedAt}
              author={author}
              favoritesCount={favoritesCount}
              favorited={favorited}
              description={shortenDescription(description, 230)}
              tagList={tagList}
              editBtns={false}
            />
          </button>
        )
      })
    : null

  return (
    <>
      {loadingSpinner}
      {errorMessage}
      {authErrorMessage}
      {content}
      {pagination}
    </>
  )
}

export default PostsList
