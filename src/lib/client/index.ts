//#region Dependencies
import * as Data from '../data';
import * as Discord from 'discord.js';
import * as Database from './database';
import * as Listener from './listener';
import * as Utility from '../utility';
import { Profile } from '../manager/constructor';
//#endregion


//#region Client Connect
export const client = new Discord.Client(Data.CLIENT as Discord.ClientOptions);
export const getClient = () => client;

export const connect = () => {
    Database.connect().then(() => {
        client.login(Data.ENV.CLIENT.TOKEN).catch((error) => console.log(`[Client] Connected :: ${error}`));
    }).catch(() => { });
}
//#endregion


//#region Client Connected
client.on('ready', () => {
    console.log(`[Client] Connected :: (${client.user.username})-(${client.user.id})`);

    // Initialize Commands
    initializeCommands();

    // Listeners
    Listener.OnInteractionCreate(client);
    Listener.OnMessageCreate(client);
    Listener.OnMessageDelete(client);
    Listener.OnGuildMemberAdd(client);
    Listener.OnGuildMemberRemove(client);
    Listener.OnGuildBanAdd(client);
});
//#endregion

//#region Initialize Commands
export const initializeCommands = () => {
    let commands = client.guilds.cache.get('762354992757604373')?.commands;
    for (const command of Utility.commandBaseList) {
        if (command != undefined) command.initialize('AWAKE');
        if (command != undefined && command.type != 'MESSAGE') commands?.create({ name: command.name.toLowerCase(), description: command.description + '.', options: command.settings.options || [] });
    };
}
//#endregion

//#region Hourly Updates
setTimeout(() => {
    client.guilds.fetch(Data.SERVERS.PREMIUM.ID).then((g) => {
        g.members.cache.map((m) => {
            if (m.user.bot) return;
            const profile = new Profile(m.id);
            profile.set().then(() => {
                profile.isPremium().then((p) => {
                    if (!p) {
                        m.kick('Must have a premium role in Titan Studios');
                        g.channels.fetch(Data.SERVERS.PREMIUM.CHANNELS.MEMBERS).then((c) => {
                            if (c.isText()) c.send({ content: `Removed - ${m.user.tag} (${m.user.id}) (Not Premium Member) (Joined: <t:${(m?.joinedTimestamp / 1000).toFixed()}:R>)` });
                        });
                    }
                });
            });
        });
    });
}, 1000 * 60 * 60);
//#endregion