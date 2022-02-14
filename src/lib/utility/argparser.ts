const p = /(?:"([^"]+)"|([^\s]+))/g;

//#region Parser
export const parse = (i : string) => [...i.match(p)].map(a => a[0] === '"' && a[a.length - 1] === '"' ? a.substr(1, a.length - 2) : a).filter(a => !!a);
//#endregion