/*CMD
  command: /task_limits
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

var mm = User.getProperty("adminid");
var adm = Bot.getProperty("adminID");

if (adm != user.telegramid) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var minUsers = Bot.getProperty("MinTaskUsers", 10);
var maxUsers = Bot.getProperty("MaxTaskUsers", 5000);
var minReward = Bot.getProperty("MinTaskReward", 0.10);
var maxReward = Bot.getProperty("MaxTaskReward", 10.00);

var text = "📋 *Task Creation Limits Configuration*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "⚙️ _Configure constraints for users when creating tasks:_\n\n" +
  "👥 *Minimum Users Per Task:* `" + minUsers + "` users\n" +
  "👥 *Maximum Users Per Task:* `" + maxUsers + "` users\n" +
  "💵 *Minimum Reward Per User:* `₹" + parseFloat(minReward).toFixed(2) + "`\n" +
  "💵 *Maximum Reward Per User:* `₹" + parseFloat(maxReward).toFixed(2) + "`\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "💡 _Task creators will only be allowed to set user claims and rewards within these limits._";

var inl = [
  [
    { text: "👥 Set Min Users (" + minUsers + ")", callback_data: "/set_min_tusers" },
    { text: "👥 Set Max Users (" + maxUsers + ")", callback_data: "/set_max_tusers" }
  ],
  [
    { text: "💵 Set Min Reward (₹" + parseFloat(minReward).toFixed(2) + ")", callback_data: "/set_min_treward" },
    { text: "💵 Set Max Reward (₹" + parseFloat(maxReward).toFixed(2) + ")", callback_data: "/set_max_treward" }
  ],
  [
    { text: "🔄 Refresh", callback_data: "/task_limits" },
    { text: "◀ Back To Panel", callback_data: "/admin" }
  ]
];

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
