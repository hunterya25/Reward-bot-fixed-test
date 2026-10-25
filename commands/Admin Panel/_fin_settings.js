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

var usdtRate = Bot.getProperty("USDT_INR_Rate", 90);
var minUSDT = Bot.getProperty("MinWithdrawUSDT", 1);
var maxUSDT = Bot.getProperty("MaxWithdrawUSDT", 100);

var minD = Bot.getProperty("MinDepositAmount", 5);
var maxD = Bot.getProperty("MaxDepositAmount", 10000);
var depBonus = Bot.getProperty("DepositBonusPercent", 0);

var text = "💰 *Financial Limits, Crypto & Tax Configuration*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "🇮🇳 *UPI Withdrawal Rules:*\n" +
  "▫️ *Min UPI Withdraw:* `₹" + minW + "`\n" +
  "▫️ *Max UPI Withdraw:* `₹" + maxW + "`\n" +
  "▫️ *Withdrawal Fee / Tax:* `" + withTax + "%`\n\n" +
  "💎 *USDT (BEP20) Crypto Rules:*\n" +
  "▫️ *Exchange Rate:* `1 USDT = ₹" + parseFloat(usdtRate).toFixed(2) + "`\n" +
  "▫️ *Min USDT Withdraw:* `" + minUSDT + " USDT` (~₹" + (minUSDT * usdtRate).toFixed(2) + ")\n" +
  "▫️ *Max USDT Withdraw:* `" + maxUSDT + " USDT` (~₹" + (maxUSDT * usdtRate).toFixed(2) + ")\n\n" +
  "📥 *Deposit Rules:*\n" +
  "▫️ *Min Deposit:* `₹" + minD + "`\n" +
  "▫️ *Max Deposit:* `₹" + maxD + "`\n" +
  "▫️ *Deposit Bonus:* `" + depBonus + "%`\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "_Select a parameter below to modify:_";

var inl = [
  [
    { text: "✏️ Min UPI (₹" + minW + ")", callback_data: "/set_min_with" },
    { text: "✏️ Max UPI (₹" + maxW + ")", callback_data: "/set_max_with" }
  ],
  [
    { text: "💎 USDT Rate (₹" + usdtRate + ")", callback_data: "/set_usdt_rate" },
    { text: "✏️ Withdraw Tax (" + withTax + "%)", callback_data: "/set_with_tax" }
  ],
  [
    { text: "💎 Min USDT (" + minUSDT + " USDT)", callback_data: "/set_min_usdt" },
    { text: "💎 Max USDT (" + maxUSDT + " USDT)", callback_data: "/set_max_usdt" }
  ],
  [
    { text: "✏️ Min Deposit (₹" + minD + ")", callback_data: "/set_min_dep" },
    { text: "✏️ Max Deposit (₹" + maxD + ")", callback_data: "/set_max_dep" }
  ],
  [
    { text: "✏️ Deposit Bonus (" + depBonus + "%)", callback_data: "/set_dep_bonus" }
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
  Api.sendMessage({
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
