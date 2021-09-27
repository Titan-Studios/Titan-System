// Env
require('dotenv').config();

// Requirements
const Discord = require('discord.js');
const Distube = require('distube');
const CommandManager = require('./lib/managers/commandManager');
const Modules = require('./lib/utils/modules');
const BOT = require('./lib/utils/bot');

// Client
const client = new Discord.Client(BOT.CLIENT);

// Distube client
const distubeClient = new Distube.default(client, BOT.DISTUBE);
const distubeFilters = Object.keys(distubeClient.filters);

// Client online
client.on('ready', () => {
    console.log(`🟩 | Client - Logged in as ${client.user.tag} (${client.user.id})\n🟩 | Client - Authorize with https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
    
    Modules.userJoinAndLeave(client);
    Modules.distubeMusic(distubeClient);
    Modules.button(client);

    // Client status
    client.user.setActivity({
        name: 't?help',
        type: 'WATCHING'
    });
});

// New message found
client.on('messageCreate', message => {
    if (message.author.bot) return;
    CommandManager.handleCommand(message);
});

module.exports.getClient = () => client; // Bot Client
module.exports.getDistubeClient = () => distubeClient; // Distube music
module.exports.getDistubeFilters = () => distubeFilters; // Distube Filters

client.login(process.env.BOT_TOKEN);