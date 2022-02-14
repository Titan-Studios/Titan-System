import * as Discord from 'discord.js';
import { SERVERS, ENV, INFO } from '../../data';
import { client } from '..';
import { handleSlashCommand } from '../../manager/manager';
import { Color, DiscordButton, Utils } from '../../utility';
import { get as Database } from '../database';
import { padLeadingZeros } from '../../utility/utils';
import { Profile } from '../../manager/constructor';

let role_interactions = new Map();

export const OnInteractionCreate = (client: Discord.Client) => client.on('interactionCreate', (interaction) => {
    if (interaction.isCommand()) handleSlashCommand(interaction);
    if (interaction.isButton()) {
        let IDData = interaction.customId.split('-');
        if (interaction.customId == 'SEND_VERIFY_MEMBER') SendVerifyMember(interaction);
        if (interaction.customId == 'ACCEPT_MEMBER' || 'DENY_MEMBER') MemberApplication(interaction, interaction.customId);
        if (interaction.customId == 'ACCEPT_STAFF' || 'DENY_STAFF') StaffApplication(interaction, interaction.customId);
        if (interaction.customId == 'NEW_SUPPORT_TICKET' || 'JOIN_SUPPORT_TICKET' || 'CLOSE_SUPPORT_TICKET' || 'NEW_SUPPORT_TICKET_MEMBER' || 'NEW_SUPPORT_TICKET_SERVER' || 'NEW_SUPPORT_TICKET_TITANBOT' || 'NEW_SUPPORT_TICKET_OTHER') NewSupportTicket(interaction, interaction.customId);
        if (interaction.customId == 'ROLE_SELECT') SelectedRoleCategory(interaction, interaction.customId, 'NEW_CATEGORY');
        if (interaction.customId == 'PREMIUM_SELECT') SelectPremium(interaction, interaction.customId);
        if (interaction.customId.startsWith('ROLE_SELECTED')) SelectedRole(interaction, interaction.customId, { user: interaction.user, type: IDData[1], category: IDData[2], roleID: IDData[3], interactionID: IDData[4] });
    }
    if (interaction.isSelectMenu()) {
        let IDData = interaction.customId.split('-');
        if (interaction.customId.startsWith('ROLE_CATEGORY_SELECT')) SelectedRoleCategory(interaction, interaction.customId, 'NEW', IDData[1]);
    }
});


//#region Verifications
function SendVerifyMember(interaction: Discord.ButtonInteraction<Discord.CacheType>) {
    const member = client.guilds.cache.get(SERVERS.MAIN.ID).members.cache.get(interaction.user.id);
    const verified = member.roles.cache.get(SERVERS.MAIN.ROLES.VERIFIED_MEMBER.ID);
    const applicationChannel = client.channels.cache.find(a => a.id == SERVERS.STAFF.CHANNELS.APPLICATIONS.ID);

    if (verified) {
        interaction.reply({
            ephemeral: true, embeds: [new Discord.MessageEmbed({
                description: 'Beans you\'re already verified',
                color: Color.BLURPLE
            })]
        });
        return;
    } else {
        const IDs: string[] = Utils.randomIntList(100000, 999999, 3).map(a => a.toString());
        const questions: string[] = ['Hello, Where did you join the server from?', 'Why did you join the server?', 'Have you been kick/ban from a server, If yes why?', 'Are you a furry?', 'Tell us alittle about yourself and your fursona if you have one.', 'Do you know DSTitan?'];
        const questionsEmbed: string[] = ['Joined From:', 'Reason For Joining:', 'Kick/Ban History:', 'A Furry:', 'User Bio:', 'Knows Titan:'];
        const answers: string[] = [];

        let collectCount = 0;

        if (interaction.user.bot) return;

        const filter = (m: { author: { id: Snowflake; }; }) => m.author.id == interaction.user.id;
        interaction.user.send({
            embeds: [new Discord.MessageEmbed({
                description: '*Please make sure your answers to every question is detailed & clear or we might not verify you.*\n*You have `2mins` to answer each question.*',
                color: Color.BLURPLE
            })],
            components: [new Discord.MessageActionRow({ components: [new Discord.MessageButton({ label: 'Continue', customId: IDs[0], style: 'PRIMARY' })] })]
        }).then((e) => {
            interaction.reply({ ephemeral: true, content: 'ㅤ', components: [new Discord.MessageActionRow({ components: [DiscordButton('Go to DMs', null, 'LINK', e.url)] })] });
            client.on('interactionCreate', (inter) => {
                if (!inter.isButton()) return;

                if (inter.customId == IDs[0]) {
                    inter.deferUpdate().catch(() => { });

                    e.edit({
                        embeds: [new Discord.MessageEmbed({
                            description: questions[collectCount++],
                            color: Color.BLURPLE
                        })],
                        components: []
                    }).then((start) => {

                        const collector = start.channel.createMessageCollector({
                            filter,
                            time: 120000
                        });

                        collector.on('collect', (collected) => {
                            if (collected.author.bot) return;
                            if (['stop', 'cancel'].includes(collected.content.toLowerCase())) return collector.stop('Cancel');
                            if (collectCount < 7) {
                                collector.resetTimer();
                                answers.push(collected.content);
                                collected.reply({
                                    allowedMentions: { repliedUser: false },
                                    embeds: [new Discord.MessageEmbed({
                                        description: questions[collectCount++],
                                        color: Color.BLURPLE
                                    })]
                                }).catch(() => { });
                            }
                            if (answers.length == 6) {
                                collector.stop('Complete');
                            }
                        });
                        collector.on('end', (collected, reason) => {
                            if (reason == 'Complete') {
                                let i = 0;
                                collected.last().reply({
                                    allowedMentions: { repliedUser: false },
                                    embeds: [new Discord.MessageEmbed({
                                        title: 'Your Member Application',
                                        fields: answers.map((msg) => { return { name: questionsEmbed[i++], value: msg } }),
                                        color: Color.BLURPLE
                                    })],
                                    components: [new Discord.MessageActionRow({ components: [DiscordButton('Send', IDs[1], 'SUCCESS'), DiscordButton('Cancel', IDs[2], 'DANGER')] })]
                                }).catch(() => { });
                            } else if (reason == 'Cancel') {
                                collected.last().reply({
                                    allowedMentions: { repliedUser: false },
                                    embeds: [new Discord.MessageEmbed({
                                        description: 'Okie Cancelled!',
                                        color: Color.BLURPLE
                                    })]
                                }).catch(() => { });
                            } else {
                                collected.last().reply({
                                    allowedMentions: { repliedUser: false },
                                    embeds: [new Discord.MessageEmbed({
                                        description: 'Your time ran out please try again',
                                        color: Color.BLURPLE
                                    })]
                                }).catch(() => { });
                            }
                        })
                    }).catch(() => { });
                }
                if (inter.customId == IDs[1]) {
                    inter.deferUpdate().catch(() => { });

                    let i = 0;
                    if (applicationChannel.isText()) applicationChannel.send({
                        embeds: [new Discord.MessageEmbed({
                            title: 'Member Application',
                            description: `${interaction.user.tag}`,
                            thumbnail: { url: interaction.user.displayAvatarURL({ dynamic: true }) },
                            fields: answers.map((msg) => { return { name: questionsEmbed[i++], value: msg } }),
                            footer: { text: `ID: ${interaction.user.id}` },
                            color: Color.BLURPLE
                        })],
                        components: [new Discord.MessageActionRow({ components: [DiscordButton('Verify', 'ACCEPT_MEMBER', 'SUCCESS'), DiscordButton('Deny', 'DENY_MEMBER', 'DANGER')] })]
                    }).catch(() => { });
                    //@ts-ignore
                    inter.message.edit({ components: [new Discord.MessageActionRow({ components: [DiscordButton('Sent', '0', 'SECONDARY', null, null, true)] })] }).catch(() => { });
                }
                if (inter.customId == IDs[2]) {
                    interaction.deferUpdate().catch(() => { });

                    //@ts-ignore
                    inter.message.edit({ components: [new Discord.MessageActionRow({ components: [DiscordButton('Cancelled', '0', 'SECONDARY', null, null, true)] })] }).catch(() => { });
                }
            });
        }).catch(() => { });
    }
}

function MemberApplication(interaction: Discord.ButtonInteraction<Discord.CacheType>, id: Snowflake) {
    const IDs: string[] = Utils.randomIntList(100000, 999999, 2).map(a => a.toString());
    const message = interaction?.message;
    const embed = message?.embeds[0];

    if (id == 'ACCEPT_MEMBER') {
        interaction.deferUpdate().catch(() => { });
        const member = client.guilds.cache.get(SERVERS.MAIN.ID).members.cache.get(embed?.footer?.text?.split(' ')[1]);
        //@ts-ignore
        if (!member) return message.edit({ embeds: [embed.setColor(Color.LIGHT_PURPLE)], components: [new Discord.MessageActionRow({ components: [DiscordButton('Member', IDs[0], 'SECONDARY', null, null, true), DiscordButton(`Invalid`, IDs[1], 'SECONDARY', null, null, true)] })] }).catch(() => { });
        member.roles.add(SERVERS.MAIN.ROLES.VERIFIED_MEMBER.ID).catch(() => { });
        //@ts-ignore
        message.edit({ embeds: [embed.setColor(Color.TITAN_GREEN)], components: [new Discord.MessageActionRow({ components: [DiscordButton('Verified', IDs[0], 'SECONDARY', null, null, true), DiscordButton(`By ${interaction.user.tag}`, IDs[1], 'SECONDARY', null, null, true)] })] }).catch(() => { });
        member.send({ embeds: [new Discord.MessageEmbed({ description: 'You have been verified bean! Welcome to Titan Studios!', color: Color.BLURPLE })], components: [new Discord.MessageActionRow({ components: [DiscordButton('Chat', null, 'LINK', `https://discord.com/channels/${SERVERS.MAIN.ID}/${SERVERS.MAIN.CHANNELS.MAIN_CHAT.ID}`), DiscordButton('Get Roles', null, 'LINK', `https://discord.com/channels/${SERVERS.MAIN.ID}/${SERVERS.MAIN.CHANNELS.ROLES.ID}`)] })] }).catch(() => { });
    }
    if (id == 'DENY_MEMBER') {
        interaction.deferUpdate().catch(() => { });
        //@ts-ignore
        message.edit({ embeds: [embed.setColor(Color.RED)], components: [new Discord.MessageActionRow({ components: [DiscordButton('Denied', IDs[0], 'SECONDARY', null, null, true), DiscordButton(`By ${interaction.user.tag}`, IDs[1], 'SECONDARY', null, null, true)] })] }).catch(() => { });
    }
}

function StaffApplication(interaction: Discord.ButtonInteraction<Discord.CacheType>, id: Snowflake) {
    const IDs: string[] = Utils.randomIntList(100000, 999999, 2).map(a => a.toString());
    const message = interaction?.message;
    const embed = message?.embeds[0];

    if (id == 'ACCEPT_STAFF') {
        interaction.deferUpdate().catch(() => { });
        const member = client.guilds.cache.get(SERVERS.MAIN.ID).members.cache.get(embed?.footer?.text?.split(' ')[1]);
        //@ts-ignore
        if (!member) return message.edit({ embeds: [embed.setColor(Color.LIGHT_PURPLE)], components: [new Discord.MessageActionRow({ components: [DiscordButton('Member', IDs[0], 'SECONDARY', null, null, true), DiscordButton(`Invalid`, IDs[1], 'SECONDARY', null, null, true)] })] }).catch(() => { });
        member.roles.add(SERVERS.MAIN.ROLES.TRIAL_MOD.ID).catch(() => { });
        //@ts-ignore
        message.edit({ embeds: [embed.setColor(Color.TITAN_GREEN)], components: [new Discord.MessageActionRow({ components: [DiscordButton('Accepted', IDs[0], 'SECONDARY', null, null, true), DiscordButton(`By ${interaction.user.tag}`, IDs[1], 'SECONDARY', null, null, true)] })] }).catch(() => { });
    }
    if (id == 'DENY_STAFF') {
        interaction.deferUpdate().catch(() => { });
        //@ts-ignore
        message.edit({ embeds: [embed.setColor(Color.RED)], components: [new Discord.MessageActionRow({ components: [DiscordButton('Denied', IDs[0], 'SECONDARY', null, null, true), DiscordButton(`By ${interaction.user.tag}`, IDs[1], 'SECONDARY', null, null, true)] })] }).catch(() => { });
    }
}
//#endregion

//#region Support Ticket
function NewSupportTicket(interaction: Discord.ButtonInteraction<Discord.CacheType>, id: Snowflake) {
    if (id == 'NEW_SUPPORT_TICKET') {
        interaction.reply({
            ephemeral: true,
            embeds: [new Discord.MessageEmbed({ description: 'What do you need help with, or need to report?', color: Color.BLURPLE })],
            components: [new Discord.MessageActionRow({
                components: [
                    DiscordButton('A Member', 'NEW_SUPPORT_TICKET_MEMBER', 'SECONDARY'),
                    DiscordButton('The Server', 'NEW_SUPPORT_TICKET_SERVER', 'SECONDARY'),
                    DiscordButton('Titan-Bot', 'NEW_SUPPORT_TICKET_TITANBOT', 'SECONDARY'),
                    DiscordButton('Other', 'NEW_SUPPORT_TICKET_OTHER', 'SECONDARY'),
                ]
            })]
        });
        return;
    }
    else if (id == 'JOIN_SUPPORT_TICKET') {
        interaction.deferUpdate().catch(() => { });
        const message = interaction?.message;
        const embed = message?.embeds[0];
        const channel = client.guilds.cache.get(SERVERS.MAIN.ID).channels.cache.get(embed?.description?.split('`').filter(arg => /^(?:\d{18})$/.test(arg))[1]);
        if (channel.isThread()) channel.members.add(interaction.user);
    }
    else if (id == 'CLOSE_SUPPORT_TICKET') {
        interaction.deferUpdate().catch(() => { });
        const message = interaction?.message;
        const embed = message?.embeds[0];
        const channel = client.guilds.cache.get(SERVERS.MAIN.ID).channels.cache.get(embed?.description?.split('`').filter(arg => /^(?:\d{18})$/.test(arg))[1]);
        if (channel.isThread()) channel.delete('Ticket Closed');
        //@ts-ignore
        message.edit({ components: [new Discord.MessageActionRow({ components: [DiscordButton('Join', 'JOIN_SUPPORT_TICKET', 'SECONDARY', null, null, true), DiscordButton('Closed', 'CLOSE_SUPPORT_TICKET', 'SECONDARY', null, null, true)] })] })
    }
    else if (id == 'NEW_SUPPORT_TICKET_MEMBER') {
        interaction.deferUpdate().catch(() => { });
        Database('client', 'client').findOne({ _id: ENV.CLIENT.ID as any }).then((db) => {
            if (interaction.channel.type == 'GUILD_TEXT') {
                let ticketNum = padLeadingZeros(db.totalTickets + 1, 4);
                interaction.channel.threads.create({ name: `Ticket-${ticketNum}`, type: 'GUILD_PRIVATE_THREAD', invitable: false }).then((threadChannel) => {
                    Database('client', 'client').updateOne({ _id: ENV.CLIENT.ID as any }, { $inc: { totalTickets: 1 } }).then(() => {
                        //@ts-ignore
                        threadChannel.members.add(interaction.user).then((user) => threadChannel.send({ content: `Sit tight ${interaction.user.username}, A staff member will be with you as soon as they can!` }).then((msg) => interaction.editReply({ components: [new Discord.MessageActionRow({ components: [DiscordButton('Veiw Discussion', null, 'LINK', msg.url)] })] })));
                        client.channels.fetch(SERVERS.STAFF.CHANNELS.TICKETS.ID).then((ticketChannel) => {
                            if (ticketChannel.isText()) {
                                ticketChannel.send({
                                    embeds: [new Discord.MessageEmbed({
                                        title: `Ticket Created - ${ticketNum}`,
                                        description: `\`Ticket by:\` <@${interaction.user.id}> \`${interaction.user.id}\`\n\n\`Ticket type:\` \`Member Ticket\`\n\n\`Requested:\` <t:${(Date.now() / 1000).toFixed()}:R>\n\n\`ID:\` \`${threadChannel.id}\` \`Ticket-${ticketNum}\``,
                                        color: Color.BLURPLE
                                    })], components: [new Discord.MessageActionRow({ components: [DiscordButton('Join', 'JOIN_SUPPORT_TICKET'), DiscordButton('Close', 'CLOSE_SUPPORT_TICKET')] })]
                                });
                            }
                        });
                    });
                });
            }
        });
    }
    else if (id == 'NEW_SUPPORT_TICKET_SERVER') {
        interaction.deferUpdate().catch(() => { });
        Database('client', 'client').findOne({ _id: ENV.CLIENT.ID as any }).then((db) => {
            if (interaction.channel.type == 'GUILD_TEXT') {
                let ticketNum = padLeadingZeros(db.totalTickets + 1, 4);
                interaction.channel.threads.create({ name: `Ticket-${ticketNum}`, type: 'GUILD_PRIVATE_THREAD', invitable: false }).then((threadChannel) => {
                    Database('client', 'client').updateOne({ _id: ENV.CLIENT.ID as any }, { $inc: { totalTickets: 1 } }).then(() => {
                        //@ts-ignore
                        threadChannel.members.add(interaction.user).then((user) => threadChannel.send({ content: `Sit tight ${interaction.user.username}, A staff member will be with you as soon as they can!` }).then((msg) => interaction.editReply({ components: [new Discord.MessageActionRow({ components: [DiscordButton('Veiw Discussion', null, 'LINK', msg.url)] })] })));
                        client.channels.fetch(SERVERS.STAFF.CHANNELS.TICKETS.ID).then((ticketChannel) => {
                            if (ticketChannel.isText()) {
                                ticketChannel.send({
                                    embeds: [new Discord.MessageEmbed({
                                        title: `Ticket Created - ${ticketNum}`,
                                        description: `\`Ticket by:\` <@${interaction.user.id}> \`${interaction.user.id}\`\n\n\`Ticket type:\` \`Server Ticket\`\n\n\`Requested:\` <t:${(Date.now() / 1000).toFixed()}:R>\n\n\`ID:\` \`${threadChannel.id}\` \`Ticket-${ticketNum}\``,
                                        color: Color.BLURPLE
                                    })], components: [new Discord.MessageActionRow({ components: [DiscordButton('Join', 'JOIN_SUPPORT_TICKET'), DiscordButton('Close', 'CLOSE_SUPPORT_TICKET')] })]
                                });
                            }
                        });
                    });
                });
            }
        });
    }
    else if (id == 'NEW_SUPPORT_TICKET_TITANBOT') {
        interaction.deferUpdate().catch(() => { });
        Database('client', 'client').findOne({ _id: ENV.CLIENT.ID as any }).then((db) => {
            if (interaction.channel.type == 'GUILD_TEXT') {
                let ticketNum = padLeadingZeros(db.totalTickets + 1, 4);
                interaction.channel.threads.create({ name: `Ticket-${ticketNum}`, type: 'GUILD_PRIVATE_THREAD', invitable: false }).then((threadChannel) => {
                    Database('client', 'client').updateOne({ _id: ENV.CLIENT.ID as any }, { $inc: { totalTickets: 1 } }).then(() => {
                        //@ts-ignore
                        threadChannel.members.add(interaction.user).then((user) => threadChannel.send({ content: `Sit tight ${interaction.user.username}, A staff member will be with you as soon as they can!` }).then((msg) => interaction.editReply({ components: [new Discord.MessageActionRow({ components: [DiscordButton('Veiw Discussion', null, 'LINK', msg.url)] })] })));
                        client.channels.fetch(SERVERS.STAFF.CHANNELS.TICKETS.ID).then((ticketChannel) => {
                            if (ticketChannel.isText()) {
                                ticketChannel.send({
                                    embeds: [new Discord.MessageEmbed({
                                        title: `Ticket Created - ${ticketNum}`,
                                        description: `\`Ticket by:\` <@${interaction.user.id}> \`${interaction.user.id}\`\n\n\`Ticket type:\` \`TitanBot Ticket\`\n\n\`Requested:\` <t:${(Date.now() / 1000).toFixed()}:R>\n\n\`ID:\` \`${threadChannel.id}\` \`Ticket-${ticketNum}\``,
                                        color: Color.BLURPLE
                                    })], components: [new Discord.MessageActionRow({ components: [DiscordButton('Join', 'JOIN_SUPPORT_TICKET'), DiscordButton('Close', 'CLOSE_SUPPORT_TICKET')] })]
                                });
                            }
                        });
                    });
                });
            }
        });
    }
    else if (id == 'NEW_SUPPORT_TICKET_OTHER') {
        interaction.deferUpdate().catch(() => { });
        Database('client', 'client').findOne({ _id: ENV.CLIENT.ID as any }).then((db) => {
            if (interaction.channel.type == 'GUILD_TEXT') {
                let ticketNum = padLeadingZeros(db.totalTickets + 1, 4);
                interaction.channel.threads.create({ name: `Ticket-${ticketNum}`, type: 'GUILD_PRIVATE_THREAD', invitable: false }).then((threadChannel) => {
                    Database('client', 'client').updateOne({ _id: ENV.CLIENT.ID as any }, { $inc: { totalTickets: 1 } }).then(() => {
                        //@ts-ignore
                        threadChannel.members.add(interaction.user).then((user) => threadChannel.send({ content: `Sit tight ${interaction.user.username}, A staff member will be with you as soon as they can!` }).then((msg) => interaction.editReply({ components: [new Discord.MessageActionRow({ components: [DiscordButton('Veiw Discussion', null, 'LINK', msg.url)] })] })));
                        client.channels.fetch(SERVERS.STAFF.CHANNELS.TICKETS.ID).then((ticketChannel) => {
                            if (ticketChannel.isText()) {
                                ticketChannel.send({
                                    embeds: [new Discord.MessageEmbed({
                                        title: `Ticket Created - ${ticketNum}`,
                                        description: `\`Ticket by:\` <@${interaction.user.id}> \`${interaction.user.id}\`\n\n\`Ticket type:\` \`Other Ticket\`\n\n\`Requested:\` <t:${(Date.now() / 1000).toFixed()}:R>\n\n\`ID:\` \`${threadChannel.id}\` \`Ticket-${ticketNum}\``,
                                        color: Color.BLURPLE
                                    })], components: [new Discord.MessageActionRow({ components: [DiscordButton('Join', 'JOIN_SUPPORT_TICKET'), DiscordButton('Close', 'CLOSE_SUPPORT_TICKET')] })]
                                });
                            }
                        });
                    });
                });
            }
        });
    }
}
//#endregion

//#region Role Select
function SelectedRole(interaction: Discord.ButtonInteraction<Discord.CacheType>, id: Snowflake, data: { user: Discord.User, type: string; category: string; roleID: Snowflake; interactionID: Snowflake; }) {
    interaction.deferUpdate().catch(() => { });
    if (data.type == 'PREMIUM_false') return;
    client.guilds.fetch(SERVERS.MAIN.ID).then(a => a.members.fetch(interaction.user.id).then((member) => {
        if (member.roles.cache.has(data.roleID)) { member.roles.remove(data.roleID).then(() => SelectedRoleCategory(interaction, id, data.category, data.interactionID)) } else { member.roles.add(data.roleID).then(() => SelectedRoleCategory(interaction, id, data.category, data.interactionID)) }
    })).catch(() => { });
}
function SelectedRoleCategory(interaction: any, id: Snowflake, type: string, interactionID?: Snowflake) {
    try {
        client.guilds.fetch(SERVERS.MAIN.ID).then(a => a.members.fetch(interaction.user.id).then((member) => {
            let profile = new Profile(member.id);
            profile.set().then(() => profile.isPremium().then((isPremium) => {
                let footer = { text: 'Gray Button - You dont have the role | Green Button - You have the role' };
                let categories: any = {
                    NOTIFICATIONS: {
                        title: 'Notifications',
                        description: '',
                        premium: false,
                        buttons: [
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Announcements', `ROLE_SELECTED-NORMAL-NOTIFICATIONS-${SERVERS.MAIN.ROLES.NOTIFICATIONS.ANNOUNCEMENT}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.NOTIFICATIONS.ANNOUNCEMENT) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Updates', `ROLE_SELECTED-NORMAL-NOTIFICATIONS-${SERVERS.MAIN.ROLES.NOTIFICATIONS.UPDATE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.NOTIFICATIONS.UPDATE) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Posts & Streams', `ROLE_SELECTED-NORMAL-NOTIFICATIONS-${SERVERS.MAIN.ROLES.NOTIFICATIONS.POSTS}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.NOTIFICATIONS.POSTS) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Events', `ROLE_SELECTED-NORMAL-NOTIFICATIONS-${SERVERS.MAIN.ROLES.NOTIFICATIONS.EVENT}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.NOTIFICATIONS.EVENT) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Giveaways', `ROLE_SELECTED-NORMAL-NOTIFICATIONS-${SERVERS.MAIN.ROLES.NOTIFICATIONS.GIVEAWAY}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.NOTIFICATIONS.GIVEAWAY) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            })
                        ]
                    },
                    PRONOUNS_AND_SPECIES: {
                        title: 'Pronouns & Species',
                        description: '',
                        premium: false,
                        buttons: [
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('He/Him', `ROLE_SELECTED-NORMAL-PRONOUNS_AND_SPECIES-${SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.HE_HIM}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.HE_HIM) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('She/Her', `ROLE_SELECTED-NORMAL-PRONOUNS_AND_SPECIES-${SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.SHE_HER}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.SHE_HER) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('They/Them', `ROLE_SELECTED-NORMAL-PRONOUNS_AND_SPECIES-${SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.THEY_THEM}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.THEY_THEM) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Any/All', `ROLE_SELECTED-NORMAL-PRONOUNS_AND_SPECIES-${SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.ANY_ALL}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.ANY_ALL) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            }),
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Hooman', `ROLE_SELECTED-NORMAL-PRONOUNS_AND_SPECIES-${SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.HOOMAN}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.HOOMAN) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Pokemon', `ROLE_SELECTED-NORMAL-PRONOUNS_AND_SPECIES-${SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.POKEMON}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.POKEMON) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Furry', `ROLE_SELECTED-NORMAL-PRONOUNS_AND_SPECIES-${SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.FURRY}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.FURRY) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Scalie', `ROLE_SELECTED-NORMAL-PRONOUNS_AND_SPECIES-${SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.SCALIE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PRONOUNS_AND_SPECIES.SCALIE) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            })
                        ]
                    },
                    OCCUPATION: {
                        title: 'Occupation',
                        description: '',
                        premium: false,
                        buttons: [
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Artist', `ROLE_SELECTED-NORMAL-OCCUPATION-${SERVERS.MAIN.ROLES.OCCUPATION.ARTIST}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.OCCUPATION.ARTIST) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Streamer', `ROLE_SELECTED-NORMAL-OCCUPATION-${SERVERS.MAIN.ROLES.OCCUPATION.STREAMER}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.OCCUPATION.STREAMER) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Youtuber', `ROLE_SELECTED-NORMAL-OCCUPATION-${SERVERS.MAIN.ROLES.OCCUPATION.YOUTUBER}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.OCCUPATION.YOUTUBER) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Developer', `ROLE_SELECTED-NORMAL-OCCUPATION-${SERVERS.MAIN.ROLES.OCCUPATION.DEVELOPER}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.OCCUPATION.DEVELOPER) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Gamer', `ROLE_SELECTED-NORMAL-OCCUPATION-${SERVERS.MAIN.ROLES.OCCUPATION.GAMER}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.OCCUPATION.GAMER) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            })
                        ]
                    },
                    COLORS: {
                        title: 'Colors',
                        description: '<@&753662588503719988> <@&753662704622764072> <@&753662810902495403> <@&753662886710345770> <@&753663000220663910> <@&753663064536121455> <@&753663132232319019>\n<@&753663417318899802> <@&753663412344586251> <@&753664783298986025>',
                        premium: false,
                        buttons: [
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Red', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.RED}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.RED) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Green', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.GREEN}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.GREEN) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Blue', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.BLUE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.BLUE) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Yellow', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.YELLOW}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.YELLOW) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Orange', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.ORANGE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.ORANGE) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            }),
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Pink', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.PINK}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.PINK) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Purple', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.PURPLE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.PURPLE) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Shadow', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.SHADOW}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.SHADOW) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Milk', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.MILK}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.MILK) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Blurple', `ROLE_SELECTED-NORMAL-COLORS-${SERVERS.MAIN.ROLES.COLORS.BLURPLE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS.BLURPLE) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            })
                        ]
                    },
                    COLORS_PLUS: {
                        title: 'Colors Plus',
                        description: ' <@&753663188079345766> <@&753663353406226474> <@&753663363678208163> <@&753663396532191324> <@&753663400361328682> <@&753663404887244820> <@&753663408993468477>\n<@&851971391645417482> <@&851972995017736222> <@&851972431135637524> <@&851972593346674709>',
                        premium: true,
                        buttons: [
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Pastal Red', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_RED}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_RED) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Pastal Green', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_GREEN}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_GREEN) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Pastal Blue', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_BLUE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_BLUE) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Pastal Yellow', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_YELLOW}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_YELLOW) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Pastal Orange', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_ORANGE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_ORANGE) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            }),
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Pastal Pink', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_PINK}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_PINK) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Pastal Purple', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_PURPLE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.PASTAL_PURPLE) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Blurple 2.0', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.BLURPLE20}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.BLURPLE20) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            }),
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Titan Fur', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.TITAN_FUR}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.TITAN_FUR) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Titan Green', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.TITAN_GREEN}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.TITAN_GREEN) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Titan Purple', `ROLE_SELECTED-PREMIUM_${isPremium}-COLORS_PLUS-${SERVERS.MAIN.ROLES.COLORS_PLUS.TITAN_PURPLE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.COLORS_PLUS.TITAN_PURPLE) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            })
                        ]
                    },
                    PREMIUM: {
                        title: 'Premium Love',
                        description: '<@&762853490934153238> <@&762854019848208384> <@&762853862511870012> <@&762852859187429386> <@&762854280373469214>\n<@&762857859922395176> <@&762858725685461023> <@&762858868710703134> <@&762858951158267914> <@&762859207296155689> <@&762859405498646588> <@&762859675208646677> <@&762859756741328897> <@&762859844687757342> <@&772704021832138762>\n<@&762855457324138527> <@&762855681346502706> <@&762855926654173214> <@&762856413634363412> <@&762856152622432297>',
                        premium: true,
                        buttons: [
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Candy Cane', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.CANDY_CANE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.CANDY_CANE) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Xeon', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.XEON}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.XEON) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Jett', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.JETT}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.JETT) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Strawberry Milk', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.STRAWBERRY_MILK}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.STRAWBERRY_MILK) ? 'SUCCESS' : 'SECONDARY'),
                                    DiscordButton('Dazzle', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.DAZZLE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.DAZZLE) ? 'SUCCESS' : 'SECONDARY'),
                                ]
                            }),
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Pancake', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.PANCAKE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.PANCAKE) ? 'SUCCESS' : 'SECONDARY', null, '🥞'),
                                    DiscordButton('Waffle', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.WAFFLE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.WAFFLE) ? 'SUCCESS' : 'SECONDARY', null, '🧇'),
                                    DiscordButton('Meat', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.MEAT}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.MEAT) ? 'SUCCESS' : 'SECONDARY', null, '🍖'),
                                    DiscordButton('Pizza', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.PIZZA}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.PIZZA) ? 'SUCCESS' : 'SECONDARY', null, '🍕'),
                                    DiscordButton('Taco', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.TACO}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.TACO) ? 'SUCCESS' : 'SECONDARY', null, '🌮'),
                                ]
                            }),
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Doughnut', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.DOUGHNUT}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.DOUGHNUT) ? 'SUCCESS' : 'SECONDARY', null, '🍩'),
                                    DiscordButton('Cookie', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.COOKIE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.COOKIE) ? 'SUCCESS' : 'SECONDARY', null, '🍪'),
                                    DiscordButton('Cake', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.CAKE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.CAKE) ? 'SUCCESS' : 'SECONDARY', null, '🍰'),
                                    DiscordButton('Icecream', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.ICECREAM}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.ICECREAM) ? 'SUCCESS' : 'SECONDARY', null, '🍦'),
                                    DiscordButton('Give Me Titan!', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.GIVE_ME_TITAN}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.GIVE_ME_TITAN) ? 'SUCCESS' : 'SECONDARY', null, '💘'),
                                ]
                            }),
                            new Discord.MessageActionRow({
                                components: [
                                    DiscordButton('Proud Simp', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.PROUD_SIMP}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.PROUD_SIMP) ? 'SUCCESS' : 'SECONDARY', null, '😋'),
                                    DiscordButton('Love Pets', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.LOVE_PETS}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.LOVE_PETS) ? 'SUCCESS' : 'SECONDARY', null, '😛'),
                                    DiscordButton('Lil Bean', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.LIL_BEAN}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.LIL_BEAN) ? 'SUCCESS' : 'SECONDARY', null, '😝'),
                                    DiscordButton('Not Cute!', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.NOT_CUTE}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.NOT_CUTE) ? 'SUCCESS' : 'SECONDARY', null, '😜'),
                                    DiscordButton('Fwuffy Baby', `ROLE_SELECTED-PREMIUM_${isPremium}-PREMIUM-${SERVERS.MAIN.ROLES.PREMIUM.FWUFFY_BABY}-${interaction.user.id}`, member.roles.cache.has(SERVERS.MAIN.ROLES.PREMIUM.FWUFFY_BABY) ? 'SUCCESS' : 'SECONDARY', null, '🤪'),
                                ]
                            })
                        ]
                    }
                };
                let dropdown = new Discord.MessageSelectMenu({
                    custom_id: `ROLE_CATEGORY_SELECT-${interaction.user.id}`,
                    options: [
                        { default: true, label: 'Select a Role Category', value: 'NONE' },
                        { emoji: '📢', label: 'Notifications', description: 'Customize the pings you get from the server.', value: 'NOTIFICATIONS' },
                        { emoji: '♂️', label: 'Pronouns & Species', description: 'Select your pronouns and species.', value: 'PRONOUNS_AND_SPECIES' },
                        { emoji: '💼', label: 'Occupation', description: 'Select your occupations or hobbies.', value: 'OCCUPATION' },
                        { emoji: '💜', label: 'Colors', description: 'Make your user name stand out with colors.', value: 'COLORS' },
                        { emoji: '🖤', label: isPremium ? 'Colors plus' : 'Colors plus (Requires Premium)', description: 'Yesh even more colors to use.', value: 'COLORS_PLUS' },
                        { emoji: '⭐', label: isPremium ? 'Premium Love' : 'Premium Love (Requires Premium)', description: 'Extra tasty roles for premium members.', value: 'PREMIUM' }
                    ]
                })

                if (type == 'NEW_CATEGORY') {
                    role_interactions.set(interaction.user.id, interaction);
                    client.guilds.fetch(SERVERS.MAIN.ID).then(a => a.members.fetch(interaction.user.id).then((member) => {
                        interaction.reply({
                            ephemeral: true, embeds: [new Discord.MessageEmbed({
                                image: {
                                    url: 'https://cdn.discordapp.com/attachments/845764947928416297/942597584046923787/Button.gif'
                                }, color: Color.BLURPLE
                            })],
                            components: [new Discord.MessageActionRow({ components: [dropdown] })]
                        });
                    }));
                    return;
                }
                else if (type == 'NEW') {
                    interaction.deferUpdate().catch(() => { });
                    if (!isPremium && categories[interaction.values[0]]?.premium == true) {
                        role_interactions.get(interactionID)?.editReply({ embeds: [new Discord.MessageEmbed({ description: 'Sorry you need premium for that category, Boost the server or become a patreon of Titan', color: Color.BLURPLE })], components: [new Discord.MessageActionRow({ components: [DiscordButton('Become Patreon', null, 'LINK', 'https://www.patreon.com/DSTitan')] }), new Discord.MessageActionRow({ components: [dropdown] })] });
                        return;
                    }
                    role_interactions.get(interactionID)?.editReply({ embeds: [new Discord.MessageEmbed({ title: categories[interaction.values[0]]?.title, description: categories[interaction.values[0]]?.description, color: Color.BLURPLE })], components: [...categories[interaction.values[0]]?.buttons, new Discord.MessageActionRow({ components: [dropdown] })] });
                }
                else {
                    interaction.deferUpdate().catch(() => { });
                    role_interactions.get(interactionID)?.editReply({ components: [...categories[type].buttons, new Discord.MessageActionRow({ components: [dropdown] })] });
                }
            }));
        }));
    } catch (e) { interaction.deferUpdate().catch(() => { }) }
}
//#endregion

function SelectPremium(interaction: Discord.ButtonInteraction<Discord.CacheType>, customId: string) {
    let profile = new Profile(interaction.user.id);
    profile.set().then(() => profile.isPremium().then((isPremium) => {
        if (!isPremium) return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed({ description: 'Sorry you need premium for that category, Boost the server or become a patreon of Titan', color: Color.BLURPLE })], components: [new Discord.MessageActionRow({ components: [DiscordButton('Become Patreon', null, 'LINK', 'https://www.patreon.com/DSTitan')] })] });
        interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed({ description: 'Thank you so much for being a premium member and supporting Titan!!', color: Color.BLURPLE })], components: [new Discord.MessageActionRow({ components: [DiscordButton('Premium Server', null, 'LINK', 'https://discord.gg/dzpxASw3CH')] })] });
    }));
}
