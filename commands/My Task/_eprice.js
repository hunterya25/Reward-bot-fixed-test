/*CMD
  command: /eprice
  help: 
  need_reply: false
  auto_retry_time: 
  folder: My Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var taskName = params;
if (!taskName) {
  Bot.sendMessage("❌ Task name not provided!");
  return;
}

var bbi = Bot.getProperty("Task+" + taskName);
if (!bbi) {
  Bot.sendMessage("❌ Task not found!");
  return;
}

var adm = Bot.getProperty("adminID");
if (user.telegramid != bbi.admin && user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied! You are not authorized to edit this task.");
  return;
}

User.setProperty("editPrice_task", taskName, "string");
var minR = Bot.getProperty("MinTaskReward", 0.1);
var maxR = Bot.getProperty("MaxTaskReward", 10.0);

var prompt = "💵 <b>Edit Task Reward / Price</b>\n\n" +
  "📌 <b>Task:</b> " + taskName + "\n" +
  "💰 <b>Current Reward:</b> ₹" + bbi.payment + "\n" +
  "📊 <b>Allowed Range:</b> ₹" + minR.toFixed(2) + " to ₹" + maxR.toFixed(2) + "\n\n" +
  "👉 <i>Send the new reward amount (in ₹) to pay per completed user:</i>";

Api.sendMessage({
  text: prompt,
  parse_mode: "html"
});

Bot.runCommand("/eprice2");
