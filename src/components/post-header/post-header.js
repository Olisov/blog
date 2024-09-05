import React from 'react'
import { Rate } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { format } from 'date-fns'

import { randomHash } from '../../utilities'
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
  } = props

  function onRate() {
    // console.log('like click')
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
              className={stl['rate-icon']}
              onChange={onRate}
              defaultValue={favorited ? 1 : 0}
              character={({ index = 0 }) => customIcons[index + 1]}
              disabled
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
  favoritesCount: PropTypes.number.isRequired,
  favorited: PropTypes.bool.isRequired,
  updatedAt: PropTypes.string.isRequired,
  description: PropTypes.string,
  tagList: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default PostHeader
