/*CMD
  command: /send_screenshot
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Deposit
  answer: SEND SCREENSHOT PLEASE 📥🤑

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adminID = Bot.getProperty("adminID"); // 🔹 सही तरीके से एडमिन ID लो
if (!adminID) {
  Bot.sendMessage("❌ Admin ID not set. Please configure it first.");
  return;
}

// 🔹 अगर यूज़र ने फोटो नहीं भेजी तो Error दे दो
if (!request.photo) {
  Bot.sendMessage("❌ Please send a valid payment screenshot!");
  return;
}

// 🔹 यूज़र की डिटेल्स निकालो
var intentAmount = User.getProperty("pending_deposit_amount") || 5;
var did = "DEP" + Libs.Random.randomInt(10000, 99999).toString();
var nowTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

var depRecord = {
  id: did,
  user_id: user.telegramid,
  first_name: user.first_name,
  username: user.username || "",
  amount: intentAmount,
  status: "Pending",
  created_at: nowTime
};

Bot.setProperty("Deposit_" + did, depRecord, "json");

// Add to Pending Deposits List
var pendingD = Bot.getProperty("PendingDeposits", []);
if (!pendingD) { pendingD = []; }
pendingD.push(did);
Bot.setProperty("PendingDeposits", pendingD, "json");

// Log into user transaction history as pending
var his = Bot.getProperty("history" + user.telegramid) || "";
var newHis = "⏳ *Deposit Submitted:*\n📅 Time: " + nowTime + "\n💰 Intended Amount: ₹" + intentAmount + "\n🆔 Status: Verification Pending (#" + did + ")\n\n" + his;
Bot.setProperty("history" + user.telegramid, newHis);

var adminCaption = "📸 *New Deposit Payment Screenshot Received!*\n\n" +
  "👤 *User:* [" + user.first_name + "](tg://user?id=" + user.telegramid + ")\n" +
  "🆔 *User ID:* `" + user.telegramid + "`\n" +
  "💰 *Deposit Amount:* ₹" + intentAmount + "\n" +
  "🆔 *Deposit ID:* #" + did + "\n" +
  "📅 *Submitted At:* " + nowTime + "\n\n" +
  "👇 *Review Screenshot & Choose Action:*";

var adminButtons = [
  [
    { text: "✅ Approve ₹" + intentAmount, callback_data: "/app_dep " + did },
    { text: "✏️ Custom Amount", callback_data: "/app_dep_amt " + did }
  ],
  [
    { text: "❌ Reject Deposit", callback_data: "/rej_dep " + did }
  ]
];

// 🔹 एडमिन को फोटो + डिटेल्स भेजो
Api.sendPhoto({
  chat_id: adminID,
  photo: request.photo[request.photo.length - 1].file_id,
  caption: adminCaption,
  parse_mode: "Markdown",
  reply_markup: { inline_keyboard: adminButtons }
});

// 🔹 यूज़र को Confirmation Message भेजो
Bot.sendMessage(
  "✅ *PAYMENT SCREENSHOT SUBMITTED SUCCESSFULLY!*\n\n" +
  "🆔 *Deposit ID:* #" + did + "\n" +
  "💰 *Amount:* ₹" + intentAmount + "\n" +
  "⏳ *Status:* Under Review\n\n" +
  "🛠 *Administrator will verify your transaction and credit your balance shortly!*", 
  { parse_mode: "Markdown" }
);

