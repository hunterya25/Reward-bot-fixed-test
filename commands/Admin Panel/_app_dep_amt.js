/*CMD
  command: /app_dep_amt
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

var did = params ? params.trim() : "";
if (!did) {
  Bot.sendMessage("❌ Deposit ID missing!");
  return;
}

User.setProperty("target_dep_id", did, "string");
Bot.sendMessage("💰 *Enter Custom Amount to Credit for Deposit #" + did + ":*\n\n_Send a numeric value in ₹ (e.g. 50, 100, 250):_");
Bot.runCommand("/app_dep_amt2");
