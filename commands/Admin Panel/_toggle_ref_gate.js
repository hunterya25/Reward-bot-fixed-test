/*CMD
  command: /toggle_ref_gate
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

var cur = Bot.getProperty("Referral_status", "✅");
var nxt = (cur === "✅") ? "❌" : "✅";
Bot.setProperty("Referral_status", nxt, "string");

Bot.runCommand("/ref_settings");
