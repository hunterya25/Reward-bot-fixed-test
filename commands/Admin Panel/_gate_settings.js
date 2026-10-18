/*CMD
  command: /gate_settings
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

var mMode = Bot.getProperty("maintenance", "❌");
var depGate = Bot.getProperty("Deposit_status", "✅");
var withGate = Bot.getProperty("Withdraw_status", "✅");
var taskGate = Bot.getProperty("TaskCreate_status", "✅");
var tasksSec = Bot.getProperty("TasksSection_status", "✅");
var refGate = Bot.getProperty("Referral_status", "✅");

var text = "⚡️ *System Security Gates & Functional Switches*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "🛠 *Maintenance Mode:* " + mMode + "\n" +
  "   _When ON, all bot commands are locked for regular users._\n\n" +
  "📤 *Withdrawal Gate:* " + withGate + "\n" +
  "   _When OFF, users instantly see a disabled notice on clicking Withdraw._\n\n" +
  "📥 *Deposit Gate:* " + depGate + "\n" +
  "   _When OFF, users instantly see a disabled notice on clicking Deposit._\n\n" +
  "📋 *Task Creation Gate:* " + taskGate + "\n" +
  "   _When OFF, users cannot publish new tasks._\n\n" +
  "👨‍💻 *Tasks Browsing Gate:* " + tasksSec + "\n" +
  "   _When OFF, users cannot browse or do tasks._\n\n" +
  "🤝 *Referral Program:* " + refGate + "\n" +
  "   _When OFF, referral program and commissions are paused._\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "_Tap any button below to toggle state:_";

var inl = [
  [
    { text: "🛠 Maintenance: " + mMode, callback_data: "/main_toggle" },
    { text: "📤 Withdrawals: " + withGate, callback_data: "/with_gate_toggle" }
  ],
  [
    { text: "📥 Deposits: " + depGate, callback_data: "/dep_gate_toggle" },
    { text: "📋 Task Create: " + taskGate, callback_data: "/task_gate_toggle" }
  ],
  [
    { text: "👨‍💻 Tasks Section: " + tasksSec, callback_data: "/tasks_section_toggle" },
    { text: "🤝 Refer & Earn: " + refGate, callback_data: "/ref_gate_toggle" }
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
