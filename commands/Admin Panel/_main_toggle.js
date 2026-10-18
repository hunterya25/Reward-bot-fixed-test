/*CMD
  command: /main_toggle
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

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var cur = Bot.getProperty("maintenance", "❌");
var nxt = (cur === "✅") ? "❌" : "✅";
Bot.setProperty("maintenance", nxt, "string");

var statusLabel = (nxt === "✅") ? "🔴 ACTIVATED (Bot is locked for regular users)" : "🟢 DEACTIVATED (Bot is open for all users)";
if (request && request.id) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "Maintenance mode: " + nxt,
    show_alert: false
  });
}
Bot.sendMessage("🛠 *Maintenance Mode is now " + statusLabel + "*", { parse_mode: "Markdown" });

Bot.runCommand("/gate_settings");
