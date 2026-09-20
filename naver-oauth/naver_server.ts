import { OAuth } from 'meteor/oauth'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { exchangeNaverIdentity } from './naver_exchange'

function asRecord(value: unknown) {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : undefined
}

OAuth.registerService('naver', 2, null, async (query: unknown) => {
  const data = asRecord(query)
  const code = typeof data?.code === 'string' ? data.code : ''
  const state = typeof data?.state === 'string' ? data.state : ''
  if (!code || !state) throw new Error('naver-authorization-failed')
  const config = await ServiceConfiguration.configurations.findOneAsync({
    service: 'naver',
  })
  if (!config) throw new ServiceConfiguration.ConfigError()
  const identity = await exchangeNaverIdentity({
    clientId: config.clientId,
    secret: OAuth.openSecret(config.secret),
    code,
    state,
  })
  const { accessToken, refreshToken, expiresIn, ...profile } = identity
  return {
    serviceData: {
      ...profile,
      accessToken: OAuth.sealSecret(accessToken),
      ...(refreshToken ? { refreshToken: OAuth.sealSecret(refreshToken) } : {}),
      ...(expiresIn ? { expiresAt: Date.now() + expiresIn * 1000 } : {}),
    },
    options: {},
  }
})

export const Naver = {
  retrieveCredential: (credentialToken: string, credentialSecret?: string) =>
    OAuth.retrieveCredential(credentialToken, credentialSecret),
}
