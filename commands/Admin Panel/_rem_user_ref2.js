/*CMD
  command: /rem_user_ref2
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

Bot.setProperty("CustomRefRate_" + uid, null);

var list = Bot.getProperty("BoostedRefUsers", []);
if (!list) { list = []; }

var cleanList = [];
for (var i = 0; i < list.length; i++) {
  var existingId = typeof list[i] === "object" ? list[i].id : list[i];
  if (existingId != uid) {
    cleanList.push(list[i]);
  }
}

Bot.setProperty("BoostedRefUsers", cleanList, "json");

Bot.sendMessage("✅ *Custom referral rate removed for user `" + uid + "`!* They have reverted to the public rate.", { parse_mode: "Markdown" });
Bot.runCommand("/custom_ref_list");
