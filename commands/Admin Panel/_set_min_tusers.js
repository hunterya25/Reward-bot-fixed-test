/*CMD
  command: /set_min_tusers
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
var cur = Bot.getProperty("MinTaskUsers", 10);

var prompt = "👥 *Set Minimum Users Per Task*\n\n" +
  "Current Minimum: `" + cur + "` users\n\n" +
  "👉 _Send the new minimum number of users required to create a task:_";

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: prompt,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[{ text: "◀ Back", callback_data: "/task_limits" }]]
    }
  });
} else {
  Bot.sendMessage(prompt, { parse_mode: "Markdown" });
}

Bot.runCommand("/set_min_tusers2");
