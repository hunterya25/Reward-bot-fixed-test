/*CMD
  command: /ctask9
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Create Task
  answer: 😎* How Many Users Can Complete Your Task*

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

if (!isNumeric(message)) {
  Bot.sendMessage("❌ *Please send a valid number!*", { parse_mode: "Markdown" });
  Bot.runCommand("/ctask9");
  return;
}

var val = parseInt(message);
var minU = Bot.getProperty("MinTaskUsers", 10);
var maxU = Bot.getProperty("MaxTaskUsers", 5000);

if (val < minU || val > maxU) {
  Bot.sendMessage(
    "⚠️ *Invalid User Target!*\n\nYou must enter between *" + minU + "* and *" + maxU + "* users.",
    { parse_mode: "Markdown" }
  );
  Bot.runCommand("/ctask9");
  return;
}

User.setProperty("usertask1", val);
Bot.runCommand("/ctask1");
