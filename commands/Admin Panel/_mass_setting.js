/*CMD
  command: /mass_setting
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
var tto =
  "*📢 Select Your Message Type.You Can Send Global or Private Message Anytime.\n* _- Kindly Select an Option._"
var inl = [
  [
    { text: "✝ Text Messages", callback_data: "/text_b txt" },
    { text: "📼 Photo Broadcast", callback_data: "/text_b" }
  ],
  [{ text: "🛂 Private Message", callback_data: "/private_mass" }],
  [{ text: "◀ Back To Panel", callback_data: "/admin" }]
]
if (adm == user.telegramid) {
  Api.editMessageText({
    message_id: mm,
    text: tto,
    parse_mode: "markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  })
  return
}

