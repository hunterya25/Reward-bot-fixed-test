/*CMD
  command: /s_wall2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Setting

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (request.message_id) {
  Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id });
}

var m = User.getProperty("settingm");
var upi = message ? message.trim() : "";

// Validate UPI ID format: username@bank
var isValid = false;
if (upi.includes("@") && !upi.includes(" ")) {
  var parts = upi.split("@");
  if (parts.length == 2 && parts[0].length >= 2 && parts[1].length >= 2) {
    isValid = true;
  }
}

if (!isValid) {
  Bot.sendMessage("❌ *Invalid UPI ID format!*\n\nPlease enter a valid UPI address like:\n• `yourname@oksbi`\n• `number@paytm`\n• `username@ybl`\n\nTry sending again:");
  Bot.runCommand("/s_wall2");
  return;
}

User.setProperty("upi_id", upi, "string");

var txt = "✅ *UPI ID Saved Successfully!*\n\n🏦 *Current UPI ID:* `" + upi + "`\n\n_All future withdrawals will be sent to this UPI address._";
var inl = [
  [{ text: "🗂 Change UPI", callback_data: "/s_wall" }],
  [{ text: "🔙 Back To Settings", callback_data: "⚙️ Settings" }]
];

if (m) {
  Api.editMessageText({
    message_id: m,
    text: txt,
    parse_mode: "markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: txt,
    parse_mode: "markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}

