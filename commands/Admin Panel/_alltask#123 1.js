/*CMD
  command: /alltask#123 1
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

var sell = Bot.getProperty("TaskJsonList")

if (!sell) {
  var txt = "💠 <b>Total Tasks in Bot are</> 0"

  var key = [[{ text: "⬆️ Return", callback_data: "/admin" }]]
  Api.editMessageText({
    message_id: request.message.message_id,
    text: txt,
    parse_mode: "html",
    reply_markup: { inline_keyboard: key }
  })
  return
}

var txt = ""
var mm = User.getProperty("adminid")
var inlkey = [[]]
var codeIndex
inlkey[1] = []
inlkey[2] = []
inlkey[3] = []
inlkey[4] = []
//inlkey[5] = []

var loooo = "0"
var lolnext = parseInt(loooo)

var cod = ""
for (var index in sell) {
  var b = sell[index].name
  var bi = Bot.getProperty("Task+" + sell[index].name)
  var no = parseInt(index) + 1
  var bstatus = Bot.getProperty("Status?" + b)
  codeIndex = sell[index]
  if (index < 10) {
    txt +=
      "\n📕 " +
      no +
      ". <b>" +
      bi.name +
      "</b> ➡️ " +
      bi.payment +
      " <b>₹</b>\n➡️ <b>" +
      bstatus +
      "</b> For Do\n"

    codeIndex = sell[index]
    if (index < 5) {
      var keyboardRow = 0
    } else if (index < 10) {
      var keyboardRow = 1
    }
    inlkey[keyboardRow].push({
      text: "» " + no + " «",
      callback_data: "/totaltask " + bi.name + "#-#-#1"
    })
  }
  if (index > 10) {
    var lolnext = lolnext + 1
  }
}
if (lolnext != 0) {
  var keyboardRow = keyboardRow + 1
  inlkey[keyboardRow].push({
    text: "Next▶️",
    callback_data: "/alltask#123 2"
  })
}
var keyboardRow = keyboardRow + 1
inlkey[keyboardRow].push({
  text: "⬆️ Return",
  callback_data: "/admin"
})
var cod = "💠 <b>Total Tasks in Bot are</b> " + no + "\n" + txt
Api.editMessageText({
  message_id: mm,
  text: cod,
  parse_mode: "html",
  reply_markup: { inline_keyboard: inlkey }
})

