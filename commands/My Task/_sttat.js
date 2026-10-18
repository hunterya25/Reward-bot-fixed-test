/*CMD
  command: /sttat
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

var b = params
var bbi = Bot.getProperty("Task+" + b)
if (!bbi) {
  return
}
var adm = Bot.getProperty("adminID")
if (user.telegramid != bbi.admin && user.telegramid != adm) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❌ You are not authorized to toggle this task!",
    show_alert: true
  })
  return
}
var bs = Bot.getProperty("Status?" + b)
var nam = bbi.name
var des = bbi.des
var clm = bbi.claim
var rew = bbi.payment
var id = bbi.id
if (bs == "On") {
  Bot.setProperty("Status?" + b, "Off")

  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❕ Your " + b + " Task Has Been Now Disabled For Do",
    show_alert: true
  })
} else if (bs == "Off") {
  Bot.setProperty("Status?" + b, "On")
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❕ Your " + b + " Task Has Been Now Enabled For Do ",
    show_alert: true
  })
} else {
  Bot.setProperty("Status?" + b, "On")
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❕ Your " + b + " Task Has Been Now Enabled For Do ",
    show_alert: true
  })
}
var bs = Bot.getProperty("Status?" + b)
if (bs == "On") {
  var bs = "▶️ Active"
} else {
  var bs = "⏸ Stop"
}
var use = Libs.ResourcesLib.anotherChatRes("total_claimed", id).value()
var txt =
  "<b>🆔 Task ID:</> #" +
  id +
  "\n\n👁️<b> Task Title:</> " +
  nam +
  "\n<b>📃 Description:</> " +
  des +
  "\n<b>💲 Reward:</> " +
  rew +
  " <b>₹Rs\n👤 User:</> " +
  use +
  "<b>/</>" +
  clm +
  "\n\n<b>ℹ️ Status:</> " +
  bs +
  ""
var inl = [
  [
    { text: bs, callback_data: "/sttat " + nam },
    { text: "📍 Edit Description", callback_data: "/des " + nam }
  ],
  [{ text: "✍ Edit Task Demo", callback_data: "/edemo " + nam }],
  [{ text: " 🗑 Delete Task", callback_data: "/delete " + nam }]
]

Api.editMessageText({
  message_id: request.message.message_id,
  text: txt,
  parse_mode: "html",
  reply_markup: { inline_keyboard: inl }
})

