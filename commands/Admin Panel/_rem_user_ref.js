/*CMD
  command: /rem_user_ref
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

var text = "➖ *Remove Custom Referral Rate*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "Enter the **Telegram User ID** of the user whose custom rate you want to remove:\n\n" +
  "_(Once removed, the user will immediately revert to the public commission rate.)_\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [{ text: "◀ Cancel", callback_data: "/custom_ref_list" }]
];

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: text,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Bot.sendMessage(text, { parse_mode: "Markdown", reply_markup: { inline_keyboard: inl } });
}

Bot.runCommand("/rem_user_ref2");
