/*CMD
  command: /ddemo
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
var bbi = Bot.getProperty("Task+" + params)
var nam = bbi.name
var des = bbi.des
var clm = bbi.claim
var rew = bbi.payment
var id = bbi.id
var demo = bbi.demo
var ttxt =
  "📷* Always Enter Your Task Demo This Type.*\n_If You Not Enter This Type Your Task Demo Then Task Creator Has Been Reject Your Task ...!_"
var butn = [[{ text: "ℹ️ Submit Details", callback_data: "/submit_ss " + nam }]]
Api.sendPhoto({
  photo: demo,
  caption: ttxt,
  parse_mode: "Markdown"
  //, reply_markup: { inline_keyboard: butn }
})

