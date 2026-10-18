/*CMD
  command: /chck_trx
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Deposit

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var message_id = request.message.message_id
var chat_id = request.message.chat.id
Api.deleteMessage({
  chat_id: chat_id,
  message_id: message_id
})
Api.deleteMessage({
  chat_id: chat_id,
  message_id: message_id - 1
})

var currency = "TRX"

var cur = "SETUP"
var cod = Bot.getProperty("api_list", { list: {} })

var url = Libs.Webhooks.getUrlFor({
  command: "/get_trx",
  user_id: user.id
})

HTTP.post({
  url: cod.list[cur].check,
  body: {
    secretkey: cod.list[cur].apikey,
    Permitkey: cod.list[cur].permitkey,
    currency: currency,
    user: user.telegramid,
    webhook: url
  }
})

