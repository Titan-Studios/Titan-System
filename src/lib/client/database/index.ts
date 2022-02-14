//#region Dependencies
import * as MongoDB from 'mongodb';
import * as Data from '../../data';
//#endregion


//#region Database Connection
let client: MongoDB.MongoClient;

export const connect = () => new Promise<void>((resolve, reject) => {
    const uri = Data.ENV.DATABASE.BOT.CONNECTION_STRING;

    client = new MongoDB.MongoClient(uri);

    client.connect().then(() => {
        console.log('[Database] Connected');
        resolve();
    }).catch((error) => console.log('[Database] Error :: ' + error));
});

export const get = (collection: ('guilds' | 'channels' | 'profiles' | 'client'), name: ('client' | 'titanbot' | 'website')): MongoDB.Collection => client.db(name).collection(collection);
//#endregion