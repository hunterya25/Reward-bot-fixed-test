/*CMD
  command: /etitle
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

User.setProperty("editTitle_task", taskName, "string");

var prompt = "🏷 <b>Edit Task Title</b>\n\n" +
  "📌 <b>Current Title:</b> " + taskName + "\n\n" +
  "👉 <i>Send the new title for this task (maximum 25 characters, unique):</i>";

Api.sendMessage({
  text: prompt,
  parse_mode: "html"
});

Bot.runCommand("/etitle2");
