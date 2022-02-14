//#region Dependencies
import * as Discord from 'discord.js';
import { column } from 'mathjs';
import { client } from '../..';
import * as Constructor from '../../../manager/constructor';
import { Color, DiscordButton } from '../../../utility';
//#endregion

//#region Command
export = new (class extends Constructor.CommandBase {
    constructor() {
        super(0.000, 'BOTH', 'Test', 'For testing', { aliases: ['test'], permissions: [] }, []);
    }

    // Initialization
    public initialize(type: 'AWAKE' | 'UPDATE'): void { }

    // Handles Message Command
    public message(prefix: string, command: string, args: string[], message: Discord.Message<boolean>, mentions?: Discord.Collection<string, Discord.User>, extra?: object): void {
        if (message.author.id != '625487161092866107') return;

        if (args[0] == 'roles') {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    title: 'Hewo!', description: 'Select an option below!',
                    color: Color.BLURPLE
                })],
                components: [new Discord.MessageActionRow({ components: [DiscordButton('Roles', 'ROLE_SELECT'), DiscordButton('Applications', 'APPLICATION_SELECT', 'PRIMARY', null, null, true), DiscordButton('Premium', 'PREMIUM_SELECT'), DiscordButton('Help & Support', null, 'LINK', 'https://discord.com/channels/708843719528284262/941512495384907796')] })]
            });
        }

        if (args[0] == 'terms') {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    title: '__Community Terms__ 📜', description: 'Hoi, Please read our terms Stay Safe! :purple_heart:',
                    fields: [
                        {
                            name: '> Age',
                            value: 'You must be 13+ [**Follow Discord TOS**](https://discord.com/terms), If You\'re Under the Age of 13 Pls Leave.\nㅤ'
                        },
                        {
                            name: '> Kindness',
                            value: 'Harassment is not allowed this includes DMS. Be kind to others, If you have any hurtful opinions please keep them to yourself.\nㅤ'
                        },
                        {
                            name: '> Self-Harm',
                            value: 'No suicidal roleplay, jokes, or chatting. If you are in need of help please contact a [**hotline**](https://www.opencounseling.com/suicide-hotlines).\nㅤ'
                        },
                        {
                            name: '> Self-Promotion',
                            value: 'Self-promotion is not allowed unless permitted by staff under specific circumstances. Unsolicited ads of other discord servers sent through DMs will result in punishment.\nㅤ'
                        },
                        {
                            name: '> Social',
                            value: 'No anti-LGBT, racism or sexism, Do not talk of politics or religion or you will be banned. No conversation about alcohol, addicting substances such as drugs etc, or anything illegal.\nㅤ'
                        },
                        {
                            name: '> Spam',
                            value: 'Do not [**spam**](https://www.dictionary.com/browse/spam) messages in any channel, this includes, pings, emojis and bot commands. For any reason whatsoever or it will result in a punishment, only ping staff if it\'s really important.\nㅤ'
                        },
                        {
                            name: '> Privacy',
                            value: 'Do not share private information or content without consent from the owner or holder, Do not bring DM issues and problems to the server. If we find out that you share these without permission you will be delt with.\nㅤ'
                        },
                        {
                            name: '> Loud Audio',
                            value: 'Shouting into your microphone, playing loud sounds, overall making your audio inaudible will result in a server voice mute. Reoccurring actions will result in a ban.\nㅤ'
                        },
                        {
                            name: '> NSFW',
                            value: '[**NSFW**](https://www.dictionary.com/browse/nsfw)/explicit content is not allowed in any form in the server. This includes your profile picture, username, status, and every form of text and media sent. Hinting, cropping, or attempting to censor does not exclude you from this term.\nㅤ'
                        },
                        {
                            name: '> Drama',
                            value: 'We want our community to be drama-free, Any drama will be eliminated by the staff. No personal attacks or [**witch-hunting**](https://www.dictionary.com/browse/witch-hunt), Do not argue over small things.\nㅤ'
                        },
                        {
                            name: '> Alternate Accounts',
                            value: 'Alternate accounts are not allowed unless permitted by staff, Using of alternate accounts to win a giveaway is not allowed, it will result in a temp/perm ban for unfair advantage.\nㅤ'
                        },
                        {
                            name: '> Bad Words',
                            value: 'Swearing is not allowed. you will be warned, any continuation will result yourself in a timeout.\nㅤ'
                        },
                        {
                            name: '> Staff',
                            value: 'Do not block any staff members to get out of problems nor try to bypass a ban, do not go against any actions carried out by higher staff unless their breaking the terms, you are then allowed to report to the owner or head manager.\nㅤ'
                        }
                    ],
                    footer: { text: 'If you have completely read all the terms, you can press the verify button below. Enjoy your stay!' },
                    color: Color.BLURPLE
                })],
                components: [new Discord.MessageActionRow({ components: [DiscordButton('Verify', 'SEND_VERIFY_MEMBER', 'SECONDARY'), DiscordButton('Need Help', null, 'LINK', 'https://discord.com/channels/708843719528284262/941512495384907796')] })]
            });
        }

        if (args[0] == 'ticket') {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    title: 'Need Help?', description: 'Create a new support ticket and we will get to you as fast as we can!\nClick the button below.',
                    color: Color.BLURPLE
                })],
                components: [new Discord.MessageActionRow({ components: [DiscordButton('New Ticket', 'NEW_SUPPORT_TICKET')] })]
            });
        }
    }

    // Handles Slash Command
    public slash(commandInteraction: Discord.CommandInteraction<Discord.CacheType>, options?: Discord.CommandInteractionOption<Discord.CacheType>[]): void {
    }
});
//#endregion