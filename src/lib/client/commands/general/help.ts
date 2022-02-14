//#region Dependencies
import * as Discord from 'discord.js';
import * as Constructor from '../../../manager/constructor';
import { Utils, DiscordButton as Button, ButtonList as Buttons, commandBaseList, commandList, Color } from '../../../utility';
//#endregion

//#region Feilds
const commandOptions: Discord.MessageSelectOptionData[] = [];
let main = Button('Return', 'MAIN');

let helpEmbed: Discord.MessageEmbed;
let infoEmbed: Discord.MessageEmbed;
let supportEmbed: Discord.MessageEmbed;
let commandOptionEmbed: Discord.MessageEmbed;
let mainPage: Discord.MessageActionRow;
let commandsPage: Discord.MessageActionRow;
//#endregion

//#region Command
export = new (class extends Constructor.CommandBase {
    constructor() {
        super(0.001, 'BOTH', 'Help', 'Gives information on the bot and a list of commands etc', { aliases: ['help', 'h'], permissions: [], options: [{ type: 'STRING', name: 'command', description: 'Info on a specific command', required: false }] });
    }

    // Initialization
    public initialize(type: 'AWAKE' | 'UPDATE'): void {
        if (type == 'AWAKE') {
            for (let i = 0; i < commandList.length; i++) {
                const a = commandList[i];
                commandOptions.push({
                    label: a.name,
                    value: a.id.toString(),
                    description: `[${Utils.padLeadingZeros(a.commands.length, 2)}] - \n${a.description}.`,
                    emoji: a.emoji
                });
            }
            //#region Embeds
            helpEmbed = new Discord.MessageEmbed({
                color: Color.LIGHT_PURPLE,
                description: 'Hewo! Im a multipurpose Discord Bot named Titan\n\nNeed help? Use to dropdown menu and select an option.'
            });
            infoEmbed = new Discord.MessageEmbed({
                color: Color.LIGHT_PURPLE,
                title: 'Titan-Bot',
                description: `Hewo! Im Titan-bot.\n\nIm a multipurpose Discord Bot.\nYou can use me for loads of cool stuff, like \`economy\`, \`music\`, \`fun\`, \`starboard\` and lots more! Im filled with loads of useful stuff!\n\nI was created by \` \` for you to use and have fun!\n\nIf you have any questions feel free to join our Discord server!\nTheres alawys room for improvement!`
            });
            supportEmbed = new Discord.MessageEmbed({
                color: Color.LIGHT_PURPLE,
                description: 'Somthing else?'
            });
            commandOptionEmbed = new Discord.MessageEmbed({
                color: Color.LIGHT_PURPLE,
                description: 'Please select a command category'
            });
            //#endregion

            //#region Action Rows
            mainPage = new Discord.MessageActionRow({
                components: [new Discord.MessageSelectMenu({
                    customId: 'Help',
                    options: [{
                        label: 'Info',
                        emoji: '📜',
                        value: 'HELP_INFO',
                        description: 'Info about me.'
                    }, {
                        label: 'Commands',
                        emoji: '📑',
                        value: 'HELP_COMMANDS',
                        description: `List of commands you can run [${commandBaseList.length.toLocaleString()}]`
                    },
                    // {
                    //     label: 'Stats',
                    //     emoji: '📊',
                    //     value: 'HELP_STATS',
                    //     description: 'My statistics'
                    // }, 
                    {
                        label: 'Support',
                        emoji: '🧱',
                        value: 'HELP_SUPPORT',
                        description: 'Something else?'
                    }]
                })]
            });
            //#endregion
        }
        if (type == 'UPDATE') {
            //#region Command List
            commandsPage = new Discord.MessageActionRow({
                components: [new Discord.MessageSelectMenu({
                    customId: 'Commands',
                    options: commandOptions
                })]
            });
            //#endregion
        }
    }

    // Handles Message Command
    public message(prefix: string, command: string, args: string[], message: Discord.Message<boolean>, mentions?: Discord.Collection<string, Discord.User>, extra?: object): void {
        //#region Main
        const cmd = commandBaseList.find(a => a.name.toLowerCase() == args[0]?.toLowerCase());
        if (!args[0] && !cmd) {
            //#region Message
            message.channel.send({
                embeds: [helpEmbed],
                components: [mainPage]
            }).then(async (msg) => {
                //#region Interaction
                const filter = (filter: { user: { id: string; }; }) => filter.user.id == message.author.id;
                const collector = await msg.createMessageComponentCollector({
                    filter
                });

                collector.on('collect', (interaction) => {
                    if (interaction.componentType == 'SELECT_MENU') {
                        //@ts-ignore
                        if (interaction.values[0] == 'HELP_INFO') {
                            msg.edit({
                                embeds: [infoEmbed],
                                components: [new Discord.MessageActionRow({
                                    components: [main, Buttons.Invite, Buttons.Server, Buttons.Premium]
                                })]
                            }).catch(() => { });
                        }
                        //@ts-ignore
                        if (interaction.values[0] == 'HELP_COMMANDS') {
                            msg.edit({
                                embeds: [commandOptionEmbed],
                                components: [commandsPage, new Discord.MessageActionRow({
                                    components: [main],
                                })]
                            }).catch(() => { });
                        }
                        //@ts-ignore
                        if (interaction.values[0] == 'HELP_SUPPORT') {
                            msg.edit({
                                embeds: [supportEmbed],
                                components: [new Discord.MessageActionRow({
                                    components: [Buttons.BugReport, Buttons.Invite, Buttons.Server, Buttons.Dashboard, Buttons.Premium]
                                }), new Discord.MessageActionRow({
                                    components: [main]
                                })]
                            }).catch(() => { });
                        }
                        //@ts-ignore
                        let section = commandList.find(section => section.id.toString() == interaction.values[0]);
                        if (section) {
                            //@ts-ignore
                            const commandsList = section.commands.map(command => `\`${prefix + command.aliases[0]}\` - ${command.description.toLowerCase()}.`);

                            msg.edit({
                                components: [
                                    commandsPage,
                                    new Discord.MessageActionRow({
                                        components: [main],
                                    })
                                ],
                                embeds: [new Discord.MessageEmbed({
                                    title: `${section.name} \`${section.commands.length}\``,
                                    description: `${section.description}\n\n${commandsList.join('\n')}`,
                                    color: Color.LIGHT_PURPLE
                                })]
                            }).catch(() => { });
                        }
                    }
                    if (interaction.componentType == 'BUTTON') {
                        if (interaction.customId == 'MAIN') {
                            msg.edit({
                                embeds: [helpEmbed],
                                components: [mainPage]
                            }).catch(() => { });
                        }
                        // if (interaction.customId == 'Bug') {
                        //     Module.reportBug(message);
                        // }
                    }
                    interaction.deferUpdate().catch(() => { });
                });
                //#endregion
            });
            return;
            //#endregion
        } else if (cmd) cmd.sendUsage(message.channel, prefix, message);
        //#endregion
    }

    // Handles Slash Command
    public slash(interaction: Discord.CommandInteraction<Discord.CacheType>, options?: Discord.CommandInteractionOption<Discord.CacheType>[]): void {
        //#region Main
        let arg = options.find(a => a.name == 'command')?.value.toString();
        const cmd = commandBaseList.find(a => a.name.toLowerCase() == arg?.toLowerCase());
        if (!arg && !cmd) {
            //#region Message
            interaction.reply({
                embeds: [helpEmbed],
                components: [mainPage],
                ephemeral: true
            }).then(async (msg) => {
                //#region Interaction
                const filter = (filter: { user: { id: string; }; }) => filter.user.id == interaction.user.id;
                const collector = await interaction.channel.createMessageComponentCollector({
                    filter
                });

                collector.on('collect', (inter) => {
                    if (inter.componentType == 'SELECT_MENU') {
                        //@ts-ignore
                        if (inter.values[0] == 'HELP_INFO') {
                            interaction.editReply({
                                embeds: [infoEmbed],
                                components: [new Discord.MessageActionRow({
                                    components: [main, Buttons.Invite, Buttons.Server, Buttons.Premium]
                                })]
                            }).catch(() => { });
                        }
                        //@ts-ignore
                        if (inter.values[0] == 'HELP_COMMANDS') {
                            interaction.editReply({
                                embeds: [commandOptionEmbed],
                                components: [commandsPage, new Discord.MessageActionRow({
                                    components: [main],
                                })]
                            }).catch(() => { });
                        }
                        //@ts-ignore
                        if (inter.values[0] == 'HELP_SUPPORT') {
                            interaction.editReply({
                                embeds: [supportEmbed],
                                components: [new Discord.MessageActionRow({
                                    components: [Buttons.BugReport, Buttons.Invite, Buttons.Server, Buttons.Dashboard, Buttons.Premium]
                                }), new Discord.MessageActionRow({
                                    components: [main]
                                })]
                            }).catch(() => { });
                        }
                        //@ts-ignore
                        let section = commandList.find(section => section.id.toString() == inter.values[0]);
                        if (section) {
                            //@ts-ignore
                            const commandsList = section.commands.map(command => `\`t!${command.aliases[0]}\` - ${command.description.toLowerCase()}`);

                            interaction.editReply({
                                components: [
                                    commandsPage,
                                    new Discord.MessageActionRow({
                                        components: [main],
                                    })
                                ],
                                embeds: [new Discord.MessageEmbed({
                                    title: `${section.name} \`${section.commands.length}\``,
                                    description: `${section.description}\n\n${commandsList.join('\n')}`,
                                    color: Color.LIGHT_PURPLE
                                })]
                            }).catch(() => { });
                        }
                    }
                    if (inter.componentType == 'BUTTON') {
                        if (inter.customId == 'MAIN') {
                            interaction.editReply({
                                embeds: [helpEmbed],
                                components: [mainPage]
                            }).catch(() => { });
                        }
                        // if (interaction.customId == 'Bug') {
                        //     Module.reportBug(message);
                        // }
                    }
                    inter.deferUpdate().catch(() => { });
                });
                //#endregion
            });
            return;
            //#endregion
        } else if (cmd) cmd.sendUsage(interaction.channel, 't!', interaction);
        //#endregion
    }
});
//#endregion