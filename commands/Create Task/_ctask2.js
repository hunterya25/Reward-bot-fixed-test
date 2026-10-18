/*CMD
  command: /ctask2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Create Task
  answer: *➡️ Enter The Description Of The Task.* \n_(You can write full, long instructions up to 4000 characters)_

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (!message || message.trim().length === 0) {
  Bot.sendMessage("❌ *Please enter a valid description!*");
  Bot.runCommand("/ctask2");
  return;
}

if (message.length > 4000) {
  Bot.sendMessage("⚠️ *Description is too long!* Telegram allows up to 4000 characters. Your text is " + message.length + " characters.");
  Bot.runCommand("/ctask2");
  return;
}

User.setProperty("usertask3", message.trim());
Bot.runCommand("/ctask3");
