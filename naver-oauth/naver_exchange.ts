type NaverRequest = {
  clientId: string
  secret: string
  code: string
  state: string
}

function asRecord(value: unknown) {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : undefined
}

async function requestJson(url: string, options: RequestInit, message: string) {
  try {
    const response = await fetch(url, {
      ...options,
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) throw new Error(message)
    return (await response.json()) as unknown
  } catch {
    // Never include a provider response or the request's credentials in errors.
    throw new Error(message)
  }
}

function parseToken(raw: unknown) {
  const data = asRecord(raw)
  const accessToken =
    typeof data?.access_token === 'string' ? data.access_token : ''
  if (!accessToken) return
  const refreshToken =
    typeof data.refresh_token === 'string' && data.refresh_token
      ? data.refresh_token
      : undefined
  const expiresIn = Number(data.expires_in)
  return {
    access_token: accessToken,
    ...(refreshToken ? { refresh_token: refreshToken } : {}),
    ...(Number.isFinite(expiresIn) && expiresIn > 0
      ? { expires_in: expiresIn }
      : {}),
  }
}

function optionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function parseProfile(raw: unknown) {
  const data = asRecord(raw)
  const response = asRecord(data?.response)
  if (
    data?.resultcode !== '00' ||
    typeof response?.id !== 'string' ||
    !response.id
  ) {
    return
  }
  const email =
    typeof response.email === 'string' && response.email.includes('@')
      ? response.email
      : undefined
  const nickname = optionalString(response.nickname)
  const name = optionalString(response.name)
  const profileImage = optionalString(response.profile_image)
  const gender =
    response.gender === 'F' || response.gender === 'M' || response.gender === 'U'
      ? response.gender
      : undefined
  const birthday =
    typeof response.birthday === 'string' && /^\d{2}-\d{2}$/.test(response.birthday)
      ? response.birthday
      : undefined
  const birthyear =
    typeof response.birthyear === 'string' && /^\d{4}$/.test(response.birthyear)
      ? response.birthyear
      : undefined
  const age =
    typeof response.age === 'string' && /^\d{1,3}-\d{0,3}$/.test(response.age)
      ? response.age
      : undefined
  return {
    id: response.id,
    ...(email ? { email } : {}),
    ...(nickname ? { nickname } : {}),
    ...(name ? { name } : {}),
    ...(profileImage ? { profile_image: profileImage } : {}),
    ...(gender ? { gender } : {}),
    ...(birthday ? { birthday } : {}),
    ...(birthyear ? { birthyear } : {}),
    ...(age ? { age } : {}),
  }
}

/** NAVER's app-specific ID is the identity; optional profile fields are not proof of email ownership. */
export async function exchangeNaverIdentity(request: NaverRequest) {
  const tokens = parseToken(
    await requestJson(
      'https://nid.naver.com/oauth2.0/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: request.clientId,
          client_secret: request.secret,
          code: request.code,
          state: request.state,
        }),
      },
      'naver-authorization-failed',
    ),
  )
  if (!tokens) throw new Error('naver-authorization-failed')
  const profile = parseProfile(
    await requestJson(
      'https://openapi.naver.com/v1/nid/me',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
      'naver-profile-failed',
    ),
  )
  if (!profile) throw new Error('naver-profile-failed')
  return {
    ...profile,
    accessToken: tokens.access_token,
    ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
    ...(tokens.expires_in ? { expiresIn: tokens.expires_in } : {}),
  }
}
