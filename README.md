# strapi-provider-sms-smsenvoi

Note: this package needs to be used with a sms provider for Strapi, such as https://github.com/thetribeio/strapi-plugin-sms.

## Credentials

Check [smsenvoi authentication instruction](https://developers.smsenvoi.com/?java#authenticate-using-a-user-token) to get user key and access token

## Example

**Path -** `config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  sms: {
    config: {
      provider: 'smsenvoi',
      providerOptions: {
        userKey: env('SMS_ENVOI_USER_KEY'),
        accessToken: env('SMS_ENVOI_ACCESS_TOKEN')
      },
      settings: {
        defaultSender: env('SMS_ENVOI_ACCESS_TOKEN', 'Strapi')
      },
    },
  },
  // ...
});
```

Check out the available options for smsenvoi: https://developers.smsenvoi.com/

### Development mode

You can override the default configurations for specific environments. E.g. for
`NODE_ENV=development` in **config/env/development/plugins.js**:

```js
module.exports = ({ env }) => ({
  sms: {
    config: {
      provider: 'smsenvoi',
      providerOptions: {
        userKey: env('SMS_ENVOI_USER_KEY'),
        accessToken: env('SMS_ENVOI_ACCESS_TOKEN')
      },
      settings: {
        defaultSender: env('SMS_ENVOI_ACCESS_TOKEN', 'Strapi')
      },
    },
  },
});
```

## Usage

To send an sms from anywhere inside Strapi:

```js
await strapi.plugin('sms').service('sms').send({
  recipient: ['+33600000000'],
  sender: 'My Sender',
  message: 'Hello world',
  richURL: 'https://example.com'
});
```

The following fields are supported:

| Field       | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| sender      | Name of the sender                                                |
| recipient   | Phone numbers of the recipients                                   |
| text        | Plaintext version of the message                                  |
| richURL     | URL used to replace the %RICHURL________% placeholder             |
