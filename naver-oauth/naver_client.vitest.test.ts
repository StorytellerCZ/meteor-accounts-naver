import { OAuth } from 'meteor/oauth'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { afterEach, expect, it, vi } from 'vitest'
import { requestCredential } from './naver_client'

afterEach(() => vi.restoreAllMocks())

it('reports a missing configuration without opening a popup', () => {
  const callback = vi.fn()
  const launch = vi.spyOn(OAuth, 'launchLogin')
  requestCredential(callback)
  expect(callback).toHaveBeenCalledWith(expect.any(Error))
  expect(launch).not.toHaveBeenCalled()
})

it('uses Meteor credential state and the registered callback URL', () => {
  vi.spyOn(ServiceConfiguration.configurations, 'findOne').mockReturnValue({
    service: 'naver',
    clientId: 'public-client-id',
  })
  vi.spyOn(OAuth, '_stateParam').mockReturnValue('signed-credential-state')
  const launch = vi.spyOn(OAuth, 'launchLogin')
  requestCredential(vi.fn())
  const options = launch.mock.calls[0][0] as {
    loginUrl: string
    credentialToken: string
  }
  const url = new URL(options.loginUrl)
  expect(url.origin).toBe('https://nid.naver.com')
  expect(url.searchParams.get('state')).toBe('signed-credential-state')
  expect(url.searchParams.get('redirect_uri')).toBe(
    'http://localhost:4200/_oauth/naver',
  )
  expect(url.searchParams.has('client_secret')).toBe(false)
  expect(options.credentialToken).toBeTruthy()
})
