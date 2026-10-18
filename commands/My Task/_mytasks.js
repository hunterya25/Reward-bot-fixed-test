/*CMD
  command: /mytasks
  help: 
  need_reply: false
  auto_retry_time: 
  folder: My Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 🏟 my tasks
  group: 
CMD*/

var tas = Bot.getProperty("Tasks" + user.telegramid)

if (!tas) {
  var txt = "👨‍💻 *You Have Not Created Any Task Here!..*"
  Bot.sendMessage(txt)
  return
}

for (var index in tas) {
  var b = tas[index]
  var bbi = Bot.getProperty("Task+" + tas[index])
  var bstatus = Bot.getProperty("Status?" + b)
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
    [{ text: "🗑 Delete", callback_data: "/delete " + nam }]
  ]

  Api.sendMessage({
    text: ttxt,
    parse_mode: "html",
    reply_markup: { inline_keyboard: inl }
  })
}

