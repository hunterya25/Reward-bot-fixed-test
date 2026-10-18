/*CMD
  command: /wallet
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

var wall = User.getProperty("upi_id");
if (!wall) {
  wall = "❗️No UPI ID Set";
}
var txt = "*🗂 UPI ID:* `" + wall + "`";

var m = User.getProperty("settingm");
var inl = [
  [{ text: "🗂 Set UPI", callback_data: "/s_wall" }],
  [{ text: "🔙 Back", callback_data: "⚙️ Settings" }]
];

Api.editMessageText({
  message_id: m,
  text: txt,
  parse_mode: "markdown",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: inl }
});

