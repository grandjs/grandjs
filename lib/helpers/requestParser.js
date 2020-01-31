/**
 * ============================================
 * @GrandJs file role: Request Body Parser
 * ============================================
 */
// dependencies
const multiparty = require("multiparty");
const MiddeWares = require("./middlewares");
const Path = require("path");
const helpers = require("./helpers");
const config = require("./config");
config.reverseMimeTypes();

//  define request parser class
class RequestParser {
    constructor(req, res) {
            this.req = req;
            this.res = res;
            // define array of supported types
            this.supportedTypes = {
                "application/json": this.parseJson,
                "application/x-www-form-urlencoded": this.parseFormUrlEncode,
                "text/plain": this.parseText,
                "multipart/form-data": this.parseFormData,
                "any": this.parseJson
            };
        }
        // method to handle the coming request data
    handler(matchedURL, req, res) {
            // check on the request type
            let headers = req.headers;
            headers["content-type"] = headers["content-type"] || "any";
            if (headers["content-type"]) {
                let contentType = headers["content-type"].split(";")[0] || "";
                contentType = contentType.toLowerCase();
                let requestParser = this.supportedTypes[contentType];
                // check if the content type matches one of supported request type
                if (requestParser) {
                    return requestParser.bind(this)(matchedURL, req, res);
                } else {
                    req.data = {};
                    req.files = {};
                }
            } else {
                req.data = {};
                req.files = {};
                return MiddeWares.next(matchedURL, req, res);
            }
        }
        // method to parse form url encode
    parseFormUrlEncode(matchedURL, req, res) {
            let headers = req.headers;
            let comingData = "";
            let data = {};
            let files = {};
            req.on("data", function(data) {
                comingData += data;
            });
            return req.on("end", () => {
                try {
                    if (comingData.length > 0) {
                        data = querystring.parse(comingData);
                    }
                    req.data = data;
                } catch (err) {
                    req.data = data;
                }
                req.files = files;
                return MiddeWares.next(matchedURL, req, res);
            });
        }
        // method to parse formdata request
    parseFormData(matchedURL, req, res) {
            let form = new multiparty.Form();
            let data = {};
            let files = {};
            form.on("error", (err) => {
                req.data = {};
                req.files = {};
                return res.end();
            })
            form.on("part", part => {
                let contentBuffer = [];
                let totalBytesInBuffer = 0;
                part.on("data", chunk => {
                    contentBuffer.push(chunk);
                    totalBytesInBuffer += chunk.length;
                });
                part.on("end", () => {
                    let buf = Buffer.concat(contentBuffer, totalBytesInBuffer);
                    // check if the part is file
                    if (part.filename) {
                        let inputName = part.name;
                        let filename = part.filename;
                        part.headers['content-type'] = part.headers["content-type"] || "";
                        let file = {
                            name: inputName,
                            filename: filename,
                            data: buf,
                            size: totalBytesInBuffer,
                            extension: config.reversedMimeTypes[part.headers["content-type"]],
                            mimetype: part.headers["content-type"],
                            stream: helpers.bufferToStream(buf)
                        };
                        file = Object.assign(file, part);
                        if (files[inputName]) {
                            if (Array.isArray(files[inputName])) {
                                files[inputName].push(file);
                            } else {
                                let prevData = files[inputName];
                                files[inputName] = []
                                files[inputName].push(prevData, file);
                            }
                        } else {
                            files[inputName] = file;
                        }
                    } else {
                        let inputName = part.name;
                        let value = buf.toString();
                        if (data[inputName]) {
                            if (Array.isArray(data[inputName])) {
                                data[inputName].push(value);
                            } else {
                                let prevData = data[inputName];
                                data[inputName] = []
                                data[inputName].push(prevData, value);
                            }
                        } else {
                            data[inputName] = value;
                        }
                    }
                });
                part.resume();
            });
            form.on("close", () => {
                req.files = files;
                req.data = data;
                return MiddeWares.next(matchedURL, req, res);
            })
            form.parse(req);
        }
        // method to parse text data
    parseText(matchedURL, req, res) {
            let headers = req.headers;
            let comingData = "";
            let data = {};
            let files = {};
            req.on("data", function(data) {
                comingData += data;
            });
            return req.on("end", () => {
                try {
                    if (comingData.length > 0) {
                        data = JSON.parse(comingData);
                    }
                    req.data = data;
                } catch (err) {
                    req.data = data;
                }
                req.files = files;
                return MiddeWares.next(matchedURL, req, res);
            });
        }
        // method to parse json
    parseJson(matchedURL, req, res) {
        let headers = req.headers;
        let comingData = "";
        let data = {};
        let files = {};
        req.on("data", function(data) {
            comingData += data;
        });
        return req.on("end", () => {
            try {
                if (comingData.length > 0) {
                    data = JSON.parse(comingData);
                }
                req.data = data;
            } catch (err) {
                req.data = data;
            }
            req.files = files;
            return MiddeWares.next(matchedURL, req, res);
        });
    }
}

//  export request parser
module.exports = RequestParser;