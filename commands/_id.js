/*CMD
  command: /id
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: *SEND THE USER 🆔*

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adminID = Bot.getProperty("adminID");

if (user.telegramid != adminID) {
  Bot.sendMessage("❌ You are not authorized to use this command!");
  return;
}

if (!message || isNaN(message)) {
  Bot.sendMessage("❌ Invalid Telegram ID! Please send a valid numeric ID.");
  return;
}

// यूज़र की आईडी सेट करो
User.setProperty("target_user", message, "string");
Bot.sendMessage("✅ User selected! Now send the message.");
