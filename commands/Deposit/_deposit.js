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

var amount = parseFloat(message);
if (isNaN(amount) || amount < 5) {
  Bot.sendMessage("❌ *Minimum deposit amount is ₹5. Please enter ₹5 or more.*");
  Bot.runCommand("/deposit");
  return;
}

User.setProperty("pending_deposit_amount", amount, "float");

var upiID = Bot.getProperty("deposit_upi", "vipboy07@ybl"); // UPI ID
var imageURL = Bot.getProperty("deposit_qr", "https://files.catbox.moe/by7c0i.jpg"); // QR Code

// ✅ QR Code + Deposit Details भेजो
var text = "🏳️ New Deposit\n\n" +
           "🚀 Amount: ₹ " + amount + "\n\n" +
           "🌿 SEND PAYMENT SCREENSHOT ✔️\n\n" +
           "🥇 COPY UPI ID AND PAY : " + upiID + "\n\n" +
           "💠 After Paying Click On 'SEND PAYMENT SCREENSHOT'";

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

