import { React, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Markdown from 'react-markdown'

import { savePost, asyncRequestPost, resetPost } from '../../store/slices'
import { appContext } from '../../utilities'
import PostHeader from '../post-header'

import stl from './post.module.scss'

function Post() {
  const apiClientInstance = useContext(appContext)
  const dispatch = useDispatch()
  const { slug } = useParams()
  const { postsList } = useSelector((state) => state.articlesLoad)
  const { isLoading, error, post } = useSelector((state) => state.postLoadState)

  useEffect(() => {
    const idx = postsList.findIndex((article) => article.slug === slug)
    if (idx >= 0) dispatch(savePost(postsList[idx]))
    else dispatch(asyncRequestPost({ apiClientInstance, slug }))

    return () => {
      dispatch(resetPost())
    }
  }, [slug])

  const loadingSpinner = isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null

  const errorMessage =
    error && !isLoading ? <Alert message={error} type="error" banner /> : <div> 404 Page Not Found</div>
  const content = post ? (
    <div className={stl.post}>
      <PostHeader
        title={post.title}
        updatedAt={post.updatedAt}
        author={post.author}
        favoritesCount={post.favoritesCount}
        favorited={post.favorited}
        description={post.description}
        tagList={post.tagList}
      />
      <div>
        <Markdown>{post.body}</Markdown>
      </div>
    </div>
  ) : (
    errorMessage
  )

  return (
    // <div className={stl.main}>
    //   {loadingSpinner}
    //   {content}
    // </div>

    <>
      {loadingSpinner}
      {content}
    </>
  )
}

export default Post
