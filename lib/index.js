const { create } = require('axios')
const { removeUndefined } = require('@strapi/utils')

class SMSEnvoieError extends Error {
  constructor(status, message) {
    super(message)
    this.statusCode = status
  }
}

const provider = 'smsenvoi'
const name = 'SMSEnvoi'

const init = (providerOptions = {}, settings = {}) => {
  const axiosInstance = create({
    baseURL: 'https://api.smsenvoi.com/API/v1.0/REST',
    headers: {
      user_key: providerOptions.userKey,
      Access_token: providerOptions.accessToken,
      'Content-Type': 'application/json'
    }
  })

  return {
    async send(options) {
      const sms = {
        message_type: settings.defaultMessageType,
        sender: settings.defaultSender,
        message: options.message,
        recipient: Array.isArray(options.recipient) ? options.recipient.map(r => r.trim()) : [options.recipient.trim()],
        richsms_url: options.richURL
      }

      try {
        await axiosInstance.post('/sms', removeUndefined(sms))
      } catch (error) {
        if (error.response) {
          throw new SMSEnvoieError(error.response.status, `${error.response.data.error_type} => ${error.response.data.error_message}`)
        } else {
          console.error("[strapi-provider-sms-smsenvoi: Unknown error when sending SMS", error);
        }
      }
    }
  }
}

module.exports = {
  provider,
  name,
  init
}
