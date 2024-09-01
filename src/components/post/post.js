import { React } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Markdown from 'react-markdown'

import PostHeader from '../post-header'

import stl from './post.module.scss'

function Post() {
  const { slug } = useParams()
  const { articles } = useSelector((state) => state.articlesLoad)

  const idx = articles.findIndex((article) => article.slug === slug)

  const article = idx ? articles[idx] : null
  const { updatedAt, title, author, favoritesCount, favorited, description, tagList, body } = article
  console.log('article', article)

  return (
    <div className={stl.main}>
      <div className={stl.post}>
        <PostHeader
          title={title}
          updatedAt={updatedAt}
          author={author}
          favoritesCount={favoritesCount}
          favorited={favorited}
          description={description}
          tagList={tagList}
        />
        <div>
          <Markdown>{body}</Markdown>
        </div>
      </div>
    </div>
  )
}

export default Post
