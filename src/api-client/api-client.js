export default class ApiClient {
  constructor() {
    this.storage = {
      baseUrl: new URL('https://blog.kata.academy/api/'),
      optionsGet: {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      },
      optionsPost: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: '{"user":{"username":"string","email":"string@mail.com","password":"string"}}',
      },
    }
  }

  async getPostsList(page) {
    const { baseUrl, optionsGet } = this.storage
    const targetUrl = new URL('/api/articles', baseUrl)
    const searchParams = new URLSearchParams({ limit: 5, offset: page * 5 - 5 })
    targetUrl.search = searchParams

    const serverResponse = await fetch(targetUrl, optionsGet)

    if (!serverResponse.ok) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    return serverResponseBody
  }

  async getPost(slug) {
    const { baseUrl, optionsGet } = this.storage
    const targetUrl = new URL(`/api/articles/${slug}`, baseUrl)
    const serverResponse = await fetch(targetUrl, optionsGet)

    if (!serverResponse.ok && serverResponse.status !== 404) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    return serverResponseBody
  }

  async userAuth({ username, email, password, authType }) {
    const { baseUrl, optionsPost } = this.storage
    const targetUrl = authType === 'create' ? new URL('/api/users', baseUrl) : new URL('/api/users/login', baseUrl)
    optionsPost.body =
      authType === 'create'
        ? JSON.stringify({
            user: { username, email, password },
          })
        : JSON.stringify({
            user: { email, password },
          })

    const serverResponse = await fetch(targetUrl, optionsPost)

    if (!serverResponse.ok && serverResponse.status !== 422) {
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()
    return serverResponseBody
  }
}
