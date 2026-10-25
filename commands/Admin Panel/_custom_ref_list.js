/*CMD
  command: /custom_ref_list
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

var rawList = Bot.getProperty("BoostedRefUsers", []);
if (!rawList) { rawList = []; }

var cleanList = [];
var listText = "";
var nowTimeMs = new Date().getTime();

for (var i = 0; i < rawList.length; i++) {
  var uId = typeof rawList[i] === "object" ? rawList[i].id : rawList[i];
  var rateData = Bot.getProperty("CustomRefRate_" + uId);

  if (!rateData || !rateData.amount) {
    continue;
  }

  // Check expiration
  if (!rateData.is_lifetime && rateData.expires_at && nowTimeMs >= rateData.expires_at) {
    // Expired! Clean up automatically
    Bot.setProperty("CustomRefRate_" + uId, null);
    continue;
  }

  cleanList.push({ id: uId, amount: rateData.amount, is_lifetime: rateData.is_lifetime, expires_at: rateData.expires_at });

  var validityStr = "♾ *Lifetime*";
  if (!rateData.is_lifetime && rateData.expires_at) {
    var remMs = rateData.expires_at - nowTimeMs;
    var remDays = Math.ceil(remMs / (24 * 60 * 60 * 1000));
    validityStr = "⏳ *" + remDays + " days left*";
  }

  var uChat = Bot.getProperty("Chat" + uId);
  var uName = uChat && uChat.user && uChat.user.first_name ? uChat.user.first_name : "User";

  listText += (cleanList.length) + ". 👤 *" + uName + "* (`" + uId + "`)\n" +
    "   💰 Rate: *₹" + parseFloat(rateData.amount).toFixed(2) + " / task* | " + validityStr + "\n\n";
}

Bot.setProperty("BoostedRefUsers", cleanList, "json");

if (cleanList.length === 0) {
  listText = "ℹ️ _No users currently have custom referral rates configured._\n_All users receive the default public commission rate._\n\n";
}

var text = "🌟 *Custom / VIP User Referral Rates*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "You can boost referral commission for specific VIP users for a set number of days or lifetime. Once expired, it automatically reverts to the public rate!\n\n" +
  listText +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [
    { text: "➕ Set / Boost User Rate", callback_data: "/set_user_ref" }
  ]
];

if (cleanList.length > 0) {
  inl.push([
    { text: "➖ Remove User Boost", callback_data: "/rem_user_ref" }
  ]);
}

inl.push([
  { text: "◀ Back To Ref Settings", callback_data: "/ref_settings" }
]);

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else if (mm) {
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
