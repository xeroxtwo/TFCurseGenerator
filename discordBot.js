var Discord = require('discord.io');
var logger = require('winston');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token:  process.env.DISCORD_BOT_TOKEN,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.startsWith('!')) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd.toLowerCase()) {
            case 'tf':
                tfCommand(args, channelID);
            break;
            // Just add any case commands if you want to..
         }
     }
});

function tfCommand(args, channelID) {
    var messageText = "";
    if (args.length == 0) {
        messageText = "Wait, who did you want me to transform? (Try `!TF me` or `!TF @username`)";
    } else {
        var subject = args[0].toLowerCase();
        var curseText = unHTML(generateCurse().curseText);
        if ( subject == "me" || subject == "myself" ) {
            messageText = curseText;
        } else {
            messageText = changeSubject(curseText, subject);
        }
    }
    bot.sendMessage({
        to: channelID,
        message: messageText
    });
}

function unHTML(htmlText) {
    var output = htmlText.replace(/<p>/g, "");
    output = output.replace(/<\/p>/g, "\n");
    output = output.replace(/<\/br>/g, "\n");
    output = output.replace(/<br>/g, "\n");
    return output;
}

function changeSubject(message, newSubject) {
    var output = message.replace(/your/g, "their");
    var output = output.replace(/Your/g, "Their");
    var output = output.replace(/you/g, "they");
    var output = output.replace(/You/g, "They");
    return String.format("Here's a curse for {0}:\n {1}", newSubject, output);
}