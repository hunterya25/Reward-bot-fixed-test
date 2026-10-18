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
  return !isNaN(parseFloat(n)) && isFinite(n);
}

if (!isNumeric(message)) {
  Bot.sendMessage("❌ *Please send a valid number!*", { parse_mode: "Markdown" });
  Bot.runCommand("/ctask3");
  return;
}

var val = parseFloat(message);
var minR = Bot.getProperty("MinTaskReward", 0.10);
var maxR = Bot.getProperty("MaxTaskReward", 10.00);

if (val < minR || val > maxR) {
  Bot.sendMessage(
    "⚠️ *Invalid Reward Amount!*\n\nReward must be between *₹" + minR.toFixed(2) + "* and *₹" + maxR.toFixed(2) + "* per user completion.",
    { parse_mode: "Markdown" }
  );
  Bot.runCommand("/ctask3");
  return;
}

var u = User.getProperty("usertask1");
var totalCost = val * u;
var userBal = Libs.ResourcesLib.userRes("balance").value();

if (userBal < totalCost) {
  Bot.sendMessage(
    "❌ *Insufficient Balance!*\n\nTotal cost required: *₹" + totalCost.toFixed(2) + "* (" + u + " users × ₹" + val.toFixed(2) + ")\nYour Deposit Balance: *₹" + userBal.toFixed(2) + "*\n\n_Please deposit more funds before creating this task._",
    { parse_mode: "Markdown" }
  );
  return;
}

User.setProperty("task_demo_media_list", [], "json");
User.setProperty("usertask4", val);
Bot.runCommand("/ctask4");
