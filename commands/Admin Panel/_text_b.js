/*CMD
  command: /text_b
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

var mm = User.getProperty("adminid")
var adm = Bot.getProperty("adminID")
if (params == "txt") {
  var tto = "*Send Me Text For Broadcast*"
  Api.editMessageText({
    message_id: mm,
    text: tto,
    parse_mode: "markdown",
    disable_web_page_preview: true
  })
  Bot.runCommand("/text_b2")
} else {
  var tto = "*Send Me Photo For Broadcast*"
  Api.editMessageText({
    message_id: mm,
    text: tto,
    parse_mode: "markdown",
    disable_web_page_preview: true
  })
  Bot.runCommand("/text_b3")
}

