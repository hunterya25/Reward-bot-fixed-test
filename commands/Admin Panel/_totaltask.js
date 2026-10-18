/*CMD
  command: /totaltask
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var y = params
var yy = y.split("#-#-#")
var b = yy[0]
var bac = yy[1]
var bbi = Bot.getProperty("Task+" + b)
var nam = bbi.name
var des = bbi.des
var clm = bbi.claim
var rew = bbi.payment
var id = bbi.id
var bs = Bot.getProperty("Status?" + b)
if (bs == "On") {
  var bs = "▶️ Active"
} else {
  var bs = "⏸ Stop"
}
var use = Libs.ResourcesLib.anotherChatRes("total_claimed", id).value()
var ttxt =
  "<b>🆔 Task ID:</> #" +
  id +
  "\n\n👁️<b> Task Title:</> " +
  nam +
  "\n<b>📃 Description:</> " +
  des +
  "\n<b>💲 Reward:</> " +
  rew +
  " <b>₹\n👤 User:</> " +
  use +
  "<b>/</>" +
  clm +
  "\n\n<b>ℹ️ Status:</> " +
  bs +
  ""
var inl = [
  [
    { text: bs, callback_data: "/sttatt " + nam + "#-#-#" + bac },
    { text: "📍 Edit Description", callback_data: "/des " + nam }
  ],
  [{ text: "✍ Edit Task Demo", callback_data: "/edemo " + nam }],
  [{ text: "🗑 Delete", callback_data: "/delete " + nam }],
  [{ text: "⬆️ Return", callback_data: "/alltask#123 " + bac + "" }]
]

Api.editMessageText({
  message_id: User.getProperty("adminid"),
  text: ttxt,
  parse_mode: "html",
  reply_markup: { inline_keyboard: inl }
})

