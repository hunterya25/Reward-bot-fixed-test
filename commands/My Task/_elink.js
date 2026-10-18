/*CMD
  command: /elink
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

User.setProperty("editLink_task", taskName, "string");

var currentLink = bbi.link ? bbi.link : "None";
var prompt = "🔗 <b>Edit Task Link / URL</b>\n\n" +
  "📌 <b>Task:</b> " + taskName + "\n" +
  "🌐 <b>Current Link:</b> <code>" + currentLink + "</code>\n\n" +
  "👉 <i>Send the new link or channel/bot username:</i>";

Api.sendMessage({
  text: prompt,
  parse_mode: "html"
});

Bot.runCommand("/elink2");
