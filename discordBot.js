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
        if ( subject == "me" || subject == "myself" ) {
            messageText = unHTML(generateSecondPersonCurse().curseText);
        } else {
            messageText = unHTML(generateCurse(subject).curseText);
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

