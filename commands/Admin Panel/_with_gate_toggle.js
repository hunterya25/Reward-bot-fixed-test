/*CMD
  command: /with_gate_toggle
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

var cur = Bot.getProperty("Withdraw_status", "✅");
var nxt = (cur === "✅") ? "❌" : "✅";
Bot.setProperty("Withdraw_status", nxt, "string");

var statusLabel = (nxt === "✅") ? "🟢 ENABLED (Users can now request payouts)" : "🔴 DISABLED (Users will receive instant disabled alert)";
Bot.sendMessage("📤 *Withdrawal Gate is now " + statusLabel + "*", { parse_mode: "Markdown" });

Bot.runCommand("/gate_settings");
