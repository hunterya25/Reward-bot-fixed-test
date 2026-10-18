/*CMD
  command: /ctask
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Create Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 📋 create task
  group: 
CMD*/

var taskGate = Bot.getProperty("TaskCreate_status", "✅");
var adm = Bot.getProperty("adminID");

if (taskGate == "❌" && user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Task Creation is temporarily disabled by Administration.*\n\nPlease check back later or contact Support.");
  return;
}

var inl = [
  [{ title: "🤖 Telegram Bot & Channel", command: "/ccct tg" }],
  [{ title: "🔖 Other Site", command: "/ccct oth" }]
];
var tt = "🔥 *Choose Your Task Category:*";
Bot.sendInlineKeyboard(inl, tt);
