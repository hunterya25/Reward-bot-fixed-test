/*CMD
  command: /set_usdt_rate2
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

var raw = (message || "").trim();
var rate = parseFloat(raw);

if (isNaN(rate) || rate <= 0) {
  Bot.sendMessage("❌ *Please enter a valid positive number for exchange rate!* (e.g. `90`):", { parse_mode: "Markdown" });
  Bot.runCommand("/set_usdt_rate2");
  return;
}

Bot.setProperty("USDT_INR_Rate", rate, "float");

Bot.sendMessage("✅ *USDT Exchange Rate updated to:* `1 USDT = ₹" + rate.toFixed(2) + "`", { parse_mode: "Markdown" });
Bot.runCommand("/fin_settings");
