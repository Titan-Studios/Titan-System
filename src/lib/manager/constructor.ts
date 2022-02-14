//#region Dependencies
import * as Discord from 'discord.js';
import { getClient } from '../client';
import { INFO } from '../data';
import { get as Database, connect as DBConnect } from '../client/database';
//#endregion

//#region Command Base
export abstract class CommandBase {

    protected type: string;
    protected id: number;
    protected name: string;
    protected description: string;
    protected settings: {
        aliases: string[];
        permissions?: Discord.PermissionString[];
        options?: Discord.ApplicationCommandOptionData[];
        guildOnly?: boolean;
        premium?: boolean;
    }
    protected data: any;

    constructor(id: number, type: ('MESSAGE' | 'SLASH' | 'BOTH'), name: string, description: string, settings?: { aliases: string[], permissions: Discord.PermissionString[], options?: Discord.ApplicationCommandOptionData[], guildOnly?: boolean, premium?: boolean }, data?: any) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description;
        this.settings = settings;
        this.data = data;
    }
    public awake(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let category: string = null;

            if (this.id <= 999 && this.id >= 1) category = 'General'
            if (this.id <= 1999 && this.id >= 1001) category = 'Actions'
            if (this.id <= 2999 && this.id >= 2001) category = 'Fun'
            if (this.id <= 3999 && this.id >= 3001) category = 'Music'
            if (this.id <= 4999 && this.id >= 4001) category = 'Moderation'
            if (this.id <= 5999 && this.id >= 5001) category = 'Profile'
            if (this.id <= 6999 && this.id >= 6001) category = 'Economy'
            if (this.id <= 7999 && this.id >= 7001) category = 'Utility'
            if (this.id <= 8999 && this.id >= 8001) category = 'Config'
            if (this.id <= 9999 && this.id >= 9001) category = 'Bot'

            Database('client', 'client').findOne().then((a) => {
                const command = a.commands?.[category.toLowerCase()]?.[this.name.toLowerCase()];
                if (command) {
                    this.data = command?.data;
                    this.settings = command?.settings;
                    resolve(command);
                }
                resolve;
            });
        });
    }
    public initialize(type: ('AWAKE' | 'UPDATE'), extra?: CommandExtra): void { };
    public message(prefix: Prefix, command: string, args: string[], message: Discord.Message, mentions?: Discord.Collection<string, Discord.User>, extra?: CommandExtra): void { };
    public slash(interaction: Discord.CommandInteraction, options?: Discord.CommandInteractionOption[], extra?: CommandExtra): void { };
    public sendUsage(channel: Discord.TextChannel | Discord.DMChannel | Discord.PartialDMChannel | Discord.NewsChannel | Discord.ThreadChannel, prefix: Prefix, message?: Discord.Message | Discord.CommandInteraction) {

        let usage: string[] = [];

        for (let a of this.settings.options) {
            //@ts-ignore
            if (a.required) usage.push(`<${a.name.toLowerCase()}>`);
            else usage.push(`[${a.name.toLowerCase()}]`);
        }

        if (message) {
            message.reply({
                allowedMentions: { repliedUser: false },
                embeds: [new Discord.MessageEmbed({
                    title: this.name,
                    description: `**Description:** ${this.description}\n**Usage:** \`${prefix + this.name.toLowerCase()} ${usage.join(' ').replace(/ or /g, '|')}\``,
                    color: '#6cff4f'
                })]
            });
        } else {
            channel.send({
                embeds: [new Discord.MessageEmbed({
                    title: this.name,
                    description: `**Description:** ${this.description}\n**Usage:** \`${prefix + this.name.toLowerCase()} ${usage.join(' ').replace(/ or /g, '|')}\``,
                    color: '#6cff4f'
                })]
            });
        }

    }
    public checkPermissions(type: ('MESSAGE' | 'SLASH'), message: any): boolean {
        if (this.settings?.guildOnly && !message.guild) {
            message.reply({
                allowedMentions: { repliedUser: false }, embeds: [new Discord.MessageEmbed({
                    description: `This command can only be ran in a server`,
                    color: '#ff0000'
                })]
            });
            return false;
        };
        if (this.settings.permissions.length == 0) return true;
        else {
            let a = new Discord.MessageEmbed({
                description: `You dont have the currect permission to run that command\nRequires: \`${this.settings.permissions.join(' ')}\``,
                color: '#ff0000'
            });
            if (type == 'MESSAGE') {
                if (message.guild.members.cache.get(message.author.id).permissions.has(this.settings.permissions)) return true;
                else {
                    message.reply({
                        allowedMentions: { repliedUser: false }, embeds: [a]
                    });
                    return false;
                };
            } else if (type == 'SLASH') {
                if (message.memberPermissions.has(this.settings.permissions)) return true;
                else message.reply({
                    ephemeral: true, embeds: [a]
                });
            }
        }
    }
}
//#endregion

//#region Channel Base
export abstract class ChannelModuleBase {

    protected id: number;
    protected name: string;
    protected type: string;
    protected description: string;

    constructor(id: number, name: string, type: string, description?: string) {
        this.id = id;
        this.name = name;
        this.type = type.toLowerCase();
        this.description = description;
    }
    public handle(message: Discord.Message, channel: any, channelData: any, channelSettings: any) { }
}
//#endregion


//#region Guild
export class Guild {

    protected id: Snowflake;
    protected name: string;
    protected data: { a: GuildType, b: Discord.Guild };

    constructor(id: Snowflake) {
        this.id = id;
    }

    public set(): Promise<GuildType> {
        return new Promise<any>((resolve, reject) => {
            Database('guilds', 'client').findOne({ _id: this.id as any }).then((a: any) => {
                getClient().guilds.fetch(this.id).then((b) => {
                    if (a) {
                        this.name = b.name;
                        this.data = { a: a, b: b };
                        resolve(this.data);
                    }
                    else this.create().then((a) => {
                        this.name = b.name;
                        this.data = { a: a, b: b };
                        resolve(this.data);
                    });
                });
            }).catch(reject);
        });
    }

    public create(): Promise<GuildType> {
        return new Promise<GuildType>((resolve, reject) => {
            Database('guilds', 'client').insertOne({
                _id: this.id as any,
                prefix: 't!',
                data: {
                    stats: {
                        total: {
                            messages: 0,
                            joins: 0,
                            leaves: 0,
                            commands: 0
                        },
                        week: []
                    },
                    user: [],
                    client: {
                        nickname: 'Titan-Bot',
                        ignore: {
                            channels: [],
                            commands: []
                        }
                    },
                    roles: {
                        mod: [],
                        muted: null
                    },
                    auditLog: []
                },
                setting: {
                    user: {
                        minWarn: 5,
                        muteDuration: 0
                    },
                    client: {
                        actionImage: true
                    },
                    blacklist: {
                        invites: false,
                        words: [],
                        links: [],
                        actions: {
                            delete: false,
                            warn: false,
                            mute: false,
                            message: false,
                            dm: false,
                            kick: false,
                            ban: false
                        }
                    },
                    logs: {
                        channels: {
                            default: null,
                            members: null,
                            message: null,
                            server: null
                        }
                    }
                }
            }).then(() => {
                Database('guilds', 'client').findOne({ _id: this.id as any }).then((a: any) => resolve(a)).catch(reject);
            }).catch(reject);
        });
    }

    // Database Guild
    public get(): GuildType {
        return this.data ? this.data.a : null;
    }

    public getPrefix(): Prefix {
        return this.data ? this.data.a.prefix : null;
    }

    public getSetting(): GuildSetting {
        return this.data ? this.data.a.setting : null;
    }

    public getData(): GuildData {
        return this.data ? this.data.a.data : null;
    }

    // Discord Guild
    public getGuild(): Discord.Guild {
        return this.data ? this.data.b : null;
    }
}
//#endregion

//#region Profile
export class Profile {

    protected id: Snowflake;
    protected profile: ProfileType;
    protected user: Discord.User;

    constructor(id: Snowflake) {
        this.id = id;
    }

    public set(): Promise<ProfileType> {
        return new Promise<any>((resolve, reject) => {
            Database('profiles', 'client').findOne({ _id: this.id as any }).then((profile: any) => {
                getClient().users.fetch(this.id).then((user) => {
                    if (profile) {
                        this.profile = profile;
                        this.user = user;
                        resolve(profile);
                    }
                    else this.create().then((new_profile) => {
                        this.profile = new_profile;
                        this.user = user;
                        resolve(new_profile);
                    });
                });
            }).catch(reject);
        });
    }

    public create(): Promise<ProfileType> {
        return new Promise<ProfileType>((resolve, reject) => {
            Database('profiles', 'client').insertOne({ _id: this.id as any, premium: false, description: 'Just alittle bean uwu', data: { level: { current: 0, xp: 0, totalxp: 0, card: { owned: [] } }, combat: { holding: { status: false, id: 0, type: ' ', name: ' ', description: ' ', emoji: ' ', durability: 0, rate: 0, capacity: 0 }, hp: 100, maxhp: 100 }, afk: { status: false, reason: ' ', timestamp: 0 }, economy: { wallet: 500, bank: 0, cooldowns: { daily: 0, work: 0, beg: 0, steal: 0, crime: 0, rob: 0 } }, inventory: { capcaity: 20, items: [] }, achivements: [], relationship: { married: false, marraiges: [] }, stats: { total: { counting: 0, titanMention: 0, votes: 0, wins: 0, losts: 0 } } }, setting: { color: 16762547, level: { card: { active: 0, color: 7506394, status: 0 } }, display: { hp: true, winlost: true, marriages: true, stats: true } }, timestamp: Date.now() }).then(() => {
                Database('profiles', 'client').findOne({ _id: this.id as any }).then((a: any) => resolve(a)).catch(reject);
            }).catch(reject);
        });
    }

    // Database Profile
    public getProfile(): ProfileType {
        return this.profile;
    }

    public getLevel(): ProfileLevelData {
        return this.profile.data.level;
    }

    // Discord User
    public getUser(): Discord.User {
        return this.user;
    }

    // Premium
    public updatePremium(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            getClient().guilds.fetch(INFO.ids.premiumServer).then(fetchedPremiumGuild => {
                Promise.all(INFO.ids.premiumRoles.map(roleID => fetchedPremiumGuild.roles.fetch(roleID).catch(() => console.error(`Couldn't fetch premium role with ID ${roleID}!`)))).then(premiumRoles => {
                    //@ts-ignore
                    let premiumMemberIDs = premiumRoles.map(premiumRole => premiumRole?.members.map(member => member.id)).flat().filter((memberID, i, arr) => arr.indexOf(memberID) === i);

                    if (this.user != null || undefined) {
                        if (premiumMemberIDs.includes(this.user.id)) resolve(true);
                        else resolve(false);
                    }
                    else {
                        Database('profiles', 'client').updateMany({
                            _id: { $in: premiumMemberIDs }, premium: false
                        }, {
                            $set: { premium: true }
                        }).then(() => {
                            Database('profiles', 'client').updateMany({
                                _id: { $nin: premiumMemberIDs }, premium: true
                            }, {
                                $set: { premium: false }
                            }).then(() => resolve).catch(console.error);
                        }).catch(console.error);
                    }
                });
            }).catch(() => console.error('Couldn\'t fetch the premium guild!'));
        });
    }

    public setPremium(preValue: boolean = false): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.isPremium(false).then(isPremium => {
                if (preValue == isPremium) resolve(isPremium);
                Database('profiles', 'client').updateOne({ _id: this.user.id as any }, { $set: { premium: isPremium } }).then(() => resolve(isPremium)).catch(reject);
            }).catch(reject);
        });
    }

    public isPremium(useProfile: boolean = true): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (useProfile) Database('profiles', 'client').findOne({
                _id: this.user.id as any
            }).then(profile => {
                if (profile.premium) resolve(profile.premium);
                else this.setPremium().then((a) => resolve(a));
            }).catch(reject);
            else getClient().guilds.fetch(INFO.ids.premiumServer).then(fetchedPremiumGuild => {
                fetchedPremiumGuild.members.fetch(this.user.id).then(member => resolve(member.roles.cache.some(role => INFO.ids.premiumRoles.includes(role.id)))).catch(() => resolve(false));
            }).catch(reject);
        });
    }
}
//#endregion


//#region Action
export class Action {

    protected name: string;
    protected userID: Snowflake;
    protected content: { owner?: string[], self?: string[], client?: string[], others?: string[], food?: string[] };
    protected message: Discord.Message | Discord.CommandInteraction;
    protected mentions: any[];
    protected images: any[];
    protected authorName: string;
    protected targetNames: any[];
    protected targetIDs: any[];
    public targets: Discord.GuildMember[];

    constructor(name: string, userID: Snowflake, content: { owner?: string[], self?: string[], client?: string[], others?: string[], food?: string[], images?: any[] }, message: Discord.Message | Discord.CommandInteraction, mentions: any[], images?: any[]) {
        this.name = name;;
        this.userID = userID;
        this.content = content;
        this.message = message;
        this.mentions = mentions;
        this.images = images;
        this.start();
    }

    private start() {

        let guildMember = getClient().guilds.cache.get(this.message.guildId)?.members.cache.get(this.userID);

        this.authorName = guildMember?.nickname ? guildMember?.nickname : guildMember?.user?.username;

        if (this.mentions.length == 0 || !this.userID) return;

        const rangeArray = (array: any[], from: number, to: number): any[] => from <= to ? [...array].splice(Math.min(from, 0), Math.min(to - from, array.length - from)) : rangeArray(array, to, from);

        this.targets = rangeArray(this.mentions.map(arg => /(?<id>\d{18})/.exec(arg).groups.id).filter((arg, i, arr) => arr.indexOf(arg) === i), 0, 10).map(arg => this.message.guild.members.cache.get(arg)).filter(target => !!target);

        if (this.targets.length <= 0) {
            this.message.reply({
                allowedMentions: { repliedUser: false },
                embeds: [new Discord.MessageEmbed({ description: 'Couldn\'t find that member', color: '#ff0000' })]
            });
            return;
        }

        let a = [];
        let b = [];
        for (const target of this.targets) {
            let guildMemberTarget = getClient().guilds.cache.get(this.message.guildId)?.members.cache.get(target.id);
            a.push(guildMemberTarget?.nickname ? guildMemberTarget?.nickname : guildMemberTarget?.user?.username);
            b.push(target.id);
        }

        this.targetNames = a;
        this.targetIDs = b;

        // Self mentioned
        if (this.targets.some(target => target.id == this.userID)) return this.self();

        // Owner mentioned
        if (this.content.owner?.length != 0 && this.targets.some(target => INFO.devUsers.includes(target.id))) return this.owner();

        // Client mentioned
        if (this.targets.some(target => target.id == getClient().user.id)) return this.client();

        // Others mentioned
        return this.other();
    }

    public self() {
        const img = this.images[Math.round(Math.random() * ((this.images.length - 1) - 0))];
        this.message.reply({
            allowedMentions: { repliedUser: false },
            content: this.content.self[Math.round(Math.random() * ((this.content.self.length - 1) - 0))].replace('{0}', this.authorName).replace('{food}', this.content.food[Math.round(Math.random() * ((this.content.food.length - 1) - 0))]),
            files: img ? img : []
        });
    }
    private client() {
        const img = this.images[Math.round(Math.random() * ((this.images.length - 1) - 0))];
        this.message.reply({
            allowedMentions: { repliedUser: false },
            content: this.content.client[Math.round(Math.random() * ((this.content.self.length - 1) - 0))].replace('{0}', this.authorName).replace('{food}', this.content.food[Math.round(Math.random() * ((this.content.food.length - 1) - 0))]),
            files: img ? img : []
        });
    }
    private other() {
        const img = this.images[Math.round(Math.random() * ((this.images.length - 1) - 0))];
        const rangeArray = (array: any[], from: number, to: number): any[] => from <= to ? [...array].splice(Math.min(from, 0), Math.min(to - from, array.length - from)) : rangeArray(array, to, from);
        this.message.reply({
            allowedMentions: { repliedUser: false },
            content: this.content.others[Math.round(Math.random() * ((this.content.self.length - 1) - 0))].replace('{0}', this.authorName).replace('{1}', this.targetNames.length == 1 ? this.targetNames[0] : rangeArray(this.targetNames, 0, this.targetNames.length - 1).join(', ') + ' and ' + this.targetNames[this.targetNames.length - 1]).replace('{food}', this.content.food[Math.round(Math.random() * ((this.content.food.length - 1) - 0))]),
            files: img ? [img] : []
        });
    }
    private owner() {
        const img = this.images[Math.round(Math.random() * ((this.images.length - 1) - 0))];
        const rangeArray = (array: any[], from: number, to: number): any[] => from <= to ? [...array].splice(Math.min(from, 0), Math.min(to - from, array.length - from)) : rangeArray(array, to, from);
        this.message.reply({
            allowedMentions: { repliedUser: false },
            content: this.content.owner[Math.round(Math.random() * ((this.content.owner.length - 1) - 0))].replace('{0}', this.authorName),
            files: img ? [img] : []
        });
    }
}
//#endregion


//#region Timer
export class Timer {

    protected callback: Function;
    protected timer: NodeJS.Timeout;
    protected time: number;
    protected start: number;
    public ended: boolean;

    constructor(callback: Function, time: number) {
        this.setTimeout(callback, time);
    }
    private setTimeout(callback: Function, time: number) {
        var self = this;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.ended = false;
        this.callback = callback;
        this.time = time;
        this.timer = setTimeout(function () {
            self.ended = true;
            callback();
        }, time);
        this.start = Date.now();
    }
    public add(time: number): void {
        if (!this.ended) {
            time = this.time - (Date.now() - this.start) + time;
            this.setTimeout(this.callback, time);
        }
    }
    public remove(time: number): void {
        if (!this.ended) {
            time = this.time - (Date.now() - this.start) - time;
            this.setTimeout(this.callback, time);
        }
    }
    public reset(): void {
        if (!this.ended) this.setTimeout(this.callback, this.time);
    }
    public end(): void {
        clearTimeout(this.timer);
    }
}
//#endregion