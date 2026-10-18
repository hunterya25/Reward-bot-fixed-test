/*CMD
  command: /ref_settings
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

var mm = User.getProperty("adminid");
var adm = Bot.getProperty("adminID");

if (adm != user.telegramid) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var refComm = Bot.getProperty("ReferralTaskCommission", 0.5);
var dailyBonus = Bot.getProperty("DailyBonusAmount", 0.1);
var refGate = Bot.getProperty("Referral_status", "✅");

var text = "🤝 *Referral Program & Bonus Configuration*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "💎 *Referral Task Commission:* `₹" + parseFloat(refComm).toFixed(2) + "` per completed task\n" +
  "🎁 *Daily Check-in Bonus:* `₹" + parseFloat(dailyBonus).toFixed(2) + "`\n" +
  "⚡️ *Referral Gate Status:* " + refGate + "\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "_Select an option below to update settings:_";

var inl = [
  [
    { text: "✏️ Set Task Commission (₹" + refComm + ")", callback_data: "/set_ref_comm" }
  ],
  [
    { text: "✏️ Set Daily Bonus (₹" + dailyBonus + ")", callback_data: "/set_daily_bonus" }
  ],
  [
    { text: "⚡️ Referral System: " + refGate, callback_data: "/toggle_ref_gate" }
  ],
  [
    { text: "◀ Back To Panel", callback_data: "/admin" }
  ]
];

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Bot.sendInlineKeyboard(inl, text);
}
