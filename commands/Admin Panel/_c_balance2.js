/*CMD
  command: /c_balance2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id })
var mm = User.getProperty("adminid")
var us = Bot.getProperty("Chat" + message, null)
if (us == null) {
  Api.editMessageText({
    message_id: mm,
    text:
      "*User was Not Found In Database!! *\n\nPlease Recheck User's Telegram I'd",
    parse_mode: "markdown",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
    }
  })
  return
}
var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var nn = us.user.first_name
let bal = Libs.ResourcesLib.anotherUserRes("balance", message)
  .value()
  .toFixed(2)
let bala = Libs.ResourcesLib.anotherUserRes("Available_For_Payout", message)
  .value()
  .toFixed(2)
var tt =
  "<b>👤 Name:</b> <a href='tg://user?id=" +
  message +
  "'>" +
  nn +
  "</a>\n🆔 <b>Telegram ID:</b> <code>" + message + "</code>\n\n<b>🔸️ Deposit Balance:</b> ₹" +
  bal +
  "\n<b>🔸️ Available For Payout:</b> ₹" +
  bala
Api.editMessageText({
  message_id: mm,
  text: tt,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
  }
})

