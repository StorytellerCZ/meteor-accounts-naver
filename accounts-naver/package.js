/* global Package */
Package.describe({
  name: 'storyteller:accounts-naver',
  summary: 'Login service for NAVER accounts',
  version: '1.0.0',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-naver',
})

Package.onUse((api) => {
  api.versionsFrom(['2.9.0', '3.0'])
  api.use(['ecmascript', 'typescript'])
  api.use('zodern:types@1.0.13')
  api.use('accounts-base', ['client', 'server'])
  api.imply('accounts-base', ['client', 'server'])
  api.use('accounts-oauth', ['client', 'server'])
  api.use('storyteller:naver-oauth@1.0.0')
  api.imply('storyteller:naver-oauth')

  api.use(
    ['accounts-ui', 'storyteller:naver-config-ui@1.0.0'],
    ['client', 'server'],
    { weak: true },
  )
  api.addFiles('notice.ts')
  api.addFiles('naver.ts')
  api.export('Naver')
})
