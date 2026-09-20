# naver-config-ui

Blaze configuration templates for [NAVER](https://www.naver.com) OAuth (`accounts-ui`).

If you are not using `accounts-ui`, skip the Blaze templates and put the Client ID and Client Secret in Meteor `settings.json` as shown below. `service-configuration` loads that block at startup.

## Get Client ID and Client Secret from NAVER

Keys come from [NAVER Developers](https://developers.naver.com). The console UI is Korean. Menu names below are the labels you will see.

1. Sign in at [NAVER Developers](https://developers.naver.com) with a NAVER account. The account that registers the app becomes the administrator.
2. Open [Application → 애플리케이션 등록](https://developers.naver.com/apps/#/register?api=nvlogin) (Register Application). First-time registration asks you to accept the terms and complete a one-time phone check.
3. Set **애플리케이션 이름** (application name). This name appears on NAVER's consent screen; keep it short and recognisable (under 10 characters is recommended).
4. Under **사용 API**, add **네이버 로그인**.
5. Under **로그인 오픈 API 서비스 환경**, add **PC 웹**. Add **Mobile 웹** as well if people will sign in from phones.
6. For each web environment:
   - **서비스 URL**: the site domain only, no protocol or port (`localhost` for local Meteor, `literaryuniverse.com` in production). NAVER treats `www` and subdomains of that domain as the same site.
   - **네이버 로그인 Callback URL**: Meteor's OAuth callback, including protocol and port, with no trailing path slash after `naver`. Local Meteor on port 4200:

     ```
     http://localhost:4200/_oauth/naver
     ```

     Production is `https://<your-host>/_oauth/naver`. The value must match `ROOT_URL` exactly or NAVER rejects the login. You can register up to five callback URLs (local, staging, production).
7. Register the application. Open [Application → 내 애플리케이션](https://developers.naver.com/apps/#/list), select the app, and open the **개요** tab.
8. Copy **Client ID**. Click **보기** next to **Client Secret** to reveal it. Treat the secret like a password; if it leaks, click **재발급** to rotate it. Client ID cannot be changed.

Full register walkthrough: [애플리케이션 등록](https://developers.naver.com/docs/common/openapiguide/appregister.md). Login API details: [네이버 로그인 개발가이드](https://developers.naver.com/docs/login/devguide/devguide.md).

### Profile fields

On the app's **API 설정** tab, the member id (**이용자 식별자**) is always provided. This package uses:

| Console permission | Required / additional | Stored as |
| --- | --- | --- |
| Member id | basic | `services.naver.id` |
| Contact email address | required | `services.naver.email` and unverified `emails[]` (Novu / mail) |
| Nickname | required | `services.naver.nickname` and the new username |
| Member name | additional | `services.naver.name` and profile `givenName` |
| Profile photo | additional | `services.naver.profile_image` and profile `avatar` |
| Gender | additional | `services.naver.gender` and profile `gender` (`F`/`M`) |
| Birthday | additional | `services.naver.birthday` (`MM-DD`) |
| Year of birth | additional | `services.naver.birthyear`; with birthday this becomes `profile.birthday` |
| Age range | additional | `services.naver.age`; used for `profile.birthday` when year+day are missing |

Leave mobile phone off unless the product uses it. NAVER's production review checks that extra fields are actually used. The email is stored unverified because NAVER does not send a verification claim.

### Testers and production review

Until NAVER approves the app, only the registering account and IDs listed under **멤버관리** can complete login. Add tester NAVER IDs there for local work.

Public login needs a passing [사전 검수](https://developers.naver.com/docs/login/verify/verify.md) (pre-review) from **네이버 로그인 검수 상태**. While the app is still in development, that is a NAVER console step, not a Meteor setting.

## Put the keys in `settings.json`

Meteor's `service-configuration` package reads `packages.service-configuration.naver` and upserts the service. Do not put the secret under `public`.

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

| Field | NAVER console | Notes |
| --- | --- | --- |
| `clientId` | Client ID on **개요** | Public. Safe to show in the authorize URL. |
| `secret` | Client Secret on **개요** | Server-only. Never commit real values. |
| `loginStyle` | (Meteor, not NAVER) | `popup` or `redirect`. Use `popup`. |

Run Meteor with `--settings settings.json` (or `settings.local.json` / `settings.dev.json` / `settings.production.json` in this repo). After a restart, `ServiceConfiguration.configurations` contains `{ service: 'naver', clientId, secret, loginStyle }`. You do not need a manual `upsert` when this block is present.

If you use `accounts-ui` instead of settings, this package's dialog asks for the same Client ID and Client Secret. The callback URL shown in that dialog is `{{ROOT_URL}}_oauth/naver`.
