/*CMD
  command: /private_mass
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

var mm = User.getProperty("adminid");
var txt = "🛂 *Send Private Message to User*\n\n_Please send the Telegram ID of the user you want to message._\n\n📌 *Example:* `1234567890`";
var inl = [[{ text: "◀ Cancel / Back", callback_data: "/mass_setting" }]];

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: txt,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Bot.sendInlineKeyboard(inl, txt);
}

Bot.runCommand("/private_mass2");
