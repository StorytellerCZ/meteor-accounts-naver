import { OAuth } from 'meteor/oauth'
import { Random } from 'meteor/random'
import { ServiceConfiguration } from 'meteor/service-configuration'

type CredentialCallback = (credentialTokenOrError?: string | Error) => void

export type NaverRequestOptions = {
  loginStyle?: string
  redirectUrl?: string
}

export function requestCredential(
  options?: NaverRequestOptions | CredentialCallback,
  credentialRequestCompleteCallback?: CredentialCallback,
) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options
    options = {}
  } else if (!options || typeof options === 'function') {
    options = {}
  }

  const config = ServiceConfiguration.configurations.findOne({ service: 'naver' })
  if (!config) {
    credentialRequestCompleteCallback?.(new ServiceConfiguration.ConfigError())
    return
  }

  const credentialToken = Random.secret()
  const loginStyle = OAuth._loginStyle('naver', config, options)
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: OAuth._redirectUri('naver', config),
    state: OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl),
  })

  OAuth.launchLogin({
    loginService: 'naver',
    loginStyle,
    loginUrl: `https://nid.naver.com/oauth2.0/authorize?${params}`,
    credentialRequestCompleteCallback,
    credentialToken,
    popupOptions: { width: 500, height: 700 },
  })
}

export const Naver = { requestCredential }
