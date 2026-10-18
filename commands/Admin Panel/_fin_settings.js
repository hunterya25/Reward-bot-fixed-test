/*CMD
  command: /fin_settings
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

var minW = Bot.getProperty("MinWithdrawAmount", 1);
var maxW = Bot.getProperty("MaxWithdrawAmount", 1000);
var withTax = Bot.getProperty("WithdrawTaxPercent", 0);

var minD = Bot.getProperty("MinDepositAmount", 5);
var maxD = Bot.getProperty("MaxDepositAmount", 10000);
var depBonus = Bot.getProperty("DepositBonusPercent", 0);

var text = "💰 *Financial Limits & Tax Configuration*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "📤 *Withdrawal Rules:*\n" +
  "▫️ *Min Withdrawal:* `₹" + minW + "`\n" +
  "▫️ *Max Withdrawal:* `₹" + maxW + "`\n" +
  "▫️ *Withdrawal Fee / Tax:* `" + withTax + "%`\n\n" +
  "📥 *Deposit Rules:*\n" +
  "▫️ *Min Deposit:* `₹" + minD + "`\n" +
  "▫️ *Max Deposit:* `₹" + maxD + "`\n" +
  "▫️ *Deposit Bonus:* `" + depBonus + "%`\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "_Select a parameter below to modify:_";

var inl = [
  [
    { text: "✏️ Min Withdraw (₹" + minW + ")", callback_data: "/set_min_with" },
    { text: "✏️ Max Withdraw (₹" + maxW + ")", callback_data: "/set_max_with" }
  ],
  [
    { text: "✏️ Withdraw Tax (" + withTax + "%)", callback_data: "/set_with_tax" },
    { text: "✏️ Deposit Bonus (" + depBonus + "%)", callback_data: "/set_dep_bonus" }
  ],
  [
    { text: "✏️ Min Deposit (₹" + minD + ")", callback_data: "/set_min_dep" },
    { text: "✏️ Max Deposit (₹" + maxD + ")", callback_data: "/set_max_dep" }
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
