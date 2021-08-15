const SpotifyPlugin = require('@distube/spotify');
const SoundCloudPlugin = require('@distube/soundcloud');

const spotify = new SpotifyPlugin({
    parallel: true
});
const soundcloud = new SoundCloudPlugin();

module.exports = {
    CLIENT: {
        partials: [
            'CHANNEL',
            'GUILD_MEMBER',
            'MESSAGE',
            'REACTION',
            'USER'
        ],
        intents: [
            1,
            2,
            4,
            8,
            16,
            32,
            64,
            128,
            256,
            512,
            1024,
            2048,
            4096,
            8192,
            16384
        ]
    },
    DISTUBE: {
        searchSongs: 0,
        emitNewSongOnly: true,
        plugins: [spotify, soundcloud],
        emptyCooldown: 7 * 24 * 60 * 60,
        customFilters: {
            '8d': 'apulsator=hz=0.075',
            'wavey': 'vibrato=f=5',
            'earrape': 'acrusher=level_in=8:level_out=18:bits=8:mode=log:aa=1',
        }
    }
};