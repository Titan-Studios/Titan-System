import * as Discord from 'discord.js';
import { handleMessageCommand } from '../../manager/manager';
import { Color } from '../../utility';

export const OnMessageCreate = (client: Discord.Client) => client.on('messageCreate', (message) => {
    if (!message || !message.channel) return;
    if (!message.author.bot) handleMessageCommand(message);

    // if (message.content == '12945-6') message.member.send({
    //     embeds: [new Discord.MessageEmbed({
    //         title: 'Welcome!',
    //         description: 'Hoi, thank you for joining the Titan Family!\n\nPlease read our terms before verifying thankie! and hope you enjoy your stay!',
    //         color: Color.BLURPLE
    //     })],
    //     components: [new Discord.MessageActionRow({ components: [new Discord.MessageButton({ label: 'Verify', customId: 'SendVerifyMember', style: 'PRIMARY' }), new Discord.MessageButton({ label: 'Terms', customId: 'Terms', style: 'PRIMARY' })] })]
    // })
});