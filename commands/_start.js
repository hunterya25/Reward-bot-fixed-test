/*CMD
  command: /start
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: ⬅️ return
  group: 
CMD*/

var admin = Bot.getProperty("admin_chat")
if (!admin) {
  Bot.sendMessage(
    "⛔️ *Bot Has No Admin*\n\n_Search_ `/loginme` _Command In Your BB Account Which Is Cointaining This Bot and Change The TelegramID In The BJS To Yours After Run The Command,_ `/loginme` _In Bot To Be Admin Then_ `/start`"
  )
  return
}
var fullBotUsers = Bot.getProperty("wholeUsers", [])
var already = User.getProperty("already" + user.telegramid)
if (!already) {
  fullBotUsers.push(user.telegramid)
  Bot.setProperty("wholeUsers", fullBotUsers, "json")
  User.setProperty("already" + user.telegramid, user.telegramid, "text")
}
Bot.setProperty("Chat" + user.telegramid, chat, "json")
Bot.sendKeyboard(
  "💰 Balance,🏟 My Tasks\n👨‍💻 Tasks,⚙️ Settings,🤑 Withdraw\n📞 Support,📝How To Use,➕ Deposit\n📋 Create Task",
  "*👋 Hey, Welcome To @" +
    bot.name +
    " Task Manager !*\n\n⛅️ _You Can Complete Here Task And Earn UPI CASH And Here You Can Create A Task And Promote Your Social Platforms._\n\n*🐼 You Can Earn A Lot Of Money From Here Just Complete The Task..*"
)
var adm = Bot.getProperty("adminID")
if (user.username != undefined) {
  var hh = "[@" + user.username + "]"
} else {
  var hh = ""
}
function touchingOwnLink() {
  Bot.sendMessage("*❌ Stop Clicking Your Own Link*")
}
function attractedByUser(refUser) {
  Api.sendMessage({
    chat_id: refUser.telegramid,
    text:
      "<b>🔋 You Got a New </b><a href='tg://user?id=" +
      user.telegramid +
      "'>Referral</a>",
    parse_mode: "html",
    disable_web_page_preview: true
  })
}
function alreadyStarted() {}

var tracks = {
  onTouchOwnLink: touchingOwnLink,
  onAtractedByUser: attractedByUser,
  onAlreadyAttracted: alreadyStarted
}

Libs.ReferralLib.track(tracks)
if (!User.getProperty("UserDone")) {
  User.setProperty("UserDone", true, "boolean")
  var stat = Libs.ResourcesLib.anotherChatRes("status", "global")
  stat.add(1)
  Api.sendMessage({
    chat_id: adm, //admin telegram id here
    text:
      "➕ <b>New User Notification</b> ➕\n\n👤<b>User:</b> <a href='tg://user?id=" +
      user.telegramid +
      "'>" +
      user.first_name +
      "</a> " +
      hh +
      "\n\n🆔<b> User ID :</b> <code>" +
      user.telegramid +
      "</code>\n\n🌝 <b>Total User's Count: " +
      stat.value() +
      "</b>",
    parse_mode: "html",
    disable_web_page_preview: true
  })
}

