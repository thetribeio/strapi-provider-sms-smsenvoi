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

const DEFAULT_MESSAGE_TYPE = "PRM"


const init = (providerOptions = {}, settings = {}) => {
  const baseURL = 'https://api.smsenvoi.com/API/v1.0/REST';
  let axiosInstance;
  if (providerOptions.userKey && providerOptions.accessToken) {
    axiosInstance = create({
      baseURL,
      headers: {
        user_key: providerOptions.userKey,
        Access_token: providerOptions.accessToken,
        'Content-Type': 'application/json'
      }
    })
  } else {
    throw new SMSEnvoieError(0, "Unable to initialize provider, no credentials provided")
  }

  return {
    async send(options) {
      let messageType = settings.defaultMessageType
      if (!settings.defaultMessageType) {
        strapi.log.debug(`[strapi-provider-sms-smsenvoi] No default message type, using default '${DEFAULT_MESSAGE_TYPE}'`)
        messageType = DEFAULT_MESSAGE_TYPE
      }

      const sms = {
        message_type: messageType,
        sender: options.sender || settings.defaultSender,
        message: options.message,
        recipient: Array.isArray(options.recipient) ? options.recipient.map(r => r.trim()) : [options.recipient.trim()],
        richsms_url: options.richURL
      }

      try {
        await axiosInstance.post('/sms', removeUndefined(sms))
      } catch (error) {
        if (error.response?.status && error?.response?.data) {
          if (error.response.data.error_type) {
            throw new SMSEnvoieError(error.response.status, `${error.response.data.error_type} => ${error.response.data.error_message}`)
          } else if (error.response.data.result) {
            throw new SMSEnvoieError(error.response.status, error.response.data.result)
          } else {
            throw new SMSEnvoieError(error.response.status, JSON.stringify(error.response.data))
          }
        } else {
          console.error("[strapi-provider-sms-smsenvoi: Unknown error when sending SMS", error)
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
