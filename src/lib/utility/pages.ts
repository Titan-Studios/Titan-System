import * as Discord from 'discord.js';
import { client } from '../client';
import { Timer } from '../manager/constructor';
import { ButtonList, DiscordButton } from '../utility';


export const MessagePages = async (userMessage: Discord.Message, pages: Discord.MessageEmbed[], time: number = 60000) => {
    userMessage.reply({ content: '** **', allowedMentions: { repliedUser: false } }).then((message) => {
        let footerEmbed = new Discord.MessageEmbed();
        let btn1 = DiscordButton('Back', `PageBack-${message.id}`, 'DANGER');
        let btn2 = DiscordButton('Next', `PageNext-${message.id}`, 'SUCCESS');
        let i = 0;

        if (pages.length == 1) {
            btn1.setDisabled(true);
            btn2.setDisabled(true);
        } else {
            btn1.setDisabled(false);
            btn2.setDisabled(false);
        }

        let timer = new Timer(() => {
            message.edit({ components: [], embeds: [pages[i], footerEmbed.setFooter({ text: `Page ${i + 1} / ${pages.length} - Interaction Closed` })] }).catch(() => { });
        }, time);

        message.edit({
            components: [new Discord.MessageActionRow({ components: [btn1, btn2, ButtonList.DeleteMessage], })],
            embeds: [pages[0], footerEmbed.setFooter({ text: `Page 1 / ${pages.length}` })]
        }).catch(() => { });

        client.on('interactionCreate', (buttonInteraction) => {
            if (timer.ended) return;

            if (userMessage.author.id != buttonInteraction.user.id) return;
            if (!buttonInteraction.isButton()) return;

            if (buttonInteraction.customId == `PageNext-${message.id}`) {
                buttonInteraction.deferUpdate().catch(() => { });
                if (i == pages.length - 1) i = -1;
                i = i + 1;
                message.edit({ embeds: [pages[i], footerEmbed.setFooter({ text: `Page ${i + 1} / ${pages.length}` })] }).catch(() => { });
                timer.reset();
            }
            else if (buttonInteraction.customId == `PageBack-${message.id}`) {
                buttonInteraction.deferUpdate().catch(() => { });
                if (i == 0) i = pages.length;
                i = i - 1;
                message.edit({ embeds: [pages[i], footerEmbed.setFooter({ text: `Page ${i + 1} / ${pages.length}` })] }).catch(() => { });
                timer.reset();
            }
            else if (buttonInteraction.customId == 'DeleteMessage') {
                buttonInteraction.deferUpdate().catch(() => { });
                timer.end();
                message.delete().catch(() => { });
            }
            buttonInteraction.deferUpdate().catch(() => { });
        });
    }).catch(() => { });
};

export const SlashPages = async (commandInteraction: Discord.CommandInteraction, pages: Discord.MessageEmbed[], ephemeral: boolean = false, time: number = 60000) => {
    commandInteraction.deferReply({ ephemeral: ephemeral }).then(() => {
        let footerEmbed = new Discord.MessageEmbed();
        let btn1 = DiscordButton('Back', `PageBack-${commandInteraction.id}`, 'DANGER');
        let btn2 = DiscordButton('Next', `PageNext-${commandInteraction.id}`, 'SUCCESS');
        let i = 0;

        if (pages.length == 1) {
            btn1.setDisabled(true);
            btn2.setDisabled(true);
        } else {
            btn1.setDisabled(false);
            btn2.setDisabled(false);
        }

        let timer = new Timer(() => {
            commandInteraction.editReply({ components: [], embeds: [pages[i], footerEmbed.setFooter({ text: `Page ${i + 1} / ${pages.length} - Interaction Closed` })] }).catch(() => { });
        }, time);

        commandInteraction.editReply({
            components: [new Discord.MessageActionRow({ components: [btn1, btn2, ButtonList.DeleteMessage], })],
            embeds: [pages[0], footerEmbed.setFooter({ text: `Page 1 / ${pages.length}` })]
        }).catch(() => { });

        client.on('interactionCreate', (buttonInteraction) => {
            if (timer.ended) return;

            if (commandInteraction.user.id != buttonInteraction.user.id) return;
            if (!buttonInteraction.isButton()) return;

            if (buttonInteraction.customId == `PageNext-${commandInteraction.id}`) {
                buttonInteraction.deferUpdate().catch(() => { });
                if (i == pages.length - 1) i = -1;
                i = i + 1;
                commandInteraction.editReply({ embeds: [pages[i], footerEmbed.setFooter({ text: `Page ${i + 1} / ${pages.length}` })] }).catch(() => { });
                timer.reset();
            }
            else if (buttonInteraction.customId == `PageBack-${commandInteraction.id}`) {
                buttonInteraction.deferUpdate().catch(() => { });
                if (i == 0) i = pages.length;
                i = i - 1;
                commandInteraction.editReply({ embeds: [pages[i], footerEmbed.setFooter({ text: `Page ${i + 1} / ${pages.length}` })] }).catch(() => { });
                timer.reset();
            }
            else if (buttonInteraction.customId == 'DeleteMessage') {
                buttonInteraction.deferUpdate().catch(() => { });
                timer.end();
                commandInteraction.deleteReply().catch(() => { });
            }
        });
    }).catch(() => { });
};