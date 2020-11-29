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
            value: 'apply - Apply for staff.\ncreator - Become a verified creator.\ngetfeatured - Become a featured creator.\npartner - Apply for partnership.\npost - Use this to post updates & artwork.\nreport - Report members to staff.\nsupport - Get help from the staff team for a issue.\ntitanshop - Open titans shop.',
            inline: false
        },


    )
    message.react('749843034753204294')    
    message.channel.send(help)
    },
    permissions: [],
}