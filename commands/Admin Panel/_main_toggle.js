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

Bot.runCommand("/gate_settings");
