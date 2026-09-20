/* @globals Package */
if (
  Package['accounts-ui'] &&
  !Package['service-configuration'] &&
  !Object.prototype.hasOwnProperty.call(Package, 'naver-config-ui')
) {
  console.warn(
    "Note: You're using accounts-ui and accounts-naver,\n" +
      "but didn't install the configuration UI for NAVER\n" +
      'OAuth. You can install it with:\n' +
      '\n' +
      '    meteor add storyteller:naver-config-ui' +
      '\n',
  )
}
