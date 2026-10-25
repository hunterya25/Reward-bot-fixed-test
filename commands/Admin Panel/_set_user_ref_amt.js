/*CMD
  command: /set_user_ref_amt
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

var rawAmt = (message || "").trim();
var amt = parseFloat(rawAmt);

if (isNaN(amt) || amt <= 0) {
  Bot.sendMessage("❌ *Please enter a valid positive number!* (e.g. `1.5`, `2.0`):", { parse_mode: "Markdown" });
  Bot.runCommand("/set_user_ref_amt");
  return;
}

User.setProperty("target_boost_amount", amt, "float");

var uid = User.getProperty("target_boost_user");

var text = "⏳ *Step 3/3: Select Validity / Duration*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "👤 *User ID:* `" + uid + "`\n" +
  "💰 *Custom Rate:* `₹" + amt.toFixed(2) + " / task`\n\n" +
  "👉 *How long should this rate be active?*\n" +
  "_Once expired, it will automatically revert to the public rate!_\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [
    { text: "♾ Lifetime (Permanent)", callback_data: "/set_user_ref_dur lifetime" }
  ],
  [
    { text: "⏳ 1 Day", callback_data: "/set_user_ref_dur 1" },
    { text: "⏳ 3 Days", callback_data: "/set_user_ref_dur 3" }
  ],
  [
    { text: "⏳ 7 Days", callback_data: "/set_user_ref_dur 7" },
    { text: "⏳ 15 Days", callback_data: "/set_user_ref_dur 15" }
  ],
  [
    { text: "⏳ 30 Days", callback_data: "/set_user_ref_dur 30" },
    { text: "✍ Custom Days", callback_data: "/set_user_ref_cdays" }
  ],
  [
    { text: "◀ Cancel", callback_data: "/custom_ref_list" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "Markdown",
  reply_markup: { inline_keyboard: inl }
});
