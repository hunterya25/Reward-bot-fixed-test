/*CMD
  command: /deposit
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Deposit
  answer: *📥PLEASE ENTER YOUR DEPOSIT AMOUNT. MIN AMOUNT IS ₹5*.

  <<KEYBOARD

  KEYBOARD
  aliases: ➕ deposit
  group: 
CMD*/

var dep = Bot.getProperty("Deposit_status");
var adm = Bot.getProperty("adminID");

if (dep == "❌" && user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Deposits are temporarily disabled by Administration.* Please check back later.");
  return;
}

var minDepositINR = parseFloat(Bot.getProperty("MinDepositAmount", 5));
var maxDepositINR = parseFloat(Bot.getProperty("MaxDepositAmount", 10000));
var depBonusPercent = parseFloat(Bot.getProperty("DepositBonusPercent", 0));

var amount = parseFloat(message);
if (isNaN(amount) || amount < minDepositINR) {
  Bot.sendMessage("❌ *Minimum deposit amount is ₹" + minDepositINR + ".* Please enter ₹" + minDepositINR + " or more.");
  Bot.runCommand("/deposit");
  return;
}

if (amount > maxDepositINR) {
  Bot.sendMessage("⚠️ *Maximum deposit limit is ₹" + maxDepositINR + ".* Please enter an amount up to ₹" + maxDepositINR + ".");
  Bot.runCommand("/deposit");
  return;
}

var bonusText = "";
if (depBonusPercent > 0) {
  var bonusAmt = (amount * depBonusPercent) / 100;
  bonusText = "\n🎁 *Special Bonus (" + depBonusPercent + "%):* +₹" + bonusAmt.toFixed(2) + " (You will receive ₹" + (amount + bonusAmt).toFixed(2) + "!)";
}

User.setProperty("pending_deposit_amount", amount, "float");

var upiID = Bot.getProperty("deposit_upi", "vipboy07@ybl"); // UPI ID
var imageURL = Bot.getProperty("deposit_qr", "https://files.catbox.moe/by7c0i.jpg"); // QR Code

// ✅ QR Code + Deposit Details भेजो
var text = "🏳️ *Deposit Payment Request*\n" +
           "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
           "🚀 *Base Amount:* ₹" + amount.toFixed(2) + bonusText + "\n\n" +
           "🥇 *Step 1: Copy UPI ID & Pay:*\n" +
           "`" + upiID + "`\n\n" +
           "🌿 *Step 2: Take Screenshot*\n" +
           "Take a clear screenshot of successful payment showing Transaction/UTR ID.\n\n" +
           "💠 *Step 3: Submit Below*\n" +
           "Click the button below to upload your payment proof.";

// ✅ Inline keyboard for sending payment screenshot
var inline_keyboard = [[
  { text: "📸 SEND PAYMENT SCREENSHOT", callback_data: "/send_screenshot" }
]];

// ✅ QR Code भेजो + बाकी Deposit Details
Api.sendPhoto({
  chat_id: user.telegramid,
  photo: imageURL, // 🔹 Direct image link used
  caption: text,
  parse_mode: "Markdown",
  reply_markup: { inline_keyboard: inline_keyboard }
});

