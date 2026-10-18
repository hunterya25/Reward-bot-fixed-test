/*CMD
  command: /get_trx
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

if (!content) {
  return
}
var data = JSON.parse(content)
var error = data.error
if (error) {
  Bot.inspect(error)
  return
}

var amo = data.generator
if (amo) {
  var currency = data.currency
  var add = data.address
  User.setProperty("trx_add", add)
  Bot.runCommand("/deposit")
  return
}

var address = data.address
var fom = data.depositer
var currency = data.currency
var amount = data.amount
var deposited = amount
var hash = data.transaction
//security passage
var his = Bot.getProperty("history" + user.telegramid)
var bal = Libs.ResourcesLib.userRes("balance")
var dp = Libs.ResourcesLib.anotherChatRes("totaldeposit", "global")
let Server_Time = new Date().toLocaleString("en-US", {
  timeZone: "Asia/Kolkata"
})
if (fom >= user.telegramid && fom <= user.telegramid) {
  if (amount >= 1 && amount <= 5000) {
    Bot.sendMessage(
      "*✅ Your Deposit Confirmed*\n\n*💴 Deposited Amount:* " +
        amount +
        " *" +
        currency +
        "*" +
        ""
    )
    bal.add(+deposited)
    dp.add(+deposited)
    if (!his) {
      Bot.setProperty(
        "history" + user.telegramid,
        "*➕ Deposited:\n📅 Time:* " +
          Server_Time +
          " \n*💰 Amount:* " +
          deposited +
          " *" +
          currency +
          "*\n\n"
      )
    } else {
      var nn =
        "*➕ Deposited:\n📅 Time:* " +
        Server_Time +
        " \n*💰 Amount:* " +
        deposited +
        " *" +
        currency +
        "*\n\n"
      var toal = nn + his
      Bot.setProperty("history" + user.telegramid, toal)
    }
  }
}

