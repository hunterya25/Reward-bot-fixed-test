/*CMD
  command: /deposit
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Deposit

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: ➕ deposit
  group: 
CMD*/

var dep = Bot.getProperty("Deposit_status", "✅");
var adm = Bot.getProperty("adminID");

if (dep == "❌" && user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Deposits are temporarily disabled by Administration.*\n\nPlease check back later or contact Support.");
  return;
}

var minDepositINR = parseFloat(Bot.getProperty("MinDepositAmount", 5));
var maxDepositINR = parseFloat(Bot.getProperty("MaxDepositAmount", 10000));
var depBonusPercent = parseFloat(Bot.getProperty("DepositBonusPercent", 0));
var bonusNotice = depBonusPercent > 0 ? "\n🎁 *Current Deposit Bonus:* +" + depBonusPercent + "% Extra!" : "";

Bot.sendMessage(
  "📥 *Deposit Funds*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "▫️ *Min Deposit:* ₹" + minDepositINR + "\n" +
  "▫️ *Max Deposit:* ₹" + maxDepositINR + bonusNotice + "\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "👉 *Please enter your deposit amount in ₹:*"
);

Bot.runCommand("/deposit_amount");
