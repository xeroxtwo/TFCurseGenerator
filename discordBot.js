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
        logger.info('saw command: ' + message);
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd.toLowerCase()) {
            case 'tf-curse':
                safeTfCommand(args, channelID, true);
                break;
            case 'tf':
                safeTfCommand(args, channelID, false);
                break;
            break;
         }
     }
    if (message.includes("<@!688492979312525357>")) {
        logger.warn("Mentioned! " + message);
        sendMessage(
            channelID,
            String.format("Hey, <@!{0}>!\nUse this form to talk to me: {1}.\nIf you want help, DM me `!TF help`",
                userID,
                "https://forms.gle/m8DUedNp7eK5gabf8"));

    }
});

function safeTfCommand(args, channelID, isCurse) {
    var i;
    for (i = 0; i < 3; i++) {
        try {
            tfCommand(args, channelID, isCurse);
            break;
        } catch(err) {
            logger.error("failed to generate curse " + i + ": " + err);
            logger.error(err.stack);
        }
    }
        if (i == 3) {
        return;
    }
}

function tfCommand(args, channelID, isCurse) {
    // Generator options
    var sfwSelected = true;
    var nsfwSelected = false;
    var lewdSelected = false;
    var maleSelected= false;
    var femaleSelected = false;
    var otherSexSelected = true;
    var humansSelected = true;
    var humanoidsSelected = true;
    var beastsSelected = true;
    var mythicalSelected = true;
    var inanimateSelected = true;
    var mentalSelected = true;
    var tgSelected = true;
    var subject = null;

    for (const arg in args) {
        var currentArg = args[arg].trim();
        if (currentArg.length == 0) {
            continue;
        }
        if (currentArg[0] != "-") {
            subject = args[arg];
        } else {
            switch(currentArg.toLowerCase().slice(1)) {
                case 'm':
                    maleSelected = true;
                    otherSexSelected = false;
                    break;
                case 'f':
                    femaleSelected = true;
                    otherSexSelected = false;
                    break;
                case 'creature':
                    humansSelected = false;
                    inanimateSelected = false;
                    mentalSelected = false;
                    break;
                case 'notg':
                    tgSelected = false;
                    break;
                case 'dirty':
                    sfwSelected = false;
                    nsfwSelected = true;
                    break;
                case 'lewd':
                    sfwSelected = false;
                    nsfwSelected = false;
                    lewdSelected = true;
                    break;
                default:
                    sendMessage(
                        channelID,
                        String.format("I don't recognize the option `{0}`. {1}\n{2}\nFor more info say or DM me `!TF help`",
                            currentArg,
                            getOptionsUsage(),
                            getExampleCommands()));
                    return;
            }
        }
    }
	var options = new TfOptions(sfwSelected,
        nsfwSelected,
        lewdSelected,
        maleSelected,
        femaleSelected,
        otherSexSelected,
        humansSelected,
        humanoidsSelected,
        beastsSelected,
        mythicalSelected,
        inanimateSelected,
        mentalSelected,
        tgSelected);

    var messageText = "";
    if (args.length == 0 || subject == null) {
        sendMessage(
            channelID,
            String.format("Wait, who did you want me to transform? (Try `!TF{0} me` or `!TF{0} @username`). For more info say or DM me `!TF help` :)",
                isCurse ? "-curse" : "",
                isCurse ? "" : "-curse"));
        return;
    } else {
        var curseOutput;
        if (subject.toLowerCase() == "help" || subject.toLowerCase() == "info") {
            sendMessage(
                channelID,
                String.format("Use me to transform yourself and others! Commands take the form of `!TF target [options]` or `!TF-curse target [options]`\n" +
                    "{0}\n{1}\nI was created by Xerox2.\nTwitter: https://twitter.com/XeroxToo\n" +
                    "Send me feedback: https://forms.gle/p8PFUffYTjuTTUV57\nView on Github: https://github.com/xeroxtwo/TFCurseGenerator",
                    getExampleCommands(),
                    getOptionsUsage()
                    ));
            return;
        }
        if (subject.toLowerCase() == "me" || subject.toLowerCase() == "myself") {
            curseOutput = generateSecondPersonTF(isCurse, options);
            messageText = String.format("{0}\n{1}",
                isCurse ? "Here's a curse for you:" : "That can be arranged.",
                unHTML(generateSecondPersonTF(isCurse, options).curseText).capitalize());
        } else {
            curseOutput = generateTransformation(subject, isCurse, options);
            messageText = String.format("{0} {1}!\n{2}",
                subject,
                isCurse ? "is cursed!": "transforms!",
                unHTML(curseOutput.curseText).capitalize());
        }
        if (curseOutput.circeText && Math.random() < 0.4) {
            messageText = messageText + "\n" + unHTML(curseOutput.circeText);
        }
        sendMessage(channelID, messageText);
    }
}

function sendMessage(channelID, messageText) {
    logger.info('sending message: ' + messageText);
    bot.sendMessage({
        to: channelID,
        message: messageText
    });
}

function unHTML(htmlText) {
    let regexp = /<a href=\"(.*)\">(.*)<\/a>/g;
    var output = htmlText.replace(/<p>/g, "");
    output = output.replace(/<\/p>/g, "\n");
    output = output.replace(/<\/br>/g, "");
    output = output.replace(/<br>/g, "");
    var results = regexp.exec(htmlText);
    if (results != null) {
        var text = results[2];
        var link = results[1];
        output = output.replace(regexp, text);
        output = output + link;
    }
    return output;
}

function getOptionsUsage() {
    return "The supported options are:\n" +
        "`-m` target starts male,  `-f` target starts female,  `-creature` target will turn into a creature,  " +
        "`-noTG` target will not switch genders,  `-dirty` TF may be NSFW,  `-lewd` TF may be very NSFW or bizarre.";
}

function getExampleCommands() {
   return "Example commands: `!TF @username`  |  `!TF-curse me -lewd`  |  `!TF @username -m -noTG`  |  `!TF-curse @username -creature -dirty`";
}
