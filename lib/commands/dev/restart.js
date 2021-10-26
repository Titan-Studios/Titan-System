const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Dev = require('../../../data/dev.json');

module.exports = new(class extends CommandConstructor {
    constructor() {
        super('Restart command', ['restart']);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {number} start
     * @param {Discord.Message} message
     */
    async handle(prefix, command, args, message, bot) {
        if (!Dev.ownerIDs.includes(message.author.id)) {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    description: 'Sorry, Only my Devs can use this command',
                    color: Colors.RED
                })]
            });
            return;
        }
        message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'Restarting...',
                color: Colors.BLURPLE
            })]
        }).then(() => {
            process.exit()
        });

    }
});