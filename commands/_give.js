/*CMD
  command: /give
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: *Bot.Business Ki Email Do Bot Deta Hu*

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adm = Bot.getProperty("adminID")
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!")
  return
}

var status = Bot.getProperty("" + user.telegramid + "")

if (status == "Ban") {
  Api.sendMessage({
    text: "<i>⚠️ You are banned</i>",
    parse_mode: "html"
  })
  return
}

var claimed = User.getProperty("claimed")

if (claimed == undefined) {
  var email = message

  if (!email.includes("@")) {
    var notEmailText = "<i>⚠️ Send a valid email</i>"

    Api.sendMessage({
      text: notEmailText,
      parse_mode: "html",
      on_result: "/give"
    })
  } else {
    BBAdmin.installBot({
      email: email,
      bot_id: bot.id
    })

    var userText =
      "<b>✅ Bot claimed successfully 🥳\n\n👉 Sent to " +
      email +
      "\n\n❤️ Join & share for more : t.me/Php_Saller_Ka_Adda_Official/\nhttps://t.me/UdayScripts</b>"

    Api.sendMessage({
      text: userText,
      parse_mode: "html",
      disable_web_page_preview: true
    })

    var adminText =
      "<b>✅ New user claimed bot\n\n👤 User : <a href='tg://user?id=" +
      user.telegramid +
      "'>" +
      user.first_name +
      "</a>\n👉 Email : " +
      email +
      "</b>"

    Api.sendMessage({
      chat_id: Bot.getProperty("adminID"),
      text: adminText,
      parse_mode: "html",
      disable_web_page_preview: true
    })

    var channelText =
      "<b>✅ New user claimed bot\n\n👤 User : <a href='tg://user?id=" +
      user.telegramid +
      "'>" +
      user.first_name +
      "</a>\n👉 Email : " +
      email +
      "\n\n😍 To claim the bot, just send</b> <code>/give</code> <b> here : @" +
      bot.name +
      "\n\n❤️ Join & share for more : t.me/Php_Saller_Ka_Adda_Official\nhttps://t.me/UdayScripts</b>"

    Api.sendMessage({
      chat_id: "@Php_Saller_Ka_Adda_Official",
      text: channelText,
      parse_mode: "html",
      disable_web_page_preview: true
    })
  }

  User.setProperty("claimed", 1, "integer")
} else {
  Api.sendMessage({
    text: "<i>⚠️ You have already claimed</i>",
    parse_mode: "html"
  })
}
