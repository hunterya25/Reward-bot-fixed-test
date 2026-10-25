/*CMD
  command: /set_user_ref_cdays
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

var text = "✍ *Enter Custom Number of Days*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "Please type the number of days this boost should remain active:\n\n" +
  "_(Example: `5`, `10`, `60`, `90`)_\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

Bot.sendMessage(text, { parse_mode: "Markdown" });
Bot.runCommand("/set_user_ref_cdays2");
