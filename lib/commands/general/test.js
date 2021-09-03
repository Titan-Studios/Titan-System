const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Dev = require('../../../data/dev.json');
const Main = require('../../../index');

module.exports = new(class extends CommandConstructor {
    constructor() {
        super('Test command', ['verifyembed']);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {Discord.Message} message
     */
    handle(prefix, command, args, message) {
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return;
       
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed({
                    title: 'Hello!',
                    description: 'Please read our terms first, Then you can verify yourself.\nMake sure your answers are clear and true or you will not be verified!',
                    color: Colors.BLURPLE
                })
            ],
            components: [new Discord.MessageActionRow({
                components: [
                    new Discord.MessageButton({
                        customId: 'Verify',
                        label: 'Verify',
                        style: 'PRIMARY'
                    }),
                    new Discord.MessageButton({
                        customId: 'Terms',
                        label: 'Terms',
                        style: 'PRIMARY'
                    })
                ]
            })]
        });
        message.delete();
    }
});