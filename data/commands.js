module.exports = [{
    name: "Application & Report",
    helpcommand: "{1} application",
    description: "Send applications to the server!",
    commands: [{
        name: "Creator",
        aliases: ["creator", "artist", "contentcreator"],
        description: "Send an app to get the <@&730130685662199898> role",
        usage: "{1}"
    }, {
        name: "Staff",
        aliases: ["staff", "staffapp", "mod"],
        description: "Send an staff app",
        usage: "{1}"
    }, {
        name: "Partner",
        aliases: ["partner", "partnership", "ps"],
        description: "Send a app for partnership",
        usage: "{1}"
    }, {
        name: "Report",
        aliases: ["report"],
        description: "Send a report to staff",
        usage: "{1}"
    }]
}, {
    name: 'Music',
    helpcommand: '{1} music',
    description: 'Have fun with music!',
    commands: [{
        name: 'Radio',
        aliases: ['radio'],
        description: 'Play the radio',
        usage: '{1}'
    },
    {
        name: 'Play',
        aliases: ['play', 'p'],
        description: 'Play a song',
        usage: '{1} <name|url>'
    },
    {
        name: 'Stop',
        aliases: ['stop', 'leave', 'shut', 'stfu'],
        description: 'Stop the fun',
        usage: '{1}'
    },
    {
        name: 'Queue',
        aliases: ['queue', 'que', 'q'],
        description: 'Shows the queue',
        usage: '{1}'
    },
    {
        name: 'Skip',
        aliases: ['skip', 's'],
        description: 'Skip to next song',
        usage: '{1}'
    },
    {
        name: 'Previous',
        aliases: ['prev', 'previous'],
        description: 'Skip to prev song',
        usage: '{1}'
    },
    {
        name: 'Clearq',
        aliases: ['clearq'],
        description: 'Clear the queue',
        usage: '{1}'
    },
    {
        name: 'Pause',
        aliases: ['puase'],
        description: 'Pause the queue',
        usage: '{1}'
    },
    {
        name: 'Resume',
        aliases: ['resume'],
        description: 'Rusme playing',
        usage: '{1}'
    },
    {
        name: 'Loop',
        aliases: ['loop', 'repeat'],
        description: 'Loop the song or queue',
        usage: '{1} <queue|song|off>'
    },
    {
        name: 'Jump',
        aliases: ['jump', 'skipto'],
        description: 'Jump to a next song in the queue',
        usage: '{1} <num>'
    },
    {
        name: 'Autoplay',
        aliases: ['autoplay', 'autop'],
        description: 'Auto plays song after the queue ends',
        usage: '{1}'
    },
    {
        name: 'Shuffle',
        aliases: ['shuffle'],
        description: 'Shuffles the songs in the queue',
        usage: '{1}'
    },
    {
        name: 'Lyrics',
        aliases: ['lyrics', 'lyric'],
        description: 'Get the lyrics of a song!',
        usage: '{1} <song>'
    },
    {
        name: 'Volume',
        aliases: ['volume', 'vol'],
        description: 'Change the volume',
        usage: '{1} <num>'
    },
    {
        name: 'Filter',
        aliases: ['filter', 'filt'],
        description: 'Change the filter of the queue',
        usage: '{1} <filter>'
    },
    {
        name: 'Mute',
        aliases: ['mute'],
        description: 'Mute the bot',
        usage: '{1}'
    },
    {
        name: 'Unmute',
        aliases: ['unmute'],
        description: 'Unmute the bot',
        usage: '{1}'
    }]
}]