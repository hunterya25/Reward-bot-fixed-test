/*CMD
  command: /private_mass2
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

if (request.message_id) {
  Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id });
}

var targetID = message ? message.trim() : "";
if (!targetID || isNaN(targetID)) {
  Bot.sendMessage("❌ *Invalid Telegram ID!* Please send a valid numeric ID.\n\nExample: `1234567890`");
  Bot.runCommand("/private_mass2");
  return;
}

User.setProperty("target_pm_id", targetID, "string");

var mm = User.getProperty("adminid");
var us = Bot.getProperty("Chat" + targetID, null);
var userInfo = us ? us.user.first_name + " (`" + targetID + "`)" : "`" + targetID + "`";

var txt = "👤 *Target User Selected:* " + userInfo + "\n\n✍️ *Now send the message you want to deliver to this user.*\n\n_You can send a normal text message, or a photo with a caption._";
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

Bot.runCommand("/private_mass3");
