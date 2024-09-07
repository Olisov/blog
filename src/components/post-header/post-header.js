import { React, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Rate } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { format } from 'date-fns'

import { randomHash, appContext } from '../../utilities'
import { saveRatePost, asyncRatePost } from '../../store/slices'
import defaultAva from '../../assets/default-ava.png'

import stl from './post-header.module.scss'

function PostHeader(props) {
  const {
    author: { username, image = defaultAva },
    favoritesCount,
    favorited,
    updatedAt,
    description,
    tagList,
    title,
    slug,
  } = props
  const { tokenJWT } = useSelector((state) => state.authState)
  const apiClientInstance = useContext(appContext)
  const dispatch = useDispatch()

  // console.log('slug', slug)

  function onRate() {
    console.log('onRate')
    dispatch(asyncRatePost({ apiClientInstance, requestData: { tokenJWT, slug, isFavored: favorited } }))
  }

  const customIcons = {
    0: <HeartOutlined />,
    1: <HeartFilled />,
  }

  return (
    // <section className={stl.body}>
    <div className={stl.body}>
      <div className={stl['left-side']}>
        <div className={stl['title-group']}>
          <div className={stl.title}>{title}</div>
          <div className={stl['rate-group']}>
            <Rate
              count={1}
              data-type="heart"
              className={stl['rate-icon']}
              onChange={onRate}
              value={favorited ? 1 : 0}
              character={({ index = 0 }) => customIcons[index + 1]}
              disabled={!tokenJWT}
            />
            <span className={stl['rate-title']}>{favoritesCount}</span>
          </div>
        </div>
        <div className={stl['tag-group']}>
          {tagList.map((tag) => {
            if (!tag) return null
            return (
              <div key={randomHash()} className={stl.tag}>
                {tag}
              </div>
            )
          })}
        </div>
        <div className={stl.text}>{description}</div>
      </div>
      <div className={stl.profile}>
        <div className={stl['profile-label']}>
          <div className={stl.name}>{username}</div>
          <div className={stl.date}>{updatedAt ? format(new Date(updatedAt), 'MMMM d, y') : 'No date'}</div>
        </div>
        <img className={stl['profile-img']} alt="Profile" src={image} />
      </div>
      {/* </section> */}
    </div>
  )
}

PostHeader.propTypes = {
  author: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
  favoritesCount: PropTypes.number.isRequired,
  favorited: PropTypes.bool.isRequired,
  updatedAt: PropTypes.string.isRequired,
  description: PropTypes.string,
  tagList: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default PostHeader
