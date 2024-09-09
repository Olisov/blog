import { React, useContext, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Alert, Spin, ConfigProvider } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useForm } from 'react-hook-form'
import { Navigate, useParams } from 'react-router-dom'
import classNames from 'classnames'

import { randomHash, appContext } from '../../utilities'
import { asyncCreatePost, asyncRequestPost, asyncUpdatePost } from '../../store/slices'

import stl from './post-config.module.scss'

function PostConfig() {
  const { slug } = useParams()
  const { isLoading, error, currentPost } = useSelector((state) => state.postsListLoadState)
  const [tagsList, changeTagsList] = useState(
    currentPost && slug
      ? currentPost.tagList.map((tag) => ({ id: randomHash(), tag }))
      : [{ id: randomHash(), tag: '' }]
  )
  const [isSubmitted, changeIsSubmitted] = useState(false)
  const apiClientInstance = useContext(appContext)
  const dispatch = useDispatch()
  const { tokenJWT } = useSelector((state) => state.authState)

  const {
    register,
    unregister,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
    values: {
      title: currentPost && slug ? currentPost.title : '',
      'short-description': currentPost && slug ? currentPost.description : '',
      'post-body': currentPost && slug ? currentPost.body : '',
    },
  })

  useEffect(() => {
    if (slug && !currentPost) dispatch(asyncRequestPost({ apiClientInstance, slug }))
    if (currentPost && slug) changeTagsList(currentPost.tagList.map((tag) => ({ id: randomHash(), tag })))
  }, [currentPost])

  const onSubmit = (formData) => {
    const tagsName = Object.keys(formData).filter((key) => key.startsWith('tag'))
    const tags = []

    tagsName.forEach((tagName) => {
      tags.push(formData[tagName])
    })

    const newArticle = {
      title: formData.title,
      description: formData['short-description'],
      body: formData['post-body'],
      tagList: tags,
    }

    if (slug) {
      dispatch(
        asyncUpdatePost({
          apiClientInstance,
          tokenJWT,
          slug,
          updatedArticle: newArticle,
        })
      )
    } else {
      dispatch(
        asyncCreatePost({
          apiClientInstance,
          tokenJWT,
          newArticle,
        })
      )
    }
    changeIsSubmitted(true)
  }

  if (isSubmitted && !isLoading && !error) return <Navigate to={`/articles/${currentPost.slug}`} />
  if (!tokenJWT) return <Navigate to="/" replace />

  const onAddTag = () => {
    changeTagsList((lastState) => [...lastState, { id: randomHash(), tag: '' }])
  }

  const onDeleteTag = (id) => {
    unregister(`tag-${id}`)
    changeTagsList((lastState) => lastState.filter((tag) => tag.id !== id))
  }

  const loadingSpinner = isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null
  const errorMessage = error && !isLoading ? <Alert message={error} banner type="error" /> : null

  return (
    <form className={stl.body} onSubmit={handleSubmit(onSubmit)}>
      <div className={stl.title}>{currentPost ? 'Edit article' : 'Create new article'}</div>
      {loadingSpinner}
      {errorMessage}
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Title</div>
        <input
          className={errors.title ? classNames(stl.input, stl['incorrect-input']) : classNames(stl.input)}
          {...register('title', {
            required: 'This field is required!',
          })}
          placeholder="Title"
        />
        {errors.title ? <div className={stl['incorrect-message']}>{errors.title.message}</div> : null}
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Short description</div>
        <input
          className={
            errors['short-description'] ? classNames(stl.input, stl['incorrect-input']) : classNames(stl.input)
          }
          {...register('short-description', {
            required: 'This field is required!',
          })}
          placeholder="Short description"
        />
        {errors['short-description'] ? (
          <div className={stl['incorrect-message']}>{errors['short-description'].message}</div>
        ) : null}
      </div>

      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Text</div>
        <textarea
          className={
            errors['post-body'] ? classNames(stl['input-area'], stl['incorrect-input']) : classNames(stl['input-area'])
          }
          {...register('post-body', {
            required: 'This field is required!',
            value: currentPost ? currentPost.body : '',
          })}
          placeholder="Text"
        />
        {errors['post-body'] ? <div className={stl['incorrect-message']}>{errors['post-body'].message}</div> : null}
      </div>

      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Tags</div>
        <div className={stl['tags-field']}>
          <div className={stl['tags-group']}>
            {tagsList.map((tag) => {
              return (
                <div key={tag.id} className={stl.tag}>
                  <input
                    className={stl['tag-input']}
                    {...register(`tag-${tag.id}`, {
                      required: 'This field is required!',
                      value: tag.tag,
                    })}
                    placeholder="tag"
                  />
                  <Button danger size="large" onClick={() => onDeleteTag(tag.id)} className={stl['tag-delete-btn']}>
                    Delete
                  </Button>
                </div>
              )
            })}
          </div>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultBorderColor: '#1890ff',
                  defaultColor: '#1890ff',
                  defaultHoverBg: '#1890ff',
                  defaultHoverColor: '#fff',
                },
              },
            }}
          >
            <Button size="large" onClick={onAddTag} className={stl['add-tag-btn']}>
              Add tag
            </Button>
          </ConfigProvider>
        </div>
      </div>

      <Button type="primary" htmlType="submit" disabled={!isValid} className={stl['submit-btn']}>
        Send
      </Button>
    </form>
  )
}

export default PostConfig
