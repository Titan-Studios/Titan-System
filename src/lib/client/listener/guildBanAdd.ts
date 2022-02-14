import * as Discord from 'discord.js';
import { Color } from '../../utility';
import { SERVERS } from '../../data';

export const OnGuildBanAdd = (client: Discord.Client) => client.on('guildBanAdd', (log) => {
    if (log.guild.id != SERVERS.MAIN.ID) return;
    const channel = log.guild.channels.cache.find(channel => channel.id == SERVERS.MAIN.CHANNELS.MAIN_CHAT.ID);
    if (channel.isText()) channel.send({
        embeds: [new Discord.MessageEmbed({ description: `${log.user.tag} Was Banned\nCreated <t:${(log.user.createdTimestamp / 1000).toFixed()}:R>${log.guild.members.cache.get(log.user.id)?.joinedTimestamp ? ' - Joined <t:' + (log.guild.members.cache.get(log.user.id)?.joinedTimestamp / 1000).toFixed() + ':R>' : ''}`, color: Color.RED })]
    }).catch(() => { });
});