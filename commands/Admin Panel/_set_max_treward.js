/*CMD
  command: /set_max_treward
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
var cur = Bot.getProperty("MaxTaskReward", 10.00);

var prompt = "💵 *Set Maximum Reward Per User*\n\n" +
  "Current Maximum: `₹" + parseFloat(cur).toFixed(2) + "`\n\n" +
  "👉 _Send the new maximum reward amount (in ₹) per task user (e.g. `5` or `20`):_";

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

Bot.runCommand("/set_max_treward2");
