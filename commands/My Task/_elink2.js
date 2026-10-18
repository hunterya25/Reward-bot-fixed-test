/*CMD
  command: /elink2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: My Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var taskName = User.getProperty("editLink_task");
if (!taskName) {
  Bot.sendMessage("❌ Session expired. Please select task again.");
  return;
}

var bbi = Bot.getProperty("Task+" + taskName);
if (!bbi) {
  Bot.sendMessage("❌ Task not found!");
  return;
}

var adm = Bot.getProperty("adminID");
if (user.telegramid != bbi.admin && user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var newLink = (message || "").trim();
if (newLink.length < 2) {
  Bot.sendMessage("⚠️ *Please enter a valid link!*", { parse_mode: "Markdown" });
  Bot.runCommand("/elink2");
  return;
}

if (!newLink.startsWith("http://") && !newLink.startsWith("https://") && !newLink.startsWith("tg://") && !newLink.startsWith("@")) {
  newLink = "https://" + newLink;
}

bbi.link = newLink;
Bot.setProperty("Task+" + taskName, bbi, "json");

Bot.sendMessage("✅ *Task Link Updated Successfully!*\n\n📌 *Task:* " + taskName + "\n🔗 *New Link:* `" + newLink + "`", { parse_mode: "Markdown" });

if (user.telegramid == adm) {
  Bot.runCommand("/sttatt " + taskName);
} else {
  Bot.runCommand("/sttat " + taskName);
}
