import * as Discord from 'discord.js';
import { Color } from '../../utility';
import { SERVERS } from '../../data';
import { Profile } from '../../manager/constructor';

export const OnGuildMemberRemove = (client: Discord.Client) => client.on('guildMemberRemove', (member) => {
    if (member.guild.id == SERVERS.MAIN.ID) {
        const channel = member.guild.channels.cache.find(channel => channel.id == SERVERS.MAIN.CHANNELS.MAIN_CHAT.ID);
        if (channel.isText()) channel.send({ embeds: [new Discord.MessageEmbed({ description: `${member.user} Just Joined\nCreated <t:${(member.user.createdTimestamp / 1000).toFixed()}:R>${member.joinedTimestamp ? ' - Joined <t:' + (member.joinedTimestamp / 1000).toFixed() + ':R>' : ''}`, footer: { text: `ID: ${member.id}` }, color: Color.RED })] }).catch(() => { });
    }
    if (member.guild.id == SERVERS.PREMIUM.ID) {
        if (member.user.bot) return;
        const profile = new Profile(member.id);
        profile.set().then(() => {
            profile.isPremium().then((p) => {
                if (!p) {
                    member.guild.channels.fetch(SERVERS.PREMIUM.CHANNELS.MEMBERS.ID).then((c) => {
                        if (c.isText()) c.send({ content: `Removed - ${member.user.tag} (${member.user.id}) (Not Premium Member) (Joined: <t:${(member.joinedTimestamp / 1000).toFixed()}:R>)` });
                    });
                }
                else {
                    member.guild.channels.fetch(SERVERS.PREMIUM.CHANNELS.MEMBERS.ID).then((c) => {
                        if (c.isText()) c.send({ content: `Left - ${member.user.tag} (${member.user.id}) (Premium Member) (Joined: <t:${(member.joinedTimestamp / 1000).toFixed()}:R>)` });
                    });
                }
            });
        });
    }
});