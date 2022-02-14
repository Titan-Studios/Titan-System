const http = require('http');
const https = require('https');

const protocolHandlers: any = {
    'http:': http,
    'https:': https
};

export const request = (url: string, options?: any, data?: any) => new Promise((resolve, reject) => {
    let parsedURL;
    try {
        parsedURL = new URL(url);
    } catch (error) {
        reject(error);
    }
    if (!options) options = { method: 'GET' };
    else if (!options.method) options.method = 'GET';
    let req = protocolHandlers[parsedURL.protocol].request(parsedURL, options, (res: any) => {
        if (options.method === 'HEAD') {
            resolve({
                head: {
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    headers: res.headers
                }
            });
            return;
        }
        res.setEncoding('utf-8');
        let buf = '';
        res.on('data', (chunk: any) => {
            buf += chunk;
        });
        res.on('end', () => {
            resolve({
                head: {
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    headers: res.headers
                },
                body: buf
            });
        });
        res.on('error', reject);
    });
    if (data) req.write(data);
    req.end();
});

export const post = (url: string, options?: any, data?: any) => {
    if (!options) options = { method: 'POST' };
    else if (!options.method) options.method = 'POST';
    return request(url, options, data);
};

export const put = (url: string, options?: any, data?: any) => {
    if (!options) options = { method: 'PUT' };
    else if (!options.method) options.method = 'PUT';
    return request(url, options, data);
};

export const head = (url: string, options?: any, data?: any) => {
    if (!options) options = { method: 'HEAD' };
    else if (!options.method) options.method = 'HEAD';
    return request(url, options, data);
};

export const get = request;