import { afterEach, expect, it, vi } from 'vitest'
import { exchangeNaverIdentity } from './naver_exchange'

const request = {
  clientId: 'client',
  secret: 'secret-value',
  code: 'one-use-code',
  state: 'meteor-state',
}
afterEach(() => vi.unstubAllGlobals())

it('exchanges a code server-side and identifies the account by provider ID', async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({
        access_token: 'access',
        refresh_token: 'refresh',
        expires_in: '3600',
      }),
    )
    .mockResolvedValueOnce(
      Response.json({
        resultcode: '00',
        response: {
          id: 'stable-id',
          email: 'reader@example.com',
          nickname: 'Reader',
          name: '오픈 API',
          profile_image: 'https://phinf.pstatic.net/contact/reader.jpg',
          gender: 'F',
          birthday: '10-01',
          birthyear: '1990',
          age: '20-29',
        },
      }),
    )
  vi.stubGlobal('fetch', fetcher)
  const identity = await exchangeNaverIdentity(request)
  expect(identity).toEqual({
    id: 'stable-id',
    email: 'reader@example.com',
    nickname: 'Reader',
    name: '오픈 API',
    profile_image: 'https://phinf.pstatic.net/contact/reader.jpg',
    gender: 'F',
    birthday: '10-01',
    birthyear: '1990',
    age: '20-29',
    accessToken: 'access',
    refreshToken: 'refresh',
    expiresIn: 3600,
  })
  const [url, options] = fetcher.mock.calls[0]
  expect(url).toBe('https://nid.naver.com/oauth2.0/token')
  expect(options.method).toBe('POST')
  expect(options.body.get('state')).toBe('meteor-state')
  expect(options.body.get('client_secret')).toBe('secret-value')
  expect(fetcher.mock.calls[1][1].headers.Authorization).toBe('Bearer access')
})

it('accepts a profile without optional consented fields', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({ access_token: 'access', expires_in: '3600' }),
      )
      .mockResolvedValueOnce(
        Response.json({ resultcode: '00', response: { id: 'stable-id' } }),
      ),
  )
  expect(await exchangeNaverIdentity(request)).toEqual({
    id: 'stable-id',
    accessToken: 'access',
    expiresIn: 3600,
  })
})

it('does not expose provider error bodies or credentials', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        Response.json({ error: 'secret-value' }, { status: 401 }),
      ),
  )
  await expect(exchangeNaverIdentity(request)).rejects.toThrow(
    'naver-authorization-failed',
  )
})

it('rejects a profile response without a stable ID', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValueOnce(Response.json({ access_token: 'access' }))
      .mockResolvedValueOnce(
        Response.json({ resultcode: '00', response: { nickname: 'Reader' } }),
      ),
  )
  await expect(exchangeNaverIdentity(request)).rejects.toThrow(
    'naver-profile-failed',
  )
})
