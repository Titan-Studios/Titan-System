import * as Discord from 'discord.js';
import { Color, DiscordButton } from '../../utility';
import { SERVERS } from '../../data';
import { Profile } from '../../manager/constructor';

export const OnGuildMemberAdd = (client: Discord.Client) => client.on('guildMemberAdd', (member) => {
    if (member.guild.id == SERVERS.MAIN.ID) {
        member.send({
            embeds: [new Discord.MessageEmbed({
                title: 'Welcome!',
                description: 'Hoi, thank you for joining the Titan Studios!\n\nWe hope you have a great time and make new friends! Stream, play games, chill, share your thoughts and have loads of fun!\n\nPlease read our terms before verifying thankie! and hope you enjoy your stay!',
                color: Color.BLURPLE
            })],
            components: [new Discord.MessageActionRow({ components: [DiscordButton('Verify', 'SendVerifyMember', 'PRIMARY'), DiscordButton('Chat', null, 'LINK', `https://discord.com/channels/${SERVERS.MAIN.ID}/${SERVERS.MAIN.CHANNELS.TERMS.ID}`)] })]
        }).catch(() => { });
        const channel = member.guild.channels.cache.find(channel => channel.id == SERVERS.MAIN.CHANNELS.MAIN_CHAT.ID);
        if (channel.isText()) channel.send({ embeds: [new Discord.MessageEmbed({ description: `${member.user} Just Joined\nCreated: <t:${(member.user.createdTimestamp / 1000).toFixed()}:R>`, footer: { text: `ID: ${member.id}` }, color: Color.BLURPLE })] }).catch(() => { });

        [SERVERS.MAIN.ROLES.NEW_MEMBER.ID, ...SERVERS.MAIN.ROLES.CATEGORIES.IDS].forEach(a => member.roles.add(a).catch(() => { }));
        setTimeout(() => { member.roles.add(SERVERS.MAIN.ROLES.TITAN_FAN.ID).catch(() => { }); }, 15 * 60 * 1000);
    }
    if (member.guild.id == SERVERS.PREMIUM.ID) {
        if (member.user.bot) return;
        const profile = new Profile(member.id);
        profile.set().then(() => {
            profile.isPremium().then((p) => {
                if (!p) {
                    member.kick('Must have a premium role in Titan Studios');
                    member.guild.channels.fetch(SERVERS.PREMIUM.CHANNELS.MEMBERS).then((c) => {
                        if (c.isText()) c.send({ content: `Joined + Removed - ${member.user.tag} (${member.user.id}) (Not Premium Member) (Created: <t:${(member.user.createdTimestamp / 1000).toFixed()}:R>)` });
                    });
                }
                else {
                    member.guild.channels.fetch(SERVERS.PREMIUM.CHANNELS.MEMBERS).then((c) => {
                        if (c.isText()) c.send({ content: `Joined - ${member.user.tag} (${member.user.id}) (Premium Member) (Created: <t:${(member.user.createdTimestamp / 1000).toFixed()}:R>)` });
                    });
                }
            });
        });
    }
});