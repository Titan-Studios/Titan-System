export const linkPattern = /((?<protocol>https?):\/\/(?<domain>(?:[0-9a-z]{1,63}\.)*\w{2}[0-9a-z](?:[0-9a-z]\w{0,59})?\.(?:[a-z]{2,18}|xn\-\-[0-9a-z\-]))(?<path>(?:\/[^\/\s]*)*))/gi;

export const randomFloat = (min: number, max: number): number => max >= min ? Math.random() * (max - min) + min : randomFloat(max, min);

export const randomInt = (min: number, max: number): number => Math.round(randomFloat(min, max));
export const randomIntList = (min: number, max: number, amount: number = 5): number[] => {
    let ints: number[] = [];
    for (let i = 0; i < amount; i++) {
        let int = 0;
        int = Math.round(randomFloat(min, max));
        if (ints.includes(int)) i--;
        else ints.push(int);
    }
    return ints.sort((a, b) => a - b);
}

export const randomIntTwo = (x: number, a: number) => Math.round(Math.pow(Math.random() * Math.pow(x, a), 1 / a));

export const randomElement = (array: any[]): any => array[randomInt(0, array.length - 1)];

export const randomElements = (array: any[], count: number): any => {
    if (count >= array.length) return array;
    let r = [...array];
    for (var i = 0; i < array.length - count; i++) r.splice(randomInt(0, r.length - 1), 1);
    return r;
};

export const rangeArray = (array: any[], from: number, to: number): any[] => from <= to ? [...array].splice(Math.min(from, 0), Math.min(to - from, array.length - from)) : rangeArray(array, to, from);

export const stringifyArray = (array: any[], sep1: string = ', ', sep2: string = ' and '): string => array.length == 1 ? array[0] : rangeArray(array, 0, array.length - 1).join(sep1) + sep2 + array[array.length - 1];

export const trimArray = (array: any[], length: number, message: string): any[] => {
    let newArray = [];
    if (array.length <= length) {
        newArray = array;
    } else {
        newArray = [...[...array].splice(0, length)];
    }

    if (array.length > length) {
        if (message !== null) {
            newArray.push(message ? message.replace(`{num}`, (array.length - length).toString()) : `+${array.length - length} more.`);
        }
    }

    return newArray;
}

export const shortMessage = (message: string, maxLen: number = 2000): string => message.length > maxLen ? `${message.substr(0, maxLen - 3)}...` : message;

export const numberFormat = (number: number): string => number + (['th', 'th', 'th'][number - 11] || ['st', 'nd', 'rd'][(number > 0 ? number : -number) % 10 - 1] || 'th');

export const delay = (ms: number): Promise<void> => new Promise<void>(resolve => setTimeout(resolve, ms));

export const range = (val: number, min: number, max: number): number => Math.min(Math.max(val, min), max);

export const embedURL = (title: string, url: string, display?: string): string => `[**${title}**](${url}${display ? `"${display}"` : ''})`;

export const abbreviateNumber = (value: number): string => {
    var newValue: any = value;
    if (value >= 1000) {
        var suffixes = ['', 'k', 'm', 'b', 't'];
        var suffixNum = Math.floor(('' + value).length / 3);
        var shortValue: any = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = (parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision)));
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

export const checkDays = (date: number | any, num: boolean = false): string | number => {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    let string = days + (days == 1 ? ' day' : ' days') + ' ago';
    return num ? days : string;
}

export const removeDuplicates = (array: any[]): any[] => {
    if (array.length == 0 || array.length == 1) return array;
    const newArr: any[] = [];
    for (let i = 0; i < array.length; i++) {
        if (newArr.includes(array[i])) continue;
        newArr.push(array[i]);
    }
    return newArr;
}

export const sortByName = (array: any[], prop: any): any[] => {
    return array.sort((a, b) => {
        if (prop) return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
        return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
    });
}

export const firstUpperCase = (text: string, split: string = ' '): string => {
    return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
}

export const cooldown = (timestamp: number, cooldownAmount: number): number | string => {
    const time = timestamp + cooldownAmount;
    if (Date.now() > time) return 0;
    else return (time / 1000).toFixed();
}

export const shuffleArray = (array: any[]): any[] => {
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

export const maxArrayLength = (arr: any[], size: number): any[] => {
    var array = [];
    for (var i = 0; i < arr.length; i += size) {
        array.push(arr.slice(i, i + size));
    }
    return array;
};

export const parseLink = (array: any[]): any[] => array.filter(element => {
    let match = element.match(linkPattern);
    return match !== null && match.length < 255 && element.length < 1024;
});

export const padLeadingZeros = (num: number, size: number): string => {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}