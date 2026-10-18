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
    { text: "💰 Financial Settings", callback_data: "/fin_settings" },
    { text: "🤝 Referral Settings", callback_data: "/ref_settings" }
  ],
  [
    { text: "📢 Channel Manager", callback_data: "/chan_settings" },
    { text: "⚡️ System Switches", callback_data: "/gate_settings" }
  ],
  [
    { text: "👤 User Management", callback_data: "/user_setting" },
    { text: "🛒 Task Moderation", callback_data: "/alltask#123 1" }
  ],
  [
    { text: "📋 Task Creation Limits", callback_data: "/task_limits" },
    { text: "📊 Bot Analytics", callback_data: "/bot_analytics" }
  ],
  [
    { text: "📢 Broadcast / Mass", callback_data: "/mass_setting" },
    { text: "ℹ️ Bot Info & Support", callback_data: "/bot_info_settings" }
  ],
  [
    { text: "🔒 Log Out", callback_data: "/logout" }
  ]
];

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

