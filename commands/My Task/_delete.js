/*CMD
  command: /delete
  help: 
  need_reply: false
  auto_retry_time: 
  folder: My Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

Api.deleteMessage({ message_id: request.message.message_id })
var bbi = Bot.getProperty("Task+" + params)
if (!bbi) {
  Bot.sendMessage("❌ *Task not found or already deleted.*")
  return
}
var nam = bbi.name
var admin = bbi.admin
var adm = Bot.getProperty("adminID")

if (user.telegramid != admin && user.telegramid != adm) {
  Bot.sendMessage("❌ *You are not authorized to delete this task!*")
  return
}

// 💰 Calculate and refund uncompleted slots to creator's balance
var use = Libs.ResourcesLib.anotherChatRes("total_claimed", bbi.id).value()
var clm = parseInt(bbi.claim)
var rew = parseFloat(bbi.payment)
var remainingSlots = clm - use
if (remainingSlots > 0 && !isNaN(remainingSlots) && !isNaN(rew)) {
  var refundAmount = remainingSlots * rew
  let creatorBal = Libs.ResourcesLib.anotherUserRes("balance", admin)
  creatorBal.add(+refundAmount)
  Bot.sendMessageToChatWithId(admin, "💰 *Refund Processed:*\n\n₹" + refundAmount.toFixed(2) + " has been refunded to your Deposit Balance for " + remainingSlots + " remaining slots of task *" + nam + "*.")
}

Bot.setProperty("Status?" + nam, null)
var ad = Bot.getProperty("Tasks" + admin, [])
var to = Bot.getProperty("TaskJsonList", [])
for (var index in ad) {
  var uniqueid = ad[index]
  if (uniqueid == nam) {
    ad.splice(parseInt(index), 1)
  }
}
Bot.setProperty("Tasks" + admin, ad, "json")
for (var index in to) {
  var uniqueid = to[index].name
  if (uniqueid == nam) {
    to.splice(parseInt(index), 1)
  }
}
Bot.setProperty("TaskJsonList", to, "json")

Bot.setProperty("Task+" + nam, null)

Bot.sendMessage("*🗑 Task Successfully Deleted & Remaining Funds Refunded!*") 
