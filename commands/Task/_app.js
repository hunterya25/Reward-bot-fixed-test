/*CMD
  command: /app
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

Api.deleteMessage({ message_id: request.message.message_id })
var splt = params.split("-")
var users = splt[0]
var nae = splt[1]
//var rew = splt[2]
var bbi = Bot.getProperty("Task+" + nae)
var nam = bbi.name
var des = bbi.des
var clm = bbi.claim
var rew = bbi.payment
var id = bbi.id
var admin = bbi.admin
let bal = Libs.ResourcesLib.anotherUserRes("Available_For_Payout", users)
bal.add(+rew)
var txt = `• ━━━━━━━━━━━━━━━━━ •
*» NEW PAYMENT RECEIVED FOR TASK «
• ━━━━━━━━━━━━━━━━━ •
🥳 Your Documents For Task* ${nam} *Was Successfully Approved.*
*💵 Payment:* ${rew} *₹Rs*
• ━━━━━━━━━━━━━━━━━ •`
Api.sendMessage({
  chat_id: users,
  text: txt,
  parse_mode: "markdown",
  disable_web_page_preview: true
})
var tto = `*• ━━━━━━━━━━━━━━━━━ •
» THE PAYMENT WAS SENT SUCCESSFULLY «*
• ━━━━━━━━━━━━━━━━━ •
🤩_ You Have Done Things Well And Now We Have A Member Happy For The Reward You Gave Him For Doing Your Task!_
• ━━━━━━━━━━━━━━━━━ •`
Bot.sendMessage(tto)
Bot.setProperty(nam + "" + users + "" + rew + "" + id, true)
var use = Libs.ResourcesLib.anotherChatRes("total_claimed", id)
use.add(1)
if (use.value() == clm) {
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

  return
}

