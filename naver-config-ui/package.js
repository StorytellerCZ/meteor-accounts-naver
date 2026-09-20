/* global Package */
Package.describe({
  name: 'storyteller:naver-config-ui',
  summary: 'Blaze configuration templates for NAVER OAuth.',
  version: '1.0.0',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-naver',
})

Package.onUse((api) => {
  api.versionsFrom(['2.3.6', '3.0'])
  api.use('zodern:types@1.0.13', 'server')
  api.use(['ecmascript', 'typescript'], 'client')
  api.use('templating@1.4.3 || 2.0.0-alpha300.10', 'client')

  api.addFiles('naver_login_button.css', 'client')
  api.addFiles(['naver_configure.html', 'naver_configure.ts'], 'client')
})
