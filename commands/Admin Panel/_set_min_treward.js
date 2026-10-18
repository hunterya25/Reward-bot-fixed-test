/*CMD
  command: /set_min_treward
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
var cur = Bot.getProperty("MinTaskReward", 0.10);

var prompt = "💵 *Set Minimum Reward Per User*\n\n" +
  "Current Minimum: `₹" + parseFloat(cur).toFixed(2) + "`\n\n" +
  "👉 _Send the new minimum reward amount (in ₹) per task user (e.g. `0.2` or `0.5`):_";

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

Bot.runCommand("/set_min_treward2");
