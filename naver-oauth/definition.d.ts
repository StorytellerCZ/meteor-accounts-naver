declare module 'meteor/storyteller:naver-oauth' {
  export const Naver: {
    requestCredential(
      options?: {
        loginStyle?: string
        redirectUrl?: string
      },
      callback?: (credentialTokenOrError?: string | Error) => void,
    ): void
    retrieveCredential(
      credentialToken: string,
      credentialSecret?: string,
    ): unknown
  }
}
