import * as Discord from 'discord.js';
import * as Data from '../data';
import { client } from '../client';

export const DiscordButton = (label: string, customId?: string, style: Discord.MessageButtonStyle = 'PRIMARY', url?: string | undefined, emoji?: Discord.EmojiIdentifierResolvable | undefined, disabled: boolean = false): Discord.MessageButton => {

    let a = new Discord.MessageButton();

    if (label) a.setLabel(label);
    if (customId) a.setCustomId(customId);
    if (style) a.setStyle(style);
    if (emoji) a.setEmoji(emoji);
    if (url) a.setURL(url);
    if (disabled) a.setDisabled(disabled);

    return a;
}

export const ButtonList = {
    Invite: DiscordButton('Invite', null, 'LINK', Data.INFO.links.invite.replace('{id}', '745849628825747458')),
    Dashboard: DiscordButton('Dashboard', null, 'LINK', Data.INFO.links.dashboard, null, true),
    Server: DiscordButton('Server', null, 'LINK', Data.INFO.links.server),
    Premium: DiscordButton('Premium', null, 'LINK', Data.INFO.links.premium),
    Topgg: DiscordButton('Top.gg', null, 'LINK', Data.INFO.links.topgg.replace('{id}', '745849628825747458')),
    BugReport: DiscordButton('Report Bug', 'BUG_REPORT', 'DANGER'),
    DeleteMessage: DiscordButton('Delete', 'DeleteMessage', 'DANGER')
}