import * as Discord from 'discord.js';
import Jimp from 'jimp';
import { client } from '..';
import { SERVERS } from '../../data';
import { handleMessageCommand } from '../../manager/manager';
import { Color, DiscordButton, Utils } from '../../utility';

export const OnMessageCreate = (client: Discord.Client) => client.on('messageCreate', (message) => {
    if (!message || !message.channel) return;
    if (!message.author.bot) handleMessageCommand(message);
    if (message.channel.id == SERVERS.PREMIUM.CHANNELS.POSTS.ID) NewPremiumPost(message);
});

async function NewPremiumPost(message: Discord.Message<boolean>) {
    if (message.author.id != '625487161092866107') return;

    let buffer: Buffer;
    let imageUrl: string;
    let totalImages: number;

    if (message.attachments.size > 0) {
        totalImages = message.attachments.size;
        Jimp.read(message.attachments.first().url).then(img => {
            img.resize(Jimp.AUTO, 720);
            img.blur(100);
            img.getBufferAsync(Jimp.MIME_JPEG).then((a) => {
                buffer = a; client.channels.fetch('942893112827715627').then((a) => {
                    if (!a.isText()) return;
                    a.send({ files: [buffer] }).then(b => {
                        imageUrl = b.attachments.first().url;
                        client.channels.fetch(SERVERS.MAIN.CHANNELS.INBOX.ID).then((c) => {
                            if (!c.isText()) return;
                            c.send({
                                embeds: [new Discord.MessageEmbed({
                                    title: 'New Post | Premium',
                                    description: message.content ? Utils.shortMessage(message.content, 15) : '',
                                    image: { url: imageUrl ? imageUrl : '' },
                                    footer: { text: `Images: ${totalImages}` },
                                    color: Color.CREAM
                                })],
                                components: [new Discord.MessageActionRow({ components: [DiscordButton('View', null, 'LINK', message.url), DiscordButton('Premium', null, 'LINK', 'https://discord.com/channels/708843719528284262/716635158228369470')] })]
                            });
                        });
                    });
                });
            }).catch(() => { });
        }).catch(() => { });
    }
    else {
        client.channels.fetch(SERVERS.MAIN.CHANNELS.INBOX.ID).then((c) => {
            if (!c.isText()) return;
            c.send({
                embeds: [new Discord.MessageEmbed({
                    title: 'New Post | Premium',
                    description: message.content,
                    color: Color.CREAM
                })],
                components: [new Discord.MessageActionRow({ components: [DiscordButton('View', null, 'LINK', message.url), DiscordButton('Premium', null, 'LINK', 'https://discord.com/channels/708843719528284262/716635158228369470')] })]
            });
        });
    }
}

