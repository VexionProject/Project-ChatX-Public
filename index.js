const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const config = require("./config.json");
var bot = new Discord.Client();

// Require The moment
const moment = require("moment");
require("moment-duration-format");

let os = require('os');
let cpuStat = require("cpu-stat");

const Version = "1.2.8";

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

function setClear() {
  setTimeout(function() {
	  
	  console.clear();
	  
    setTime();
  },1000);
}

function setTime() {
  setTimeout(function() {
    const duration2 = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
	
	console.log("Version: " + Version);
    console.log(" ");
    console.log("Bot Info: ");
    console.log("Token: " + config.token);
    console.log("Bot Name: " + bot.user.username);
    console.log("Bot Owner: " + config.owner);
	console.log(" ");
	console.log("Online For: "+duration2);
	
    setClear();
  },1);
}

console.log("If this screen stays black for a long time it means the site is down");

bot.on("ready", function(){
	console.clear();
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
	setClear();
    }, 4000);
    //bot.user.setStatus("dnd");
    //bot.user.setGame(config.game);
    bot.user.setActivity("You Sleep", {type: 3});
});



bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "general").send(member.toString() + " Has Joined The Server!");
});

//bot.fetchUser(config.ownerid).then(tag => {
//+tag.username+"#"+tag.discriminator

bot.on("message", function(message){
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(config.prefix)) return;
    

    var args = message.content.substring(config.prefix.length).split(" ");

    switch (args[0].toLowerCase()) {
		
        default:
            message.channel.send("Invalid Command\nUse " + config.prefix + "help For Help");
            break;
        case "help":
            var Help = new Discord.RichEmbed()
                .setColor(config.colour)
                .setThumbnail("https://i.imgur.com/je2LHHe.png")
                .setAuthor("Project ChatX", "https://i.imgur.com/je2LHHe.png", "https://chatx.xyz/")
                .setTitle("Help:")
				.addField("Other", config.prefix + "chatx: Get some info on ChatX\n" + config.prefix + "download: Download the ChatX open-source bot\n" + config.prefix + "ping: Pings The Bot\n" + config.prefix + "stats: Stats For The Bots Host\n" + config.prefix + "uptime: Bots Uptime")
                .addField("Info", config.prefix + "me: Shows Info About You\n" + config.prefix + "botinfo: Shows Info About The Bot\n" + config.prefix + "projectinfo: List Of Infomation\n" + config.prefix + "botowner: Shows Infomation About The Bot Owner")
                .addField("Music","~~" + config.prefix + "play: Plays Some Music\n" + config.prefix + "skip: Skips The Song\n" + config.prefix + "stop: Stops The Song\n" + config.prefix + "pause: Pauses The Song\n" + config.prefix + "resume: Resumes The Song~~")
                .addField("Admin", config.prefix + "test: Test command\n" + config.prefix + "setname: Sets The Name Of The Bot\n" + config.prefix + "setavatar: Sets The Avatar Of The Bot\n" + config.prefix + "shutdown: shutsdown the bot")
                .setFooter("Project Name: ChatX - Version: " + Version)
            //message.channel.send(":mailbox_with_mail:")
            message.channel.send(Help)
            break;
        case "botinfo":
            var BotInfo = new Discord.RichEmbed()
                .setColor("#0077ff")
                .setURL(config.url)
                .setThumbnail(bot.user.avatarURL)
                .setAuthor("Project ChatX", "https://i.imgur.com/je2LHHe.png", "https://chatx.xyz")
                .setTitle("Bot Info:")
                .addField("Project Creator:", "DarkMatter#0712", true)
                .addField("Project Name:", "ChatX", true)
                .addField("Bot:", bot.user.username, true)
                .addField("Bot Owner:", config.owner+"#"+config.tag, true)
                .setFooter("Project Name: ChatX - Version: " + Version)
            message.channel.send(BotInfo);
            break;
        case "projectinfo":
            var BotInfo = new Discord.RichEmbed()
                .setColor("#0077ff")
                .setURL("https://chatx.xyz")
                .setThumbnail("https://i.imgur.com/je2LHHe.png")
                .setAuthor("Project ChatX", "https://i.imgur.com/je2LHHe.png", "https://chatx.xyz")
                .setTitle("Project Info")
                .addField("Project Name:", "ChatX", true)
                .addField("Project Owner:", "DarkMatter#0712", true)
                .addField("Project Version: ", Version, true)
                .setFooter("Project Name: ChatX - Version: " + Version)
            message.channel.send(BotInfo);
            break;
        case "botowner":
            var BotInfo = new Discord.RichEmbed()
                .setColor(config.colour)
                .setURL(config.url)
                .setThumbnail(config.image)
                .setTitle("Bot Owner:")
                .addField("Name:", config.owner+"#"+config.tag)
                .addField("Bot Name:", bot.user.username)
                .setFooter("Project Name: ChatX - Version: " + Version)
            message.channel.send(BotInfo);
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
            message.channel.send(Me);
            break;

        case "play":
            if (!args[1]) {
                message.channel.send("Please Provide A Link");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.send("You Need To Be In A Voice Channel");
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
                message.channel.send(Music)
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
		case "pause":
            var server = servers[message.guild.id];
        if (message.guild.voiceConnection) {
            server.dispatcher.pause();
        }
            break;
      case "resume":
            var server = servers[message.guild.id];
        if (message.guild.voiceConnection) {
            server.dispatcher.resume();
        }
            break;
            
        case "setname":
            if(message.author.id !== config.ownerid) {
                message.channel.send("Command Error")
                console.log("user " + message.author.username + " tried to use the setname command")
            }
            else{
                if(args[1]){
                    let newname = args.slice(1).join(" ");
                    bot.user.setUsername(newname);
					//message.guild.member(bot.user).setNickname(newname)
                    message.channel.send("Name Set To " + newname)
                }
                else{
                    message.channel.send("Command Error")
                    console.log("user " + message.author.username + " tried to use the setname command without an argument")
                }
            }
            break;
        case "setavatar":
            if(message.author.id !== config.ownerid) {
                message.channel.send("Command Error")
                console.log("user " + message.author.username + " tried to use the setavatar command")
            }
            else{
                if(args[1]){
                    let newavatar = args[1];
                    bot.user.setAvatar(newavatar)
                    message.channel.send("Avatar Set To " + newavatar)
            }
            else{
                message.channel.send("Command Error")
                console.log("user " + message.author.username + " tried to use the setavatar command without an argument")
            }
        }
        break;
		
		case "chatx":
		var ChatX = new Discord.RichEmbed()
			.setColor("#0077ff")
			.setDescription("[ChatX](https://chatx.xyz) is a community of some awsome people.");
        message.channel.send(ChatX)
			//message.channel.send("ChatX is a community of some cool people.")
		break;
		case "download":
		var DownloadX = new Discord.RichEmbed()
			.setColor("#0077ff")
			.setDescription("Download ChatX open-source\n[Download](https://github.com/VexionProject/Project-ChatX-Public)")
			.setFooter("Project Name: ChatX - Version: " + Version)
		message.channel.send(DownloadX);
		break;
		
		case "test":
		var TestX = new Discord.RichEmbed()
			.setAuthor(bot.user.username, config.image, config.url)
			.setColor(config.colour)
			.setDescription(bot.user.username + " Is Online And Fully Functioning")
			.setFooter("Project Name: ChatX - Version: " + Version)
		message.channel.send(TestX);
		break;
		case "ping":
        const Ping = new Discord.RichEmbed()
          .setColor(config.colour)
          .addField("Latency:", new Date().getTime() - message.createdTimestamp+" ms")
          .addField("Client Latency:", bot.ping+"ms")
        message.channel.send(Ping)
        break;
		case "stats":
          let cpuLol;
  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }
    
  const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  const Stats = new Discord.RichEmbed()
    .setTitle("*** Stats ***")
    .setColor("#C0C0C0")
    .addField("• Mem Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
    .addField("• Uptime ", `${duration}`, true)
    .addField("• Node", `${process.version}`, true)
    .addField("• CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
    .addField("• CPU usage", `\`${percent.toFixed(2)}%\``,true)
    .addField("• Arch", `\`${os.arch()}\``,true)
    .addField("• Platform", `\`\`${os.platform()}\`\``,true)
    .setFooter("Project Name: ChatX - Version: " + Version)
    message.channel.send(Stats)
  });
        break;
		case "uptime":
        const duration1 = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
		var UptimeX = new Discord.RichEmbed()
		.setColor(config.colour)
		.setDescription("Online For: "+duration1)
		message.channel.send(UptimeX);
        break;
		
        case "shutdown":
        if(message.author.id !== config.ownerid) {
            message.channel.send("Command Error")
            console.log("user " + message.author.username + " tried to use the shutdown command")
        }
        else{
            message.channel.send(":wave:")
            bot.destroy((err) => {
                console.log(err);
        });
        console.end(0)
        }
        break;
       
    }
	
});
//});

bot.login(config.token);