/*CMD
  command: /set_min_usdt2
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
var val = parseFloat(raw);

if (isNaN(val) || val <= 0) {
  Bot.sendMessage("❌ *Please enter a valid positive number for minimum USDT!* (e.g. `1`):", { parse_mode: "Markdown" });
  Bot.runCommand("/set_min_usdt2");
  return;
}

Bot.setProperty("MinWithdrawUSDT", val, "float");

var rate = Bot.getProperty("USDT_INR_Rate", 90);
Bot.sendMessage("✅ *Minimum USDT Withdrawal set to:* `" + val + " USDT` (~₹" + (val * rate).toFixed(2) + ")", { parse_mode: "Markdown" });
Bot.runCommand("/fin_settings");
