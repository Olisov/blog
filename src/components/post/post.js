import { React, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Markdown from 'react-markdown'

import { savePost, asyncRequestPost } from '../../store/slices'
import { appContext } from '../../utilities'
import PostHeader from '../post-header'

import stl from './post.module.scss'

function Post() {
  const apiClientInstance = useContext(appContext)
  const dispatch = useDispatch()
  const { slug } = useParams()
  const { postsList, isLoading, error, currentPost } = useSelector((state) => state.postsListLoadState)
  const { userName } = useSelector((state) => state.authState)

  useEffect(() => {
    if (!currentPost) {
      const idx = postsList.findIndex((article) => article.slug === slug)
      if (idx >= 0) dispatch(savePost(postsList[idx]))
      else dispatch(asyncRequestPost({ apiClientInstance, slug }))
    }
  }, [currentPost])

  const loadingSpinner = isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null

  const errorMessage =
    error && !isLoading ? <Alert message={error} type="error" banner /> : <div> 404 Page Not Found</div>
  const content = currentPost ? (
    <div className={stl.post}>
      <PostHeader
        title={currentPost.title}
        updatedAt={currentPost.updatedAt}
        author={currentPost.author}
        favoritesCount={currentPost.favoritesCount}
        favorited={currentPost.favorited}
        description={currentPost.description}
        tagList={currentPost.tagList}
        slug={slug}
        editBtns={currentPost.author.username === userName}
      />
      <div>
        <Markdown>{currentPost.body}</Markdown>
      </div>
    </div>
  ) : (
    errorMessage
  )

  return (
    <>
      {loadingSpinner}
      {content}
    </>
  )
}

export default Post
