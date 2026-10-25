/*CMD
  command: /app
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (request && request.message && request.message.message_id) {
  try {
    Api.deleteMessage({ message_id: request.message.message_id });
  } catch (e) {}
}

var users, nae, rew;
if (params.indexOf("###") >= 0) {
  var splt = params.split("###");
  users = splt[0];
  nae = splt[1];
  rew = splt[2];
} else {
  var splt = params.split("-");
  users = splt[0];
  nae = splt[1];
  rew = splt[2];
}

var bbi = Bot.getProperty("Task+" + nae);
if (!bbi) {
  Bot.sendMessage("❌ Task not found or already completed!");
  return;
}

var nam = bbi.name;
var des = bbi.des;
var clm = bbi.claim;
var rew = bbi.payment;
var id = bbi.id;
var admin = bbi.admin;

let bal = Libs.ResourcesLib.anotherUserRes("Available_For_Payout", users);
bal.add(+rew);

var txt = `• ━━━━━━━━━━━━━━━━━ •
*» NEW PAYMENT RECEIVED FOR TASK «*
• ━━━━━━━━━━━━━━━━━ •
🥳 Your Proof For Task *${nam}* Was Successfully Approved!
*💵 Payment:* ${rew} *₹Rs*
• ━━━━━━━━━━━━━━━━━ •`;

Api.sendMessage({
  chat_id: users,
  text: txt,
  parse_mode: "markdown",
  disable_web_page_preview: true
});

// 🤝 Process Referral Commission (Supports Custom/Boosted User Rates + Auto-Expiry)
var refGate = Bot.getProperty("Referral_status", "✅");
if (refGate != "❌") {
  var refId = Bot.getProperty("UserReferrer_" + users);
  if (refId && refId != users) {
    var defaultComm = Bot.getProperty("ReferralTaskCommission", 0.5);
    var refComm = defaultComm;

    // Check for custom/boosted referral rate for this referrer
    var customRate = Bot.getProperty("CustomRefRate_" + refId);
    if (customRate && customRate.amount) {
      var nowTimeMs = new Date().getTime();
      if (customRate.is_lifetime || (customRate.expires_at && nowTimeMs < customRate.expires_at)) {
        refComm = parseFloat(customRate.amount);
      } else if (customRate.expires_at && nowTimeMs >= customRate.expires_at) {
        // Expired! Automatically remove custom rate and revert to default
        Bot.setProperty("CustomRefRate_" + refId, null);
        var boostedList = Bot.getProperty("BoostedRefUsers", []);
        var newBoosted = [];
        for (var bi = 0; bi < boostedList.length; bi++) {
          var bItem = boostedList[bi];
          var bId = (typeof bItem === "object") ? bItem.id : bItem;
          if (bId != refId) {
            newBoosted.push(bItem);
          }
        }
        Bot.setProperty("BoostedRefUsers", newBoosted, "json");
      }
    }

    // Credit Referrer's Available_For_Payout balance
    var refBal = Libs.ResourcesLib.anotherUserRes("Available_For_Payout", refId);
    refBal.add(+refComm);

    // Increment Referrer's Total Referral Earnings Resource
    var refEarnRes = Libs.ResourcesLib.anotherUserRes("total_referral_earned", refId);
    refEarnRes.add(+refComm);

    // Fetch user details for notification & logging
    var refereeChat = Bot.getProperty("Chat" + users);
    var refereeName = refereeChat && refereeChat.user && refereeChat.user.first_name ? refereeChat.user.first_name : "Referred User";

    var nowTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    // Update referrer's referral list stats for this referee
    var myRefs = Bot.getProperty("UserReferrals_" + refId, []);
    if (myRefs && myRefs.length > 0) {
      for (var r = 0; r < myRefs.length; r++) {
        if (myRefs[r].id == users) {
          myRefs[r].tasks_completed = (myRefs[r].tasks_completed || 0) + 1;
          myRefs[r].total_earned = (myRefs[r].total_earned || 0) + refComm;
          break;
        }
      }
      Bot.setProperty("UserReferrals_" + refId, myRefs, "json");
    }

    // Add entry to Referrer's commission history
    var refHistory = Bot.getProperty("ReferralHistory_" + refId, []);
    if (!refHistory) { refHistory = []; }
    refHistory.unshift({
      referee_id: users,
      referee_name: refereeName,
      task_name: nam,
      amount: refComm,
      date: nowTime
    });
    Bot.setProperty("ReferralHistory_" + refId, refHistory, "json");

    // Send instant notification to Referrer
    var refMsg = "🎉 <b>Referral Commission Earned!</b> 🥳\n\n" +
      "👤 Your referral <b>" + refereeName + "</b> (<code>" + users + "</code>) completed task <b>" + nam + "</b>!\n" +
      "💰 <b>Commission Credited:</b> +₹" + refComm.toFixed(2) + "\n" +
      "📊 <b>Available For Payout:</b> ₹" + refBal.value().toFixed(2) + "\n\n" +
      "🚀 <i>Earnings from your referrals continue for lifetime!</i>";

    Api.sendMessage({
      chat_id: refId,
      text: refMsg,
      parse_mode: "html"
    });
  }
}

var tto = `*• ━━━━━━━━━━━━━━━━━ •
» THE PAYMENT WAS SENT SUCCESSFULLY «*
• ━━━━━━━━━━━━━━━━━ •
🤩_ You Have Done Things Well And Now We Have A Member Happy For The Reward You Gave Him For Doing Your Task!_
• ━━━━━━━━━━━━━━━━━ •`;
Bot.sendMessage(tto);
Bot.setProperty(nam + "" + users + "" + rew + "" + id, true);

// 🗄 Log Approval to Storage Channel if configured
var dbChan = Bot.getProperty("StorageChannelID");
if (dbChan) {
  try {
    Api.sendMessage({
      chat_id: dbChan,
      text: "✅ <b>#TASK_PROOF_APPROVED</b>\n━━━━━━━━━━━━━━━━━━\n🆔 <b>Task ID:</b> #" + id + "\n📌 <b>Task:</b> " + nam + "\n🧑‍💻 <b>Worker:</b> <code>" + users + "</code>\n💰 <b>Paid:</b> ₹" + rew + "\n👑 <b>Owner:</b> <code>" + admin + "</code>",
      parse_mode: "html"
    });
  } catch (e) {}
}

var use = Libs.ResourcesLib.anotherChatRes("total_claimed", id);
use.add(1);

if (use.value() == clm) {
  Bot.setProperty("Status?" + nam, null);
  var ad = Bot.getProperty("Tasks" + admin, []);
  var to = Bot.getProperty("TaskJsonList", []);
  for (var index in ad) {
    var uniqueid = ad[index];
    if (uniqueid == nam) {
      ad.splice(parseInt(index), 1);
    }
  }
  Bot.setProperty("Tasks" + admin, ad, "json");
  for (var index in to) {
    var uniqueid = to[index].name;
    if (uniqueid == nam) {
      to.splice(parseInt(index), 1);
    }
  }
  Bot.setProperty("TaskJsonList", to, "json");
  Bot.setProperty("Task+" + nam, null);
  return;
}
