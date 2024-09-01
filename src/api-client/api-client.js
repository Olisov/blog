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
    }
  }

  async getArticles(page) {
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
    // const searchParams = new URLSearchParams({ slug })
    // targetUrl.search = searchParams

    const serverResponse = await fetch(targetUrl, optionsGet)

    if (!serverResponse.ok && serverResponse.status !== 404) {
      // console.log('serverResponse.status', serverResponse.status)
      throw new Error(`Server failure, received ${serverResponse.status}`)
    }
    const serverResponseBody = await serverResponse.json()

    return serverResponseBody
  }
}
