/*CMD
  command: /s_wall3
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Setting

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var wall = User.getProperty("upi_id") || "❗️No UPI ID Set";
var m = User.getProperty("settingm");
var txt = "*🗂 Current UPI ID:* `" + wall + "`";
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

