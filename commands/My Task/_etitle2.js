/*CMD
  command: /etitle2
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

var oldName = User.getProperty("editTitle_task");
if (!oldName) {
  Bot.sendMessage("❌ Session expired. Please select task again.");
  return;
}

var bbi = Bot.getProperty("Task+" + oldName);
if (!bbi) {
  Bot.sendMessage("❌ Task not found!");
  return;
}

var adm = Bot.getProperty("adminID");
if (user.telegramid != bbi.admin && user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var newTitle = message.trim();
if (newTitle.length < 3 || newTitle.length > 25) {
  Bot.sendMessage("⚠️ *Title must be between 3 and 25 characters!*", { parse_mode: "Markdown" });
  Bot.runCommand("/etitle2");
  return;
}

if (newTitle == oldName) {
  Bot.sendMessage("ℹ️ New title is identical to current title.");
  return;
}

// Check uniqueness
var existing = Bot.getProperty("Task+" + newTitle);
if (existing) {
  Bot.sendMessage("❌ *A task with this title already exists!* Please choose a different title.", { parse_mode: "Markdown" });
  Bot.runCommand("/etitle2");
  return;
}

// 1. Update task data with new name
bbi.name = newTitle;
Bot.setProperty("Task+" + newTitle, bbi, "json");
Bot.setProperty("Task+" + oldName, null);

// 2. Transfer status
var st = Bot.getProperty("Status?" + oldName, "On");
Bot.setProperty("Status?" + newTitle, st, "string");
Bot.setProperty("Status?" + oldName, null);

// 3. Update global TaskJsonList
var allTasks = Bot.getProperty("TaskJsonList", []);
for (var ti = 0; ti < allTasks.length; ti++) {
  if (allTasks[ti].name == oldName) {
    allTasks[ti].name = newTitle;
    break;
  }
}
Bot.setProperty("TaskJsonList", allTasks, "json");

// 4. Update creator's task list
var creatorTasks = Bot.getProperty("Tasks" + bbi.admin, []);
for (var ci = 0; ci < creatorTasks.length; ci++) {
  if (creatorTasks[ci] == oldName) {
    creatorTasks[ci] = newTitle;
    break;
  }
}
Bot.setProperty("Tasks" + bbi.admin, creatorTasks, "json");

Bot.sendMessage("✅ *Task Title Renamed Successfully!*\n\n🏷 *New Title:* `" + newTitle + "`", { parse_mode: "Markdown" });

if (user.telegramid == adm) {
  Bot.runCommand("/sttatt " + newTitle);
} else {
  Bot.runCommand("/sttat " + newTitle);
}
