/*CMD
  command: /set_user_ref_id
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

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var uid = (message || "").trim();

if (!uid || isNaN(uid) || uid.length < 5) {
  Bot.sendMessage("❌ *Invalid User ID!* Please send a valid numeric Telegram User ID (e.g. `8669173066`):", { parse_mode: "Markdown" });
  Bot.runCommand("/set_user_ref_id");
  return;
}

User.setProperty("target_boost_user", uid, "string");

var defComm = Bot.getProperty("ReferralTaskCommission", 0.5);

var text = "💰 *Step 2/3: Enter Custom Referral Commission*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "👤 *Target User ID:* `" + uid + "`\n" +
  "🌐 *Current Public Rate:* `₹" + parseFloat(defComm).toFixed(2) + " / task`\n\n" +
  "👉 Enter the custom amount in ₹ this user should earn per task completed by their referrals:\n\n" +
  "_(Example: `1.0`, `1.5`, `2.0`, `5.0`)_\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

Bot.sendMessage(text, { parse_mode: "Markdown" });
Bot.runCommand("/set_user_ref_amt");
