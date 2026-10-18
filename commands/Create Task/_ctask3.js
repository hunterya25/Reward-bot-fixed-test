/*CMD
  command: /ctask3
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Create Task
  answer: *➡️ Enter The Amount To Pay For Completing The Task.*

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
  Bot.runCommand("/ctask3")
  return
}
if (message < 0.1 || message > 3) {
  Bot.sendMessage("*Enter Minimum* `0.1` *RS & Maximum* `3` *RS*")
  Bot.runCommand("/ctask3")
  return
}
let Balance = Libs.ResourcesLib.userRes("balance").value()

var u = User.getProperty("usertask1")
var bb = message * u
if (Balance < bb) {
  Bot.sendMessage("❌* You Have No " + bb + " RS*")
  return
}
User.setProperty("usertask4", message)
Bot.runCommand("/ctask4")

