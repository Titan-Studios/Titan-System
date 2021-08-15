const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Dev = require('../../../data/dev.json');
const Main = require('../../../index');

const commandDescriptions = require('../../../data/commands').map(section => Object.assign(section, {
    commandAliases: section.commands.map(command => command.aliases).flat()
}));

module.exports = new(class extends CommandConstructor {
    constructor() {
        super('Help command', ['help', 'h']);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {Discord.Message} message
     */
    handle(prefix, command, args, message) {
        if (args.length === 0) {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    title: Main.getClient().user.username + ' Help',
                    description: `Hoi! Im just a system here to help out in Titans community! \`${prefix + command + ' [category]'}\``,
                    fields: commandDescriptions.map(section => ({
                        name: `${section.name}`,
                        value: `${Utils.trimArray(section.commands.map(command => `\`${prefix + command.aliases[0]}\``), 5, '`+{num}`').join(' ')}\n${section.description}`,
                        inline: false
                    })),
                    footer: {
                        icon_url: Main.getClient().user.displayAvatarURL(),
                        text: 'Made For You!'
                    },
                    image: {
                        url: Dev.embedBar
                    },
                    color: Colors.LIGHT_PURPLE
                })]
            });
            return;
        }

        args[0] = args[0].toLowerCase();

        let section = commandDescriptions.find(section => args[0] === section.name.toLowerCase());
        let commands = commandDescriptions.find(section => section.commandAliases.includes(args[0]));

        if (section === undefined && commands === undefined) {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    description: `Couldn't find that Category or it could'nt be processed`,
                    color: Colors.RED
                })]
            });
            return;
        }

        if (section) {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    title: section.name,
                    description: section.description + ` \`${section.commands.length}\` commands` + '\n' + section.commands.map(command => `\`${prefix + command.aliases[0]}\` - ${command.description}\n`).join(' '),
                    color: Colors.LIGHT_PURPLE
                })]
            });
        }

    }
});