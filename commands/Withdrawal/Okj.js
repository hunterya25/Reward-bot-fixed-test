/*CMD
  command: Okj
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Withdrawal

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
var txid = data.txd
var amount = data.amount
var address = data.address
var cur = data.currency
var by = data.withdrawee
var cur = data.currency
var his = Bot.getProperty("history" + user.telegramid)
var wd = Libs.ResourcesLib.anotherChatRes("totalwithdraw", "global")
let Server_Time = new Date().toLocaleString("en-US", {
  timeZone: "Asia/Kolkata"
})
if (by >= user.telegramid && by <= user.telegramid) {
  Bot.sendMessage(
    "✅ *Your Withdraw Has been sent*\n\n💰 *Amount*: " +
      amount +
      " " +
      cur +
      "\n📁 *Address*: " +
      address +
      "\n\n➕ *Txid*: [" +
      txid +
      "](https://tronscan.org/#/transaction/" +
      txid +
      ")\n📅 *Status*: Processing...."
  )
  wd.add(+amount)
  if (!his) {
    Bot.setProperty(
      "history" + user.telegramid,
      "*➖ Withdrawal:\n📅 Time:* " +
        Server_Time +
        " \n*💰 Amount:* " +
        amount +
        " *" +
        cur +
        "*\n\n"
    )
  } else {
    var nn =
      "*➖ Withdrawal:\n📅 Time:* " +
      Server_Time +
      " \n*💰 Amount:* " +
      amount +
      " *" +
      cur +
      "*\n\n"
    var toal = nn + his
    Bot.setProperty("history" + user.telegramid, toal)
  }
}

