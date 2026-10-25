/*CMD
  command: /set_user_ref
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

var text = "🌟 *Set Custom User Referral Commission*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "👉 *Step 1/3:* Please enter the **Telegram User ID** of the user you want to set a custom rate for:\n\n" +
  "_(Example: `8669173066`)_\n" +
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

Bot.runCommand("/set_user_ref_id");
