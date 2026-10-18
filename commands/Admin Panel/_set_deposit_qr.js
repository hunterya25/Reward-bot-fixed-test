/*CMD
  command: /set_deposit_qr
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

var mm = User.getProperty("adminid");
var cur = Bot.getProperty("deposit_qr", "https://files.catbox.moe/by7c0i.jpg");

Api.editMessageText({
  message_id: mm,
  text: "🖼 *Set Deposit QR Code Image URL*\n\n" +
    "▫️ *Current URL:* `" + cur + "`\n\n" +
    "👉 _Please send the direct image URL for your deposit QR code (must start with http:// or https://):_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/bot_info_settings" }]]
  }
});

Bot.runCommand("/set_deposit_qr2");
