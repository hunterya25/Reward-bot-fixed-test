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
  return !isNaN(parseFloat(n)) && isFinite(n)
}

if (!isNumeric(message)) {
  Bot.sendMessage("❌ Send a Valid Number")
  Bot.runCommand("/ctask9")
  return
}
if (message < 10) {
  Bot.sendMessage("*Enter Minimum 10 Task Claimer*")
  Bot.runCommand("/ctask9")
  return
}
User.setProperty("usertask1", message)
Bot.runCommand("/ctask1")

