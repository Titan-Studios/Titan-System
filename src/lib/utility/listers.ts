//#region Dependencies
import * as path from 'path';
import * as fs from 'fs';
//#endregion

//#region Fetch File Paths
const root = path.resolve(__dirname, '../client');

export const fetchFilePaths = (rootDir: string, fileType: string = '.js'): string[] => {
    let filePaths: string[] = [];
    try {
        fs.readdirSync(rootDir).map(fileName => path.resolve(rootDir, fileName)).forEach(filePath => {
            if (fs.statSync(filePath).isDirectory()) filePaths.push(...fetchFilePaths(filePath));
            if (fileType == '.any') filePaths.push(filePath);
            else if (fileType != '.any' && filePath.endsWith(fileType)) filePaths.push(filePath);
        });
    } catch { }
    return filePaths;
};
//#endregion

//#region Command Lists
export const commandBaseList: CommandBaseList[] = [];
export const commandList: CommandList[] = [
    { id: 0, name: 'General', description: 'The basic general commands', emoji: '📄', commands: [] },
    { id: 1, name: 'Application', description: 'Simple & fun actions', emoji: '📧', commands: [] }
];
//#endregion

//#region Channel Lists
export const channelModuleList = fetchFilePaths(`${root}/channels`).reduce((map: any, channelFilePath) => { let channelModule = require(channelFilePath); map[channelModule.type] = channelModule; return map; }, {});
//#endregion

//#region Create Lists
const createLists = () => {
    const commandRawList = fetchFilePaths(`${root}/commands`).map(commandFilePath => require(commandFilePath));

    for (let i = 0; i < commandRawList.length; i++) {
        const a: CommandBaseList = commandRawList[i];
        commandBaseList.push(a);
        if (a.type != 'SLASH' && a.id <= 0.999 && a.id >= 0.001) commandList[0].commands.push(a); // General
        if (a.type != 'SLASH' && a.id <= 1.999 && a.id >= 1.001) commandList[1].commands.push(a); // Application
    }
}
createLists();
//#endregion