

//#region Lists
interface ChannelModule { id: number, name: string, type: string, description?: string, handle(message: any, channel: any, channelData: any, channelSettings: any): Function };
interface CommandBaseList { id: number, type: ('MESSAGE' | 'SLASH' | 'BOTH'), name: string, description: string, settings: { aliases: string[], permissions?: any[], options?: any[], guildOnly?: boolean, premium?: boolean }, data?: any, awake(): Promise<void>, initialize(type: ('AWAKE' | 'UPDATE')): Function, message(prefix: Prefix, command: string, args: string[], message: any, mentions?: Collection<string, User>, extra?: CommandExtra): Function, slash(interaction: any, options?: Omit<CommandInteractionOptionResolver<Cached>, 'getMessage' | 'getFocused'>, extra?: CommandExtra): Function, sendUsage(channel: Discord.TextChannel | Discord.DMChannel | Discord.PartialDMChannel | Discord.NewsChannel | Discord.ThreadChannel, prefix: Prefix, message?: Discord.Message): Function, checkPermissions(type: ('MESSAGE' | 'SLASH'), message: any): Function };
interface CommandList { id: number, name: string, description: string, emoji: string, commands: CommandBaseList[] };
interface CommandExtra { profile: { set(): Function, create(): Function, getLevel(): Function, getUser(): Function, getProfile(): Function, updatePremium(): Function, setPremium(): Function, isPremium(): Promise<boolean> } };
//#endregion

//#region Guild 
interface GuildType { _id: Snowflake, prefix: Prefix, data: GuildData, setting: GuildSetting };
interface GuildData { stats: GuildStatsData, user: GuildUserData[], client: GuildClientData, roles: GuildRoleData, auditLog: GuildAuditLogData[] };
interface GuildSetting { user: GuildUserSetting, client: GuildClientSetting, blacklist: GuildBlacklistSetting, logs: GuildLogSetting };

// Guild Data
interface GuildStatsData { total: { messages: number, joins: number, leaves: number, commands: number }, week: { messages: number, joins: number, leaves: number, commands: number, timestamp: Timestamp }[] };
interface GuildUserData { id: Snowflake, muted: boolean, warns: { timestamp: Timestamp, reason: string, admin: Snowflake }[], ranks: { level: number, xp: number } };
interface GuildClientData { nickname: string, ignore: { channels: Snowflake[], commands: number[] } };
interface GuildRoleData { muted: Snowflake, mod: Snowflake[] };
interface GuildChannelData { _id: Snowflake, type: string, data: any, setting: any };
interface GuildAuditLogData { id: Snowflake, username: string, action: string, timestamp: Timestamp };

// Guild Setting
interface GuildUserSetting { minWarn: number, muteDuration: number };
interface GuildClientSetting { actionImage: boolean };
interface GuildBlacklistSetting { invites: boolean, words: string[], links: string[], actions: { delete: boolean, warn: boolean, mute: boolean, message: boolean, dm: boolean, kick: boolean, ban: boolean } };
interface GuildLogSetting { channels: { default: any, members: any, message: any, server: any } };
//#endregion


//#region Profile
interface ProfileType { _id: Snowflake, premium: Premium, description: string, data: ProfileData, setting: ProfileSetting, timestamp: Timestamp };
interface ProfileData { level: ProfileLevelData, combat: ProfileCombatData, afk: ProfileAfkData, economy: ProfileEconomyData, inventory: ProfileInventoryData, achivements: ProfileAchivementObject[], relationship: ProfileRelationshipData, stats: ProfileStatsData };
interface ProfileSetting { color: Hash, level: ProfileLevelSetting, display: ProfileDisplaySetting };

// Profile Data
interface ProfileLevelData { current: number, xp: number, totalxp: number, card: { owned: number[] } };
interface ProfileAfkData { status: boolean, reason: string, timestamp: Timestamp };
interface ProfileEconomyData { wallet: number, bank: number, cooldowns: { daily: Timestamp, work: Timestamp, beg: Timestamp, steal: Timestamp, crime: Timestamp, rob: Timestamp } };
interface ProfileInventoryData { capcaity: number, items: ProfileInventoryItemObject[] };
interface ProfileCombatData { holding: ProfileInventoryItemObject, hp: number, maxhp: number };
interface ProfileRelationshipData { married: boolean, marraiges: ProfileMarriageObject[] };
interface ProfileStatsData { total: { counting: number, titanMention: number, votes: number, wins: number, losts: number } };


// Profile Setting
interface ProfileDisplaySetting { hp: boolean, winlost: boolean, marriages: boolean, stats: boolean };
interface ProfileLevelSetting { card: { active: number, color: Hash, status: number } };

// Other
interface ProfileInventoryItemObject { status: boolean, id: number, type: ('WEAPON' | 'TOOL' | 'FOOD'), name: string, description: string, emoji?: string, durability?: number, rate?: number, capacity: number };
interface ProfileAchivementObject { id: number, name: string, description: string, timestamp?: Timestamp };
interface ProfileMarriageObject { id: Snowflake, timestamp: Timestamp };
//#endregion