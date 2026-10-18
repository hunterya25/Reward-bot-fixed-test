/*CMD
  command: /dep_gate_toggle
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

var cur = Bot.getProperty("Deposit_status", "✅");
var nxt = (cur === "✅") ? "❌" : "✅";
Bot.setProperty("Deposit_status", nxt, "string");

var statusLabel = (nxt === "✅") ? "🟢 ENABLED (Users can now deposit funds)" : "🔴 DISABLED (Users will receive instant disabled alert)";
Bot.sendMessage("📥 *Deposit Gate is now " + statusLabel + "*", { parse_mode: "Markdown" });

Bot.runCommand("/gate_settings");
