/*CMD
  command: /eclaim
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

User.setProperty("editClaim_task", taskName, "string");
var minU = Bot.getProperty("MinTaskUsers", 10);
var maxU = Bot.getProperty("MaxTaskUsers", 5000);
var completed = Libs.ResourcesLib.anotherChatRes("total_claimed", bbi.id).value() || 0;

var prompt = "👥 <b>Edit Task Users Count / Claims</b>\n\n" +
  "📌 <b>Task:</b> " + taskName + "\n" +
  "🎯 <b>Current Target:</b> " + bbi.claim + " users\n" +
  "✅ <b>Already Completed:</b> " + completed + " users\n" +
  "📊 <b>Allowed Range:</b> " + Math.max(minU, completed) + " to " + maxU + " users\n\n" +
  "👉 <i>Send the new total number of users who can complete this task:</i>";

Api.sendMessage({
  text: prompt,
  parse_mode: "html"
});

Bot.runCommand("/eclaim2");
