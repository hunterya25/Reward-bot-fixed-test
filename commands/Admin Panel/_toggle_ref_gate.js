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

if (request && request.id) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "Referral Program switch is now " + nxt,
    show_alert: false
  });
}

Bot.runCommand("/ref_settings");
