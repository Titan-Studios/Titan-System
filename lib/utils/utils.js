const Moment = require('moment');

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randomFloat = (min, max) => max >= min ? Math.random() * (max - min) + min : randomFloat(max, min);

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randomInt = (min, max) => Math.round(randomFloat(min, max));

/**
 * @param {any[]} array
 * @returns {any}
 */
const randomElement = array => array[randomInt(0, array.length - 1)];

/**
 * @param {any[]} array
 * @param {number} count
 * @returns {any}
 */
const randomElements = (array, count) => {
    if (count >= array.length) return array;
    let r = [...array];
    for (var i = 0; i < array.length - count; i++) r.splice(randomInt(0, r.length - 1), 1);
    return r;
};

/**
 * @param {any[]} array
 * @param {number} from
 * @param {number} to
 * @returns {any[]}
 */
const rangeArray = (array, from, to) => from <= to ? [...array].splice(Math.min(from, 0), Math.min(to - from, array.length - from)) : arrayRange(array, to, from);

/**
 * @param {any[]} array
 * @param {string} sep1
 * @param {string} sep2
 * @returns {string}
 */
const stringifyArray = (array, sep1 = ', ', sep2 = ' and ') => array.length === 1 ? array[0] : rangeArray(array, 0, array.length - 1).join(sep1) + sep2 + array[array.length - 1];

/**
 * @param {any[]} array
 * @param {number} length
 * @returns {string}
 */
const trimArray = (array, length, message) => array.length <= length ? array : [...[...array].splice(0, length), message ? message.replace(`{num}`, array.length - length) : `+${array.length - length} more.`];

/**
 * @param {string} message
 * @param {number} maxLen
 * @returns {string}
 */
const shortMessage = (message, maxLen = 2000) => message.length > maxLen ? `${message.substr(0, maxLen - 3)}...` : message;

/**
 * @param {number} number
 * @returns {string}
 */
const numberFormat = number => number + (['th', 'th', 'th'][number - 11] || ['st', 'nd', 'rd'][(number > 0 ? number : -number) % 10 - 1] || 'th');

/**
 * @param {number} ms
 * @returns {string}
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
const range = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * @param {string} title
 * @param {string} url
 * @param {string} display
 */
const embedURL = (title, url, display) => `[**${title}**](${url}${display ? ` "${display}"` : ''})`;

/**
 * @param {number} value
 */
const abbreviateNumber = value => {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b", "t"];
        var suffixNum = Math.floor(("" + value).length / 3);
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) {
                break;
            }
        }
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
        newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
}

/**
 * @param {number} date
 */
const checkDays = (date, num = false) => {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    let string = days + (days == 1 ? ' day' : ' days') + ' ago';
    return num ? days : string;
}

/**
 * @param {array} array
 */
const removeDuplicates = array => {
    if (array.length === 0 || array.length === 1) return array;
    const newArr = [];
    for (let i = 0; i < array.length; i++) {
        if (newArr.includes(array[i])) continue;
        newArr.push(array[i]);
    }
    return newArr;
}

/**
 * @param {array} array
 * @param {any} prop
 */
const sortByName = (array, prop) => {
    return array.sort((a, b) => {
        if (prop) return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
        return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
    });
}

/**
 * @param {string} text
 * @param {string} split
 */
const firstUpperCase = (text, split = ' ') => {
    return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
}

/**
 * @param {number} timestamp
 * @param {number} cooldownAmount
 */
const cooldown = (timestamp, cooldownAmount) => {
    const time = timestamp + cooldownAmount;
    const timeLeftMilli = (time - Date.now());
    const duration = Moment.duration(timeLeftMilli, 'milliseconds');
    const timeLeft = `${duration.hours() > 0 ? `${duration.hours()}h` : ''} ${duration.minutes() > 0 ? `${duration.minutes()}m` : ''} ${duration.seconds()}s`;
    if (Date.now() > time) return true;
    else return timeLeft;
}

/**
 * @param {array} array
 */
const shuffleArray = array => {
    let b = [...array],
        c = b.length - 1,
        d, e;
    while (c > 0) {
        d = Math.round(Math.random() * c);
        c--;
        e = b[d];
        b[d] = b[c];
        b[c] = e;
    }
    return b
};

/**
 * @param {Array} arr
 * @param {Number} size
 * @returns {Promise<void>}
 */
 const maxArrayLength = (arr, size) => {
    var array = []
    for (var i = 0; i < arr.length; i += size) {
        array.push(arr.slice(i, i + size))
    }
    return array
};

module.exports.randomFloat = randomFloat;
module.exports.randomInt = randomInt;
module.exports.randomElement = randomElement;
module.exports.randomElements = randomElements;
module.exports.rangeArray = rangeArray;
module.exports.stringifyArray = stringifyArray;
module.exports.trimArray = trimArray;
module.exports.shortMessage = shortMessage;
module.exports.numberFormat = numberFormat;
module.exports.delay = delay;
module.exports.range = range;
module.exports.embedURL = embedURL;
module.exports.abbreviateNumber = abbreviateNumber;
module.exports.checkDays = checkDays;
module.exports.sortByName = sortByName;
module.exports.removeDuplicates = removeDuplicates;
module.exports.firstUpperCase = firstUpperCase;
module.exports.cooldown = cooldown;
module.exports.shuffleArray = shuffleArray;
module.exports.maxArrayLength = maxArrayLength;