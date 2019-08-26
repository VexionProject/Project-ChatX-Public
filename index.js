const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const config = require("./config.json");
var bot = new Discord.Client();

const Version = "1.0.0";

var servers = {};

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

bot.on("ready", function(){
    console.log("Version: " + Version);
    console.log(" ");
    console.log("Bot Info: ");
    console.log("Token: " + config.token);
    console.log("Bot Name: " + bot.user.username);
    console.log("Bot Owner: " + config.owner);
    setTimeout(() => {
    console.log(" ");
    console.log("Info Module Online");
    }, 2000);
    setTimeout(() => {
    console.log(" ");
    console.log("Music Module Online");
    }, 2000);
    setTimeout(() => {
    console.log(" ");
    console.log("Admin Module Online");
    }, 2000);
    setTimeout(() => {
    console.log(" ");
    console.log("Other Modules Online");
    }, 2000);
    setTimeout(() => {
    console.log(" ");
    console.log("Bot Online...");
    console.log(" ");
    }, 4000);
    //bot.user.setStatus("dnd");
    //bot.user.setGame(config.game);
    bot.user.setActivity("You Sleep", {type: 3});
});

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "general").sendMessage(member.toString() + " Has Joined The Server!");
});

bot.on("message", function(message){
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(config.prefix)) return;
    

    var args = message.content.substring(config.prefix.length).split(" ");

    switch (args[0].toLowerCase()) {
        default:
            message.channel.sendMessage("Invalid Command\nUse " + config.prefix + "help For Help");
            break;
        case "help":
            var Help = new Discord.RichEmbed()
                .setColor(config.colour)
                .setThumbnail("https://i.imgur.com/je2LHHe.png")
                .setAuthor("Project ChatX", "https://i.imgur.com/je2LHHe.png", "https://chat.troplo.com/")
                .setTitle("Help:")
				.addField("Other~~", config.prefix + "chatx: Get some info on ChatX~~")
                .addField("Info", config.prefix + "me: Shows Info About You\n" + config.prefix + "botinfo: Shows Info About The Bot\n" + config.prefix + "projectinfo: List Of Infomation\n" + config.prefix + "botowner: Shows Infomation About The Bot Owner")
                .addField("Music", config.prefix + "play: Plays Some Music\n" + config.prefix + "skip: Skips The Song\n" + config.prefix + "stop: Stops The Music\n~~" + config.prefix + "volume: sets the music volume~~")
                .addField("Admin", config.prefix + "setname: Sets The Name Of The Bot\n" + config.prefix + "setavatar: Sets The Avatar Of The Bot\n" + config.prefix + "shutdown: shutsdown the bot")
                .setFooter("Project Name: ChatX - Version: " + Version)
            //message.channel.sendMessage(":mailbox_with_mail:")
            message.channel.sendEmbed(Help)
            break;
        case "botinfo":
            var BotInfo = new Discord.RichEmbed()
                .setColor("#0077ff")
                .setURL(config.url)
                .setThumbnail(bot.user.avatarURL)
                .setAuthor("Project ChatX", "https://i.imgur.com/je2LHHe.png", "https://chat.troplo.com/")
                .setTitle("Bot Info:")
                .addField("Project Creator:", "DarkMatter#0712", true)
                .addField("Project Name:", "ChatX", true)
                .addField("Bot:", bot.user.username, true)
                .addField("Bot Owner:", config.owner, true)
                .setFooter("Project Name: ChatX - Version: " + Version)
            message.channel.sendEmbed(BotInfo);
            break;
        case "projectinfo":
            var BotInfo = new Discord.RichEmbed()
                .setColor("#0077ff")
                .setURL("http://overwatergames.com")
                .setThumbnail("https://i.imgur.com/je2LHHe.png")
                .setAuthor("Project ChatX", "https://i.imgur.com/je2LHHe.png", "https://chat.troplo.com/")
                .setTitle("Project Info")
                .addField("Project Name:", "ChatX", true)
                .addField("Project Owner:", "DarkMatter#0712", true)
                .addField("Project Version: ", Version, true)
                .setFooter("Project Name: ChatX - Version: " + Version)
            message.channel.sendEmbed(BotInfo);
            break;
        case "botowner":
            var BotInfo = new Discord.RichEmbed()
                .setColor(config.colour)
                .setURL(config.url)
                .setThumbnail(config.image)
                .setTitle("Bot Owner:")
                .addField("Name:", config.owner + config.tag)
                .addField("Bot Name:", bot.user.username)
                .setFooter("Project Name: ChatX - Version: " + Version)
            message.channel.sendEmbed(BotInfo);
            break;
        case "me":
            var Me = new Discord.RichEmbed()
                .setColor(config.colour)
                .setThumbnail(message.author.avatarURL)
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setTitle("Me:")
                .addField("Name:", message.author.username)
                .addField("Discrim", "#" + message.author.discriminator)
                .addField("ID", message.author.id)
                .addField("Avatar URL:", message.author.avatarURL)
                .setFooter("Project Name: ChatX - Version: " + Version)
            message.channel.sendEmbed(Me);
            break;

        case "play":
            if (!args[1]) {
                message.channel.sendMessage("Please Provide A Link");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("You Need To Be In A Voice Channel");
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);
            let Link = args[1];

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
                console.log("User " + message.author.username + " Played The Song " + Link +" on server id " + message.guild.id + "\n")
                var Music = new Discord.RichEmbed()
                .setColor(0xFF0000)
                .setThumbnail(Link)
                .setAuthor(bot.user.username, bot.user.avatarURL, Link)
                .setTitle("Song:")
                .addField("Requested By:", message.author.username)
                .addField("URL:", Link, true)
                .setFooter("Project Name: ChatX - Version: " + Version)
                message.channel.sendEmbed(Music)
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
            
        case "setname":
            if(message.author.id !== config.ownerid) {
                message.channel.sendMessage("Command Error")
                console.log("user " + message.author.username + " tryed to use the setname command")
            }
            else{
                if(args[1]){
                    let newname = args.slice(1).join(" ");;
                    bot.user.setUsername(newname)
                    message.channel.sendMessage("Name Set To " + newname)
                }
                else{
                    message.channel.sendMessage("Command Error")
                    console.log("user " + message.author.username + " tryed to use the setname command without an argument")
                }
            }
            break;
        case "setavatar":
            if(message.author.id !== config.ownerid) {
                message.channel.sendMessage("Command Error")
                console.log("user " + message.author.username + " tryed to use the setavatar command")
            }
            else{
                if(args[1]){
                    let newavatar = args[1];
                    bot.user.setAvatar(newavatar)
                    message.channel.sendMessage("Avatar Set To " + newavatar)
            }
            else{
                message.channel.sendMessage("Command Error")
                console.log("user " + message.author.username + " tryed to use the setavatar command without an argument")
            }
        }
        break;
		case "chatx":
		var ChatX = new Discord.RichEmbed()
                .setColor("#0077ff")
                .setDescription("[ChatX](https://chat.troplo.com/) is a community of some awsome people.");
            message.channel.send(ChatX)
			//message.channel.send("ChatX is a community of some cool people.")
		break;
        case "shutdown":
        if(message.author.id !== config.ownerid) {
            message.channel.sendMessage("Command Error")
            console.log("user " + message.author.username + " tryed to use the shutdown command")
        }
        else{
            message.channel.sendMessage(":wave:")
            bot.destroy((err) => {
                console.log(err);
        });
        console.end(0)
        }
        break;
        
    }
});

bot.login(config.token);