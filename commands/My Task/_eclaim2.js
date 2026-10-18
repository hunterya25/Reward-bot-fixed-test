/*CMD
  command: /eclaim2
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

var taskName = User.getProperty("editClaim_task");
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
  Bot.sendMessage("❌ *Please enter a valid whole number!* (e.g. `50` or `100`)", { parse_mode: "Markdown" });
  Bot.runCommand("/eclaim2");
  return;
}

var newClaims = parseInt(message);
var minU = Bot.getProperty("MinTaskUsers", 10);
var maxU = Bot.getProperty("MaxTaskUsers", 5000);
var completed = Libs.ResourcesLib.anotherChatRes("total_claimed", bbi.id).value() || 0;

if (newClaims < completed) {
  Bot.sendMessage("⚠️ *Target cannot be less than already completed users (" + completed + ")!*", { parse_mode: "Markdown" });
  Bot.runCommand("/eclaim2");
  return;
}

if (newClaims < minU || newClaims > maxU) {
  Bot.sendMessage("⚠️ *User limit must be between " + minU + " and " + maxU + " users!*", { parse_mode: "Markdown" });
  Bot.runCommand("/eclaim2");
  return;
}

var oldClaims = parseInt(bbi.claim) || 0;
var reward = parseFloat(bbi.payment) || 0;

// Balance adjustment for creator
if (user.telegramid == bbi.admin && newClaims > oldClaims) {
  var diffUsers = newClaims - oldClaims;
  var requiredCost = diffUsers * reward;
  var userBal = Libs.ResourcesLib.userRes("balance").value();
  if (userBal < requiredCost) {
    Bot.sendMessage("❌ *Insufficient Balance!*\n\nYou need *₹" + requiredCost.toFixed(2) + "* more in your Deposit Balance to add " + diffUsers + " more users.", { parse_mode: "Markdown" });
    return;
  }
  Libs.ResourcesLib.userRes("balance").add(-requiredCost);
} else if (user.telegramid == bbi.admin && newClaims < oldClaims) {
  // Refund unused claims
  var refundUsers = oldClaims - newClaims;
  var refundAmt = refundUsers * reward;
  Libs.ResourcesLib.userRes("balance").add(refundAmt);
}

bbi.claim = newClaims;
Bot.setProperty("Task+" + taskName, bbi, "json");

Bot.sendMessage("✅ *Task User Target Updated Successfully!*\n\n📌 *Task:* " + taskName + "\n👥 *New Target:* " + newClaims + " users", { parse_mode: "Markdown" });

if (user.telegramid == adm) {
  Bot.runCommand("/sttatt " + taskName);
} else {
  Bot.runCommand("/sttat " + taskName);
}
