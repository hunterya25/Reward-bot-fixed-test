/*CMD
  command: /set_user_ref_dur
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var dur = (params || "").trim().toLowerCase();
var uid = User.getProperty("target_boost_user");
var amt = User.getProperty("target_boost_amount");

if (!uid || !amt) {
  Bot.sendMessage("❌ Session expired. Please start over.");
  Bot.runCommand("/custom_ref_list");
  return;
}

var nowTimeMs = new Date().getTime();
var isLifetime = (dur === "lifetime");
var expiresAt = null;
var daysCount = null;
var durLabel = "♾ Lifetime";

if (!isLifetime) {
  daysCount = parseFloat(dur);
  if (isNaN(daysCount) || daysCount <= 0) {
    daysCount = 7;
  }
  expiresAt = nowTimeMs + (daysCount * 24 * 60 * 60 * 1000);
  durLabel = "⏳ " + daysCount + " Day(s)";
}

var rateData = {
  amount: parseFloat(amt),
  is_lifetime: isLifetime,
  expires_at: expiresAt,
  days: daysCount,
  set_at: nowTimeMs
};

Bot.setProperty("CustomRefRate_" + uid, rateData, "json");

// Update BoostedRefUsers list
var list = Bot.getProperty("BoostedRefUsers", []);
if (!list) { list = []; }

var exists = false;
for (var i = 0; i < list.length; i++) {
  var existingId = typeof list[i] === "object" ? list[i].id : list[i];
  if (existingId == uid) {
    list[i] = { id: uid, amount: amt, is_lifetime: isLifetime, expires_at: expiresAt };
    exists = true;
    break;
  }
}

if (!exists) {
  list.push({ id: uid, amount: amt, is_lifetime: isLifetime, expires_at: expiresAt });
}

Bot.setProperty("BoostedRefUsers", list, "json");

// Clear temporary session properties
User.setProperty("target_boost_user", null);
User.setProperty("target_boost_amount", null);

// Notify the user about their VIP referral boost!
var userNotify = "🌟 <b>VIP Referral Rate Activated!</b> 🎉\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "Congratulations! The Administration has upgraded your referral commission rate:\n\n" +
  "💰 <b>Your New Rate:</b> ₹" + parseFloat(amt).toFixed(2) + " per task\n" +
  "⏱ <b>Validity:</b> " + durLabel + "\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "🚀 <i>Share your link to earn high passive income on every task your friends complete!</i>";

try {
  Api.sendMessage({
    chat_id: uid,
    text: userNotify,
    parse_mode: "html"
  });
} catch (e) {
  // If user hasn't started bot, ignore
}

var successMsg = "✅ *Custom Referral Rate Activated Successfully!*\n\n" +
  "👤 *User ID:* `" + uid + "`\n" +
  "💰 *Commission:* `₹" + parseFloat(amt).toFixed(2) + " / task`\n" +
  "⏱ *Duration:* *" + durLabel + "*\n\n" +
  "_(Once expired, the user will automatically revert to the public rate.)_";

Bot.sendMessage(successMsg, { parse_mode: "Markdown" });
Bot.runCommand("/custom_ref_list");
