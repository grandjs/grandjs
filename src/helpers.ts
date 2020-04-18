/*=========================================================
Grand js helper functions file

# Author Tarek Salem
=========================================================
*/

// Dependencies
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import crypto from "crypto";
import confg from "./config";
import {Duplex} from 'stream';
import Request from "./Request";
import Response from "./Response";
import querystring from "querystring";
import qs from "qs";
import proxyaddr from "proxy-addr";
import contentType from "content-type";
import {OptionalObject,NodeInterface} from "./interfaces/index";
// end dependencies


// define helpers object
const helpers = {
    hash: function(string:string) {
        if (typeof string === "string" && string.length > 0) {
            let hash = crypto.createHmac("sha256", "hashPassowrd").update(string).digest();
            return hash;
        } else {
            return false;
        }
    },
    enCrypt: function(text:string) {
        var IV_LENGTH = 16; // For AES, this is always 16
        var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    },
    deCrypt: function(text:string) {
        var IV_LENGTH = 16; // For AES, this is always 16
        var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
    parseCookies: function(request:Request) {
        var list:any = {},
            rc = request.headers.cookie;
        rc && rc.split(';').forEach(function(cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list;
    },
    render: function(options:any) {
        let data = options.data ? options.data : {};
        let layout = options.layout;
        let container = options.container || "views"
        let body:any = options.body ? fs.readFileSync(`${container}/${options.body}`, "utf8") : "<body></body>";
        body = handlebars.compile(body, { strict: false });
        body = body(data);
        data.body = body;
        let req = options.req;
        let res = options.res;
        let partials = options.partials ? options.partials : [];
        if (partials.length > 0) {
            partials.forEach(function(partial:any) {
                let partialName = path.basename(partial).split(".")[0];
                var partialFile = fs.readFileSync(`${container}/${partial}`, "utf8");
                handlebars.registerPartial(partialName, partialFile);
            })
        }
        // try {
        var htmlFile:any = fs.readFileSync(`${container}/${layout}`, "utf8");
        if (htmlFile) {
            htmlFile = handlebars.compile(htmlFile, { strict: false });
            htmlFile = htmlFile(data);
            res.end(htmlFile);
        }
        // } catch (e) {
        res.writeHead(200);
        res.end("");
        // }
    },
    json: function(res:Response, data:object) {
        let result = JSON.stringify(data);
        res.end(result);
    },
    sendFile: function(req:Request, res:Response, file:any, cb:Function) {
        var mimeTypes:any = confg.mimeTypes;
        var fileSource = path.join(process.cwd(), file);
        fs.exists(fileSource, function(exist) {
            if (exist) {
                var headers = { "content-type": mimeTypes[path.extname(file)] };
                var fileStream = fs.createReadStream(fileSource);
                res.writeHead(200, headers);
                fileStream.pipe(res);
                return cb(true);
            } else {
                return cb(false)
            }
        })
    },
    bufferToStream: function (buffer:any) {
        let stream = new Duplex();
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
    handlebars: handlebars,
    compileETag: function(val:any) {
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
      compileQueryParser: function(val:any) {
        var fn;

        if (typeof val === 'function') {
          return val;
        }

        switch (val) {
          case true:
            fn = querystring.parse;
            break;
          case false:
            fn = helpers.newObject;
            break;
          case 'extended':
            fn = helpers.parseExtendedQueryString;
            break;
          case 'simple':
            fn = querystring.parse;
            break;
          default:
            throw new TypeError('unknown value for query parser function: ' + val);
        }
        return fn;
    },
    parseExtendedQueryString: function(str:string) {
        return qs.parse(str, {
          allowPrototypes: true
        });
      },
    newObject: function() {
        return {};
    },
    compileTrust: function (val:any) {
        if (typeof val === 'function') return val;

        if (val === true) {
          // Support plain true/false
          return function(){ return true };
        }

        if (typeof val === 'number') {
          // Support trusting hop count
          return function(a:any, i:any){ return i < val };
        }

        if (typeof val === 'string') {
          // Support comma-separated values
          val = val.split(/ *, */);
        }

        return proxyaddr.compile(val || []);
      },
      setCharset(type:string, charset:any) {
        if (!type || !charset) {
          return type;
        }

        // parse type
        var parsed = contentType.parse(type);

        // set charset
        parsed.parameters.charset = charset;

        // format type
        return contentType.format(parsed);
      }
};


export default helpers;
module.exports = helpers;
