declare module 'storyteller:accounts-naver' {}

declare module 'meteor/meteor' {
  namespace Meteor {
    function loginWithNaver(
      options?: Meteor.LoginWithExternalServiceOptions,
      callback?: (
        error?: Error | Meteor.Error | Meteor.TypedError,
      ) => void,
    ): void
    function linkWithNaver(
      options?: Meteor.LoginWithExternalServiceOptions,
      callback?: (
        error?: Error | Meteor.Error | Meteor.TypedError,
      ) => void,
    ): void
  }
}
