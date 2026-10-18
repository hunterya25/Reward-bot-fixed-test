/*CMD
  command: /setme_kr
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

// Send this command to your bot 

//Get all Api and webhook from  @DevCryptoWalletBot


var api_key = "cehpswob5o5oypsp5xlsgxeae"

var permit_key = "ky64d6r4yg5bkr4"

var deposit_webhook = "https://api.bots.business/v1/bots/703862/new-webhook?&command=Deposit%26transaction&public_user_token=1e34ef830c666de04cee8b0b67f026a7&user_id=14418473"

var withdrawal_webhook = "https://api.bots.business/v1/bots/703862/new-webhook?&command=send%26withdraw&public_user_token=54a23815a276f3a404ab54d2bd4f94fd&user_id=14418473"

var balance_webhook = "https://api.bots.business/v1/bots/703862/new-webhook?&command=balance%26api&public_user_token=aa6423fafeeb7dc5643e74bd9d111091&user_id=14418473"

var check_deposit_webhook = "https://api.bots.business/v1/bots/703862/new-webhook?&command=DDeposit%406&public_user_token=8ac679aac77bcf17d3b38d23ab6292f4&user_id=14418473"

var transfer_to_email_hook = "https://api.bots.business/v1/bots/703862/new-webhook?&command=Email%26transaction&public_user_token=76db570d38e2b217f1974686fb482fb5&user_id=14418473"

var cod = Bot.getProperty("api_list", { list: {} })
var cur = "SETUP"
cod.list[cur] = { apikey: api_key, permitkey: permit_key, deposi: deposit_webhook,withdraw: withdrawal_webhook, balance: balance_webhook, check: check_deposit_webhook,email: transfer_to_email_hook}
Bot.setProperty("api_list", cod, "json")
Bot.sendMessage("Success  setup")
