const Discord = require('discord.js');
const config = require('../../config.json')
const command = require('../command-base')

module.exports = {
    commands: 'help',
    permissionError: 'You cant use that command!',
    callback: (message, arguments, text) => {

    const help = new Discord.MessageEmbed()
    .setTitle('System Help List')
    .setDescription(`This is the help list for the Titan System, The prefix is \`t!\``)
    .setFooter(`Im here for you!`)
    .setColor('RANDOM')
    .addFields(
        {
            name: 'Submissions & Support',
            value: '`apply` - Apply for staff.\n`creator` - Become a verified creator.\n`getfeatured` - Become a featured creator.\n`partner` - Apply for partnership.\n`post` - Use this to post updates & artwork or images.\n`report` - Report members to staff.\n`support` - Get help from the staff team for a issue.\n`titanshop` - Open titans shop.',
            inline: false
        },
        {
            name: 'Vip',
            value: '`ask` - Ask Titan anything!.\n`request` - Request something from Titan.',
            inline: false
        },


    )
    message.react('749843034753204294')    
    message.channel.send(help)
    },
    permissions: [],
}