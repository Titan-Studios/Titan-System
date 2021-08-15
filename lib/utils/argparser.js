const p=/(?:"([^"]+)"|([^\s]+))/g;
/**
    @param {string} i
    @returns {string[]}
*/
module.exports.parse=i=>[...i.match(p)].map(a=>a[0]==='"'&&a[a.length-1]==='"'?a.substr(1,a.length-2):a).filter(a=>!!a);