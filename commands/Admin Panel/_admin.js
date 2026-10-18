/*CMD
  command: /admin
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

if (adm != user.telegramid) {
  Bot.sendMessage("⛔️ *Access Denied!* You are not authorized to access the Admin Panel.")
  return
}

var pendingW = Bot.getProperty("PendingWithdrawals", []).length
var pendingD = Bot.getProperty("PendingDeposits", []).length

var inl = [
  [
    { text: "💸 Withdrawals (" + pendingW + ")", callback_data: "/with_requests" },
    { text: "📥 Deposits (" + pendingD + ")", callback_data: "/dep_requests" }
  ],
  [
    { text: "👤 User Setting", callback_data: "/user_setting" },
    { text: "📢 Mass Setting", callback_data: "/mass_setting" }
  ],
  [
    { text: "🛒 Task Moderation", callback_data: "/alltask#123 1" },
    { text: "📊 Bot Analytics", callback_data: "/bot_analytics" }
  ],
  [
    { text: "🤖 Bot Setting", callback_data: "/bot_setting" },
    { text: "🔒 Log Out", callback_data: "/logout" }
  ]
]

var tto =
  "👋 *Welcome to the Administrator Control Center!*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "🤖 *Bot:* @" + bot.name + "\n" +
  "👑 *Admin:* `" + adm + "`\n" +
  "💸 *Pending Withdrawals:* " + (pendingW > 0 ? "*" + pendingW + " pending*" : "None") + "\n" +
  "📥 *Pending Deposits:* " + (pendingD > 0 ? "*" + pendingD + " pending*" : "None") + "\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "_Select an option below to manage users, finance, tasks, or system settings:_"

if (request.message_id) {
  Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id })
  if (mm) {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: mm })
  }
  Api.sendMessage({
    text: tto,
    parse_mode: "Markdown",
    on_result: "adminid",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  })
  return
}

Api.editMessageText({
  message_id: mm,
  text: tto,
  parse_mode: "markdown",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: inl }
})
return

