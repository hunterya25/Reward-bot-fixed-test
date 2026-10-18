/*CMD
  command: /eprice2
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

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var taskName = User.getProperty("editPrice_task");
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

if (!isNumeric(message)) {
  Bot.sendMessage("❌ *Please enter a valid numeric amount!* (e.g. `1.5` or `2`)", { parse_mode: "Markdown" });
  Bot.runCommand("/eprice2");
  return;
}

var newPrice = parseFloat(message);
var minR = Bot.getProperty("MinTaskReward", 0.1);
var maxR = Bot.getProperty("MaxTaskReward", 10.0);

if (newPrice < minR || newPrice > maxR) {
  Bot.sendMessage("⚠️ *Reward must be between ₹" + minR.toFixed(2) + " and ₹" + maxR.toFixed(2) + "!*", { parse_mode: "Markdown" });
  Bot.runCommand("/eprice2");
  return;
}

var oldPrice = parseFloat(bbi.payment) || 0;
var totalClaims = parseInt(bbi.claim) || 0;
var completed = Libs.ResourcesLib.anotherChatRes("total_claimed", bbi.id).value() || 0;
var remaining = Math.max(totalClaims - completed, 0);

// If creator is increasing price, check if they have enough balance for remaining claims
if (user.telegramid == bbi.admin && newPrice > oldPrice && remaining > 0) {
  var diff = (newPrice - oldPrice) * remaining;
  var userBal = Libs.ResourcesLib.userRes("balance").value();
  if (userBal < diff) {
    Bot.sendMessage("❌ *Insufficient Balance!*\n\nYou need *₹" + diff.toFixed(2) + "* more in your Deposit Balance to increase reward for " + remaining + " remaining claims.", { parse_mode: "Markdown" });
    return;
  }
  Libs.ResourcesLib.userRes("balance").add(-diff);
} else if (user.telegramid == bbi.admin && newPrice < oldPrice && remaining > 0) {
  // Refund difference to user balance
  var refund = (oldPrice - newPrice) * remaining;
  Libs.ResourcesLib.userRes("balance").add(refund);
}

bbi.payment = newPrice;
Bot.setProperty("Task+" + taskName, bbi, "json");

Bot.sendMessage("✅ *Task Reward Updated Successfully!*\n\n📌 *Task:* " + taskName + "\n💵 *New Reward:* ₹" + newPrice.toFixed(2) + " per completion", { parse_mode: "Markdown" });

if (user.telegramid == adm) {
  Bot.runCommand("/sttatt " + taskName);
} else {
  Bot.runCommand("/sttat " + taskName);
}
