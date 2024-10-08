export default class ApiClient {
  constructor() {
    this.storage = {
      baseUrl: new URL('https://blog.kata.academy/api/'),
    }
  }

  async getPostsList({ page, tokenJWT }) {
    const { baseUrl } = this.storage
    const optionsGet = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
    if (tokenJWT) optionsGet.headers.Authorization = `Token ${tokenJWT}`

    const targetUrl = new URL('articles', baseUrl)
    const searchParams = new URLSearchParams({ limit: 5, offset: page * 5 - 5 })
    targetUrl.search = searchParams

    const serverResponse = await fetch(targetUrl, optionsGet)

    if (!serverResponse.ok) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    return serverResponseBody
  }

  async getPost({ slug, tokenJWT }) {
    const { baseUrl } = this.storage
    const targetUrl = new URL(`articles/${slug}`, baseUrl)
    const optionsGet = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
    if (tokenJWT) optionsGet.headers.Authorization = `Token ${tokenJWT}`

    const serverResponse = await fetch(targetUrl, optionsGet)

    if (!serverResponse.ok && serverResponse.status !== 404) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    return serverResponseBody
  }

  async sentNewPost({ tokenJWT, newArticle }) {
    const { baseUrl } = this.storage
    const targetUrl = new URL('articles', baseUrl)
    const optionsPost = {
      method: 'POST',
      headers: {
        Authorization: `Token ${tokenJWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article: newArticle }),
    }

    const serverResponse = await fetch(targetUrl, optionsPost)
    console.log('serverResponse', serverResponse)

    if (!serverResponse.ok) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    console.log('serverResponseBody', serverResponseBody)
    return serverResponseBody
  }

  async ratePost({ slug, tokenJWT, isFavored }) {
    const { baseUrl } = this.storage
    const targetUrl = new URL(`articles/${slug}/favorite`, baseUrl)
    const options = {
      method: !isFavored ? 'POST' : 'DELETE',
      headers: {
        Authorization: `Token ${tokenJWT}`,
      },
    }

    const serverResponse = await fetch(targetUrl, options)

    if (!serverResponse.ok) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    return serverResponseBody
  }

  async deletePost({ slug, tokenJWT }) {
    const { baseUrl } = this.storage
    const targetUrl = new URL(`articles/${slug}`, baseUrl)
    const optionsDelete = {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${tokenJWT}`,
      },
    }

    const serverResponse = await fetch(targetUrl, optionsDelete)
    if (!serverResponse.ok) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
  }

  async userAuth({ username, email, password, authType }) {
    const { baseUrl } = this.storage

    const targetUrl = authType === 'create' ? new URL('users', baseUrl) : new URL('users/login', baseUrl)

    const optionsPost = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:
        authType === 'create'
          ? JSON.stringify({
              user: { username, email, password },
            })
          : JSON.stringify({
              user: { email, password },
            }),
    }
    const serverResponse = await fetch(targetUrl, optionsPost)

    if (!serverResponse.ok && serverResponse.status !== 422) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    return serverResponseBody
  }

  async getUserAuthData(tokenJWT) {
    const { baseUrl } = this.storage
    const targetUrl = new URL('user', baseUrl)
    const optionsGet = {
      method: 'GET',
      headers: {
        Authorization: `Token ${tokenJWT}`,
      },
    }

    const serverResponse = await fetch(targetUrl, optionsGet)

    if (!serverResponse.ok) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    return serverResponseBody
  }

  async updateUserAuth({ tokenJWT, username, email, password, avatarImgUrl }) {
    const { baseUrl } = this.storage
    const targetUrl = new URL('user', baseUrl)

    const optionsPut = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${tokenJWT}`,
      },
      body: JSON.stringify({
        user: { username, email, password, image: avatarImgUrl },
      }),
    }

    const serverResponse = await fetch(targetUrl, optionsPut)

    if (!serverResponse.ok) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    return serverResponseBody
  }
}
