# naver-oauth

An implementation of the [NAVER](https://www.naver.com) OAuth flow. See the [Meteor Guide](https://guide.meteor.com/accounts.html) for more details.

How to register the NAVER application, copy Client ID / Client Secret, and write `settings.json` is in the `storyteller:naver-config-ui` README.

## Configuration

Put the keys from NAVER Developers **개요** in Meteor settings. `service-configuration` loads this block at startup:

```json
{
  "packages": {
    "service-configuration": {
      "naver": {
        "loginStyle": "popup",
        "clientId": "YOUR_NAVER_CLIENT_ID",
        "secret": "YOUR_NAVER_CLIENT_SECRET"
      }
    }
  }
}
```

Keep `secret` out of `public`. Register the callback `<ROOT_URL>/_oauth/naver` exactly in the NAVER console, including the port for local testing.

If you are not using settings, upsert the same fields on the server:

```javascript
ServiceConfiguration.configurations.upsert(
  { service: 'naver' },
  {
    $set: {
      loginStyle: 'popup',
      clientId: 'YOUR_NAVER_CLIENT_ID',
      secret: 'YOUR_NAVER_CLIENT_SECRET',
    },
  },
)
```

#### loginStyle

`popup` or `redirect`. `popup` is recommended.

#### clientId

Client ID from NAVER Developers → 내 애플리케이션 → 개요.

#### secret

Client Secret from the same 개요 tab.

## Calling login

Use `Meteor.loginWithNaver` from `storyteller:accounts-naver`:

```typescript
Meteor.loginWithNaver({ loginStyle: 'popup' }, (error) => {
  if (error) {
    /* handle error */
  }
})
```

## Integrations

### Meteor Link Accounts

This package is part of [bozhao:link-accounts](https://atmospherejs.com/bozhao/link-accounts), which links multiple login services on one account.
