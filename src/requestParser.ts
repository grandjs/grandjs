/**
 * ============================================
 * @GrandJs file role: Request Body Parser
 * ============================================
 */
// dependencies
import multiparty from "multiparty";
import MiddeWare from "./MiddleWare";
import Path from "path";
import helpers from "./helpers";
import config from "./config";
import Request from "./Request";
import Response from "./Response"
import Route from "./Route";
import {OptionalObject} from "./interfaces/index";
import querystring from "querystring";
config.reverseMimeTypes();

//  define request parser class
class RequestParser {
  req:Request;
  res:Response
  supportedTypes: {[key:string]:Function}
    constructor(req:Request, res:Response) {
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
    handler(matchedRoute:Route, req:Request, res:Response) {
            // check on the request type
            let headers = req.headers;
            headers["content-type"] = headers["content-type"] || "any";
            if (headers["content-type"]) {
                let contentType = headers["content-type"].split(";")[0] || "";
                contentType = contentType.toLowerCase();
                let requestParser = this.supportedTypes[contentType];
                // check if the content type matches one of supported request type
                if (requestParser) {
                    return requestParser.bind(this)(matchedRoute, req, res);
                } else {
                    req.data = {};
                    req.files = {};
                    req.body = {};
                }
            } else {
                req.data = {};
                req.files = {};
                req.body = {};
                return MiddeWare.next(matchedRoute, req, res);
            }
        }
        // method to parse form url encode
    parseFormUrlEncode(matchedRoute:Route, req:Request, res:Response) {
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
                    req.body = data;
                } catch (err) {
                    req.data = data;
                    req.body = data;
                }
                req.files = files;
                return MiddeWare.next(matchedRoute, req, res);
            });
        }
        // method to parse formdata request
    parseFormData(matchedRoute:Route, req:Request, res:Response) {
            let form = new multiparty.Form();
            let data:OptionalObject = {};
            let files:OptionalObject = {};
            form.on("error", (err) => {
                req.data = {};
                req.files = {};
                req.body = {};
                return res.end();
            })
            form.on("part", part => {
                let contentBuffer:any[] = [];
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
                req.body = data;
                return MiddeWare.next(matchedRoute, req, res);
            })
            form.parse(req);
        }
        // method to parse text data
    parseText(matchedRoute:Route, req:Request, res:Response) {
            let headers = req.headers;
            let comingData = "";
            let data:OptionalObject = {};
            let files:OptionalObject = {};
            req.on("data", function(data) {
                comingData += data;
            });
            return req.on("end", () => {
                try {
                    if (comingData.length > 0) {
                        data = JSON.parse(comingData);
                    }
                    req.data = data;
                    req.body = data;
                } catch (err) {
                    req.data = data;
                    req.body = data;
                }
                req.files = files;
                return MiddeWare.next(matchedRoute, req, res);
            });
        }
        // method to parse json
    parseJson(matchedRoute:Route, req:Request, res:Response) {
        let headers = req.headers;
        let comingData = "";
        let data:OptionalObject = {};
        let files:OptionalObject = {};
        req.on("data", function(data) {
            comingData += data;
        });
        return req.on("end", () => {
            try {
                if (comingData.length > 0) {
                    data = JSON.parse(comingData);
                }
                req.data = data;
                req.body = data;
            } catch (err) {
                req.data = data;
                req.body = data;
            }
            req.files = files;
            return MiddeWare.next(matchedRoute, req, res);
        });
    }
}

//  export request parser
export default RequestParser;
