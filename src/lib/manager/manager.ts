//#region Dependencies
import * as Discord from 'discord.js';
import * as Component from '../utility';
//#endregion

//#region Handle Message Command
export const handleMessageCommand = (message: Discord.Message) => {
    let prefix: Prefix;

    if (!message.guild) {
        //#region Prefix
        prefix = 't?';

        if (!message.content || !message.content.toLowerCase().startsWith(prefix)) return;
        //#endregion

        //#region Parse the command
        let args = Component.ArgParser(message.content);
        let alias = args.shift().substr(prefix.length).toLowerCase();
        //#endregion

        //#region Run the command
        let handler = Component.commandBaseList.find(handler => handler.settings.aliases.includes(alias));
        if (handler != undefined && handler.type != 'SLASH' && handler.checkPermissions('MESSAGE', message)) {
            message.channel.sendTyping().catch(() => { });
            handler.initialize('UPDATE');
            handler.message(prefix, alias, args, message, message.mentions.users);
        }
        return;
        //#endregion
    } else {
        //#region Prefix
        prefix = 'dev!';

        if (!message.content || !message.content.toLowerCase().startsWith(prefix)) return;
        //#endregion

        //#region Parse the command
        let args = Component.ArgParser(message.content);
        let alias = args.shift().substr(prefix.length).toLowerCase();
        //#endregion

        //#region Run the command
        let handler = Component.commandBaseList.find(handler => handler.settings.aliases.includes(alias));
        if (handler != undefined && handler.type != 'SLASH' && handler.checkPermissions('MESSAGE', message)) {
            message.channel.sendTyping().catch(() => { });
            handler.initialize('UPDATE');
            handler.message(prefix, alias, args, message, message.mentions.users);
        }
        return;
        //#endregion
    }
};
//#endregion

//#region Handle Slash Command
export const handleSlashCommand = (interaction: Discord.CommandInteraction) => {
    let handler = Component.commandBaseList.find(handler => handler.name.toLowerCase() == interaction.commandName.toLowerCase());

    if (handler != undefined && handler.type != 'MESSAGE' && handler.checkPermissions('SLASH', interaction)) {
        handler.initialize('UPDATE');
        handler.slash(interaction, interaction.options.data);
    }
}
//#endregion