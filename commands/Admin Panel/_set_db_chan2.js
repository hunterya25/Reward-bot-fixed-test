/*CMD
  command: /set_db_chan2
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

if (request && request.message_id) {
  try {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id });
  } catch (e) {}
}

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var raw = (message || "").trim();
raw = raw.replace("https://t.me/", "").replace("http://t.me/", "").replace("t.me/", "");
if (!raw.startsWith("@") && !raw.startsWith("-100") && !raw.startsWith("-")) {
  raw = "@" + raw;
}

if (raw.length < 3) {
  Bot.sendMessage("❌ *Invalid Channel ID or Username!*", { parse_mode: "Markdown" });
  Bot.runCommand("/set_db_chan");
  return;
}

Bot.setProperty("StorageChannelID", raw, "string");

// Send test message to confirm bot has permission in the channel
try {
  Api.sendMessage({
    chat_id: raw,
    text: "🗄 <b>Storage Database Connected Successfully!</b>\n\nAll task completion proof videos, screenshots, and task demos will be permanently recorded here.",
    parse_mode: "html"
  });
} catch (e) {
  // Gracefully handle if bot is not yet admin
}

Bot.sendMessage("✅ *Storage Database Channel configured successfully!*\n\nChannel: `" + raw + "`", { parse_mode: "Markdown" });

Bot.runCommand("/chan_settings");
