"use strict";
exports.__esModule = true;
exports.post = exports.get = exports.request = void 0;
var http = require("http");
var https = require("https");
;
var request = function (url, requestOptions, data) {
    if (requestOptions === void 0) { requestOptions = {}; }
    return new Promise(function (resolve, reject) {
        if (typeof url === 'string')
            url = new URL(url);
        requestOptions.host = url.hostname;
        requestOptions.path = url.pathname + (url.search || '');
        var request;
        switch (url.protocol) {
            default:
                reject("Unknown protocol: " + url.protocol);
                break;
            case 'http:':
                request = http.request(requestOptions, function (response) {
                    response.setEncoding('utf-8');
                    var body = '';
                    response.on('data', function (data) {
                        body += data;
                    });
                    response.on('end', function () {
                        resolve({
                            head: {
                                method: response.method,
                                headers: response.headers,
                                rawHeaders: response.rawHeaders,
                                statusCode: response.statusCode,
                                statusMessage: response.statusMessage
                            },
                            body: Buffer.from(body)
                        });
                    });
                });
                if (data)
                    request.write(data);
                request.end();
                break;
            case 'https:':
                request = https.request(requestOptions, function (response) {
                    response.setEncoding('utf-8');
                    var body = '';
                    response.on('data', function (data) {
                        body += data;
                    });
                    response.on('end', function () {
                        resolve({
                            head: {
                                method: response.method,
                                headers: response.headers,
                                rawHeaders: response.rawHeaders,
                                statusCode: response.statusCode,
                                statusMessage: response.statusMessage
                            },
                            body: Buffer.from(body)
                        });
                    });
                });
                if (data)
                    request.write(data);
                request.end();
                break;
        }
    });
};
exports.request = request;
var get = function (url, requestOptions, data) {
    if (requestOptions === void 0) { requestOptions = {}; }
    requestOptions.method = 'GET';
    return exports.request(url, requestOptions, data);
};
exports.get = get;
var post = function (url, requestOptions, data) {
    if (requestOptions === void 0) { requestOptions = {}; }
    requestOptions.method = 'POST';
    return exports.request(url, requestOptions, data);
};
exports.post = post;
