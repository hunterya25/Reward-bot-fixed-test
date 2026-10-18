/*CMD
  command: /set_db_chan
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

if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

if (params == "REMOVE") {
  Bot.setProperty("StorageChannelID", null);
  Bot.sendMessage("🗑 *Storage Database Channel has been removed!*");
  Bot.runCommand("/chan_settings");
  return;
}

var currentDb = Bot.getProperty("StorageChannelID");
var curStr = currentDb ? "`" + currentDb + "`" : "_Not Configured_";

var text = "🗄 *Configure Storage / Database Channel*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "Current Storage Channel: " + curStr + "\n\n" +
  "👉 _Send the private channel ID (e.g. `-1001234567890`) or public channel username (e.g. `@MyChannelBackup`):_\n\n" +
  "⚠️ *Requirements:*\n" +
  "1. Create a channel (private or public).\n" +
  "2. Add this bot as an **Administrator** with permission to send photos, videos, and messages!\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [{ text: "◀ Back", callback_data: "/chan_settings" }]
];

if (currentDb) {
  inl.unshift([{ text: "🗑 Remove Database Channel", callback_data: "/set_db_chan REMOVE" }]);
}

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: text,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Bot.sendMessage(text, { parse_mode: "Markdown", reply_markup: { inline_keyboard: inl } });
}

Bot.runCommand("/set_db_chan2");
