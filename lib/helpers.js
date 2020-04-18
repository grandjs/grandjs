"use strict";
/*=========================================================
Grand js helper functions file

# Author Tarek Salem
=========================================================
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("./config"));
const stream_1 = require("stream");
const querystring_1 = __importDefault(require("querystring"));
const qs_1 = __importDefault(require("qs"));
const proxy_addr_1 = __importDefault(require("proxy-addr"));
const content_type_1 = __importDefault(require("content-type"));
// end dependencies
// define helpers object
const helpers = {
    hash: function (string) {
        if (typeof string === "string" && string.length > 0) {
            let hash = crypto_1.default.createHmac("sha256", "hashPassowrd").update(string).digest();
            return hash;
        }
        else {
            return false;
        }
    },
    enCrypt: function (text) {
        var IV_LENGTH = 16; // For AES, this is always 16
        var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
        let iv = crypto_1.default.randomBytes(IV_LENGTH);
        let cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    },
    deCrypt: function (text) {
        var IV_LENGTH = 16; // For AES, this is always 16
        var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
    parseCookies: function (request) {
        var list = {}, rc = request.headers.cookie;
        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list;
    },
    render: function (options) {
        let data = options.data ? options.data : {};
        let layout = options.layout;
        let container = options.container || "views";
        let body = options.body ? fs_1.default.readFileSync(`${container}/${options.body}`, "utf8") : "<body></body>";
        body = handlebars_1.default.compile(body, { strict: false });
        body = body(data);
        data.body = body;
        let req = options.req;
        let res = options.res;
        let partials = options.partials ? options.partials : [];
        if (partials.length > 0) {
            partials.forEach(function (partial) {
                let partialName = path_1.default.basename(partial).split(".")[0];
                var partialFile = fs_1.default.readFileSync(`${container}/${partial}`, "utf8");
                handlebars_1.default.registerPartial(partialName, partialFile);
            });
        }
        // try {
        var htmlFile = fs_1.default.readFileSync(`${container}/${layout}`, "utf8");
        if (htmlFile) {
            htmlFile = handlebars_1.default.compile(htmlFile, { strict: false });
            htmlFile = htmlFile(data);
            res.end(htmlFile);
        }
        // } catch (e) {
        res.writeHead(200);
        res.end("");
        // }
    },
    json: function (res, data) {
        let result = JSON.stringify(data);
        res.end(result);
    },
    sendFile: function (req, res, file, cb) {
        var mimeTypes = config_1.default.mimeTypes;
        var fileSource = path_1.default.join(process.cwd(), file);
        fs_1.default.exists(fileSource, function (exist) {
            if (exist) {
                var headers = { "content-type": mimeTypes[path_1.default.extname(file)] };
                var fileStream = fs_1.default.createReadStream(fileSource);
                res.writeHead(200, headers);
                fileStream.pipe(res);
                return cb(true);
            }
            else {
                return cb(false);
            }
        });
    },
    bufferToStream: function (buffer) {
        let stream = new stream_1.Duplex();
        stream.push(buffer);
        stream.push(null);
        return stream;
    },
    warnings: {
        router: {
            called: false,
            text: "Grandjs Routers not will be working with just instantiating the router, you need to call `build()` method after instantiating the router to make it works"
        }
    },
    handlebars: handlebars_1.default,
    compileETag: function (val) {
        var fn;
        if (typeof val === 'function') {
            return val;
        }
        switch (val) {
            case true:
                fn = exports.wetag;
                break;
            case false:
                break;
            case 'strong':
                fn = exports.etag;
                break;
            case 'weak':
                fn = exports.wetag;
                break;
            default:
                throw new TypeError('unknown value for etag function: ' + val);
        }
        return fn;
    },
    compileQueryParser: function (val) {
        var fn;
        if (typeof val === 'function') {
            return val;
        }
        switch (val) {
            case true:
                fn = querystring_1.default.parse;
                break;
            case false:
                fn = helpers.newObject;
                break;
            case 'extended':
                fn = helpers.parseExtendedQueryString;
                break;
            case 'simple':
                fn = querystring_1.default.parse;
                break;
            default:
                throw new TypeError('unknown value for query parser function: ' + val);
        }
        return fn;
    },
    parseExtendedQueryString: function (str) {
        return qs_1.default.parse(str, {
            allowPrototypes: true
        });
    },
    newObject: function () {
        return {};
    },
    compileTrust: function (val) {
        if (typeof val === 'function')
            return val;
        if (val === true) {
            // Support plain true/false
            return function () { return true; };
        }
        if (typeof val === 'number') {
            // Support trusting hop count
            return function (a, i) { return i < val; };
        }
        if (typeof val === 'string') {
            // Support comma-separated values
            val = val.split(/ *, */);
        }
        return proxy_addr_1.default.compile(val || []);
    },
    setCharset(type, charset) {
        if (!type || !charset) {
            return type;
        }
        // parse type
        var parsed = content_type_1.default.parse(type);
        // set charset
        parsed.parameters.charset = charset;
        // format type
        return content_type_1.default.format(parsed);
    }
};
exports.default = helpers;
module.exports = helpers;
