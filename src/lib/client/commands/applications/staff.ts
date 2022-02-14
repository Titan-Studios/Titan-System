//#region Dependencies
import * as Discord from 'discord.js';
import { client } from '../..';
import * as Constructor from '../../../manager/constructor';
import { Color, DiscordButton } from '../../../utility';
//#endregion

//#region Command
export = new (class extends Constructor.CommandBase {
    constructor() {
        super(1.001, 'SLASH', 'Staff', 'Apply for staff', { aliases: ['staff'], permissions: [], options: [{ type: 'STRING', name: 'name', description: 'What is your name?', required: true }, { type: 'STRING', name: 'dob', description: 'What is your date of birth', required: true }, { type: 'STRING', name: 'reason', description: 'Why should we select you to be a staff?', required: true }, { type: 'STRING', name: 'banned', description: 'Have you ever been banned from a discord server, if yes reason?', required: true }, { type: 'STRING', name: 'servers', description: 'How many servers have you owned or managed', required: true }, { type: 'STRING', name: 'help', description: 'What will you help do in the community?', required: true }, { type: 'STRING', name: 'other', description: 'Othger info you would like us to know', required: false }] });
    }

    // Initialization
    public initialize(type: 'AWAKE' | 'UPDATE'): void { }

    // Handles Message Command
    public message(prefix: string, command: string, args: string[], message: Discord.Message<boolean>, mentions?: Discord.Collection<string, Discord.User>): void {

    }

    // Handles Slash Command
    public slash(commandInteraction: Discord.CommandInteraction<Discord.CacheType>, options?: Discord.CommandInteractionOption<Discord.CacheType>[]): void {
        let name = options.find(a => a.name == 'name');
        let dob = options.find(a => a.name == 'dob');
        let reason = options.find(a => a.name == 'reason');
        let banned = options.find(a => a.name == 'banned');
        let servers = options.find(a => a.name == 'servers');
        let help = options.find(a => a.name == 'help');
        let other = options.find(a => a.name == 'other');

        commandInteraction.reply({
            ephemeral: true,
            embeds: [new Discord.MessageEmbed({
                title: 'Your Staff Application',
                fields: [{
                    name: 'Name:',
                    value: name.value.toString()
                }, {
                    name: 'Date of Birth:',
                    value: dob.value.toString(),
                    inline: true
                }, {
                    name: 'Reason For Applying:',
                    value: reason.value.toString()
                }, {
                    name: 'Ban History:',
                    value: banned.value.toString()
                }, {
                    name: 'Servers Owned/Managed:',
                    value: servers.value.toString()
                }, {
                    name: 'How Will You Help:',
                    value: help.value.toString()
                }, {
                    name: 'Other:',
                    value: other?.value ? other.value.toString() : '*None*'
                }],
                color: Color.BLURPLE
            })],
            components: [new Discord.MessageActionRow({ components: [DiscordButton('Send', `Send-${commandInteraction.id}`, 'SUCCESS'), DiscordButton('Cancel', `Cancel-${commandInteraction.id}`, 'DANGER')] })]
        }).catch(() => { });

        client.on('interactionCreate', buttonInteraction => {
            if (!buttonInteraction.isButton()) return;
            if (buttonInteraction.customId == `Send-${commandInteraction.id}`) {
                buttonInteraction.deferUpdate().catch(() => { });
                let channel = client.channels.cache.get('885240339345055745');
                if (channel.isText()) {
                    channel.send({
                        embeds: [new Discord.MessageEmbed({
                            footer: { text: `ID: ${commandInteraction.user.id}` },
                            thumbnail: { url: commandInteraction.user.displayAvatarURL({ dynamic: true }) },
                            title: 'Staff Application',
                            description: `${commandInteraction.user.tag}`,
                            fields: [{
                                name: 'Name:',
                                value: name.value.toString()
                            }, {
                                name: 'Date of Birth:',
                                value: dob.value.toString(),
                                inline: true
                            }, {
                                name: 'Reason For Applying:',
                                value: reason.value.toString()
                            }, {
                                name: 'Ban History:',
                                value: banned.value.toString()
                            }, {
                                name: 'Servers Owned/Managed:',
                                value: servers.value.toString()
                            }, {
                                name: 'How Will You Help:',
                                value: help.value.toString()
                            }, {
                                name: 'Other:',
                                value: other?.value ? other.value.toString() : '*None*'
                            }],
                            color: Color.BLURPLE
                        })],
                        components: [new Discord.MessageActionRow({ components: [DiscordButton('Accept', `ACCEPT_STAFF`, 'SUCCESS'), DiscordButton('Deny', `DENY_STAFF`, 'DANGER')] })]
                    }).catch(() => { });
                    commandInteraction.editReply({ components: [new Discord.MessageActionRow({ components: [DiscordButton('Sent', '0', 'SECONDARY', null, null, true)] })] }).catch(() => { });
                }
            }
            else if (buttonInteraction.customId == `Cancel-${commandInteraction.id}`) {
                buttonInteraction.deferUpdate().catch(() => { });
                commandInteraction.editReply({ components: [new Discord.MessageActionRow({ components: [DiscordButton('Cancelled', '0', 'SECONDARY', null, null, true)] })] }).catch(() => { });
            }
        });
    }
});
//#endregion