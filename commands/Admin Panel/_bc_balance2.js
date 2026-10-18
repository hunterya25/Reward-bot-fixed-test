/*CMD
  command: /bc_balance2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id });

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Access Denied! You are not authorized.*");
  return;
}

if (!message || !message.includes("-")) {
  Bot.sendMessage("❌ *Invalid format!* Use `telegramid-amount` or `telegramid-amount-pay` (for payout wallet).\n\nExamples:\n`12345678-50` (Add ₹50 to Deposit Balance)\n`12345678--20` (Deduct ₹20)\n`12345678-50-pay` (Add ₹50 to Available for Payout)");
  return;
}

var splt = message.split("-");
// In case amount is negative like 12345678--20
var tgid, am, walletType;
if (message.includes("--")) {
  var negSplit = message.split("--");
  tgid = negSplit[0];
  am = "-" + negSplit[1];
} else {
  tgid = splt[0];
  am = splt[1];
  if (splt[2]) {
    walletType = splt[2].toLowerCase();
  }
}

var numAm = parseFloat(am);
if (isNaN(numAm)) {
  Bot.sendMessage("❌ *Invalid amount!* Must be a valid number.");
  return;
}

var mm = User.getProperty("adminid"); 
var us = Bot.getProperty("Chat" + tgid, null);

if (us == null) {
  Api.editMessageText({
    message_id: mm,
    text:
      "*User was Not Found to Modify Balance!*\n\nPlease Recheck User's Telegram ID.",
    parse_mode: "markdown",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
    }
  });
  return;
}

var walletKey = (walletType == "pay" || walletType == "payout") ? "Available_For_Payout" : "balance";
var walletLabel = (walletKey == "Available_For_Payout") ? "Available for Payout" : "Deposit Balance";

let bal = Libs.ResourcesLib.anotherUserRes(walletKey, tgid);
bal.add(numAm);

var actionText = numAm >= 0 ? "Credited" : "Deducted";

// 🔹 Confirmation to Admin
Api.editMessageText({
  message_id: mm,
  text: "✅ *Balance Updated Successfully!*\n\n👤 *User:* `" + tgid + "`\n💰 *Amount:* ₹" + numAm + "\n💼 *Wallet:* " + walletLabel + "\n📊 *New Balance:* ₹" + bal.value().toFixed(2),
  parse_mode: "markdown",
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
  }
});

// 🔹 Notification to User
var userMsg = numAm >= 0 ? 
  "🎉 *Balance Credited by Admin!* 🎉\n\n💰 *Added Amount:* ₹" + numAm + "\n💼 *Wallet:* " + walletLabel + "\n📊 *Total Balance:* ₹" + bal.value().toFixed(2) :
  "ℹ️ *Balance Adjusted by Admin*\n\n🔻 *Deducted Amount:* ₹" + Math.abs(numAm) + "\n💼 *Wallet:* " + walletLabel + "\n📊 *Remaining Balance:* ₹" + bal.value().toFixed(2);

Bot.sendMessageToChatWithId(tgid, userMsg, { parse_mode: "markdown" });

