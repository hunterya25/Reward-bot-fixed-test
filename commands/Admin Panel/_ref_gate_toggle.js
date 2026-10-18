/*CMD
  command: /ref_gate_toggle
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

var cur = Bot.getProperty("Referral_status", "✅");
var nxt = (cur === "✅") ? "❌" : "✅";
Bot.setProperty("Referral_status", nxt, "string");

var statusLabel = (nxt === "✅") ? "🟢 ENABLED (Referral earnings are active)" : "🔴 DISABLED (Referral program is paused)";
Bot.sendMessage("🤝 *Referral Program Gate is now " + statusLabel + "*", { parse_mode: "Markdown" });

Bot.runCommand("/gate_settings");
