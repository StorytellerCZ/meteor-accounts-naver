/* global Package */
Package.describe({
  name: 'storyteller:naver-oauth',
  summary: 'NAVER OAuth flow',
  version: '1.0.0',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-naver',
})

Package.onUse((api) => {
  api.versionsFrom(['2.9.0', '3.0', '3.2', '3.4'])
  api.use('zodern:types@1.0.13', 'server')
  api.use(['ecmascript', 'typescript'], ['client', 'server'])
  api.use('oauth2', ['client', 'server'])
  api.use('oauth', ['client', 'server'])
  api.use(['fetch', 'url'], 'server')
  api.use('random', 'client')
  api.use('service-configuration', ['client', 'server'])

  api.mainModule('naver_client.ts', 'client')
  api.mainModule('naver_server.ts', 'server')
  api.export('Naver')
})
