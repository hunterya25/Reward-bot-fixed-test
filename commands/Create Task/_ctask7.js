/*CMD
  command: /ctask7
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Create Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var link = (message || "").trim();
if (!link.startsWith("http://") && !link.startsWith("https://") && !link.startsWith("tg://")) {
  link = "https://" + link;
}

User.setProperty("promo_link", link);
Bot.runCommand("/ctask9");
