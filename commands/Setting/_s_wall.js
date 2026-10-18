/*CMD
  command: /s_wall
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

var m = User.getProperty("settingm");
var txt = "*🗂 Send Me Your UPI ID*";

Api.editMessageText({
  message_id: m,
  text: txt,
  parse_mode: "markdown",
  disable_web_page_preview: true
});

Bot.runCommand("/s_wall2");

