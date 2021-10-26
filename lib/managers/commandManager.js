const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const Main = require('../../index');
const Colors = require('../utils/colors');
const config = require('../../data/config.json');

const ArgParser = require('../utils/argparser');

const commandsRootDir = path.resolve(__dirname, '../commands');

/**
 * @param {string} rootDir
 * @returns {string[]}
 */
const fetchCommandFilePaths = (rootDir = commandsRootDir) => {
    let commandFilePaths = [];
    fs.readdirSync(rootDir).map(fileName => path.resolve(rootDir, fileName)).forEach(filePath => {
        if (fs.statSync(filePath).isDirectory()) commandFilePaths.push(...fetchCommandFilePaths(filePath));
        else if (filePath.endsWith('.js')) commandFilePaths.push(filePath);
    });
    return commandFilePaths;
};

let handlers = fetchCommandFilePaths().map(commandFilePath => require(commandFilePath));
let ping;

/**
 * @param {Discord.Message} message
 * @returns {Promise<void>}
 */
const handleCommand = message => {
    if (!message.guild) {
        const prefix = 't?';
        if (!message.content.toLowerCase().startsWith(prefix)) return;
        let args = ArgParser.parse(message.content),
            alias = args.shift().substr(prefix.length).toLowerCase();
        let handler = handlers.find(handler => handler.aliases.includes(alias));
        if (handler !== undefined) handler.handle(prefix, alias, args, message);
        return;
    } else {
        if (message.content.startsWith(`<@!${Main.getClient().user.id}>`)) return message.channel.send(`Hewo my prefix is \`${config.prefix}\``);
        if (!message.content.toLowerCase().startsWith(config.prefix)) return;
        let args = ArgParser.parse(message.content),
            alias = args.shift().substr(config.prefix.length).toLowerCase();
        let handler = handlers.find(handler => handler.aliases.includes(alias));
        if (handler !== undefined) handler.handle(config.prefix, alias, args, message)
        else message.channel.send(new Discord.MessageEmbed({
            description: `Couldn't find that command or it could'nt be processed`,
            color: Colors.RED
        }));
    }
};

module.exports.handleCommand = handleCommand;