import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import { Naver } from 'meteor/storyteller:naver-oauth'

Accounts.oauth.registerService('naver')

if (Meteor.isClient) {
  const loginWithNaver = (options, callback) => {
    if (!callback && typeof options === 'function') {
      callback = options
      options = null
    }
    const credentialRequestCompleteCallback =
      Accounts.oauth.credentialRequestCompleteHandler(callback)
    Naver.requestCredential(options, credentialRequestCompleteCallback)
  }
  Accounts.registerClientLoginFunction('naver', loginWithNaver)
  Meteor.loginWithNaver = (...args) => Accounts.applyLoginFunction('naver', args)
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: [
      'services.naver.id',
      'services.naver.email',
      'services.naver.nickname',
      'services.naver.name',
    ],
    forOtherUsers: ['services.naver.id', 'services.naver.nickname'],
  })
}
