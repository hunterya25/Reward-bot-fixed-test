/*CMD
  command: /set_user_ref_cdays2
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

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var rawDays = (message || "").trim();
var days = parseInt(rawDays);

if (isNaN(days) || days <= 0) {
  Bot.sendMessage("❌ *Please enter a valid positive number of days!* (e.g. `5`, `14`, `45`):", { parse_mode: "Markdown" });
  Bot.runCommand("/set_user_ref_cdays2");
  return;
}

Bot.runCommand("/set_user_ref_dur " + days);
