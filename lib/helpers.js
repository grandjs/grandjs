"use strict";
/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: Package Helpers
 * ==============================================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("./config"));
const stream_1 = require("stream");
const querystring_1 = __importDefault(require("querystring"));
const qs_1 = __importDefault(require("qs"));
const proxy_addr_1 = __importDefault(require("proxy-addr"));
const content_type_1 = __importDefault(require("content-type"));
const util_1 = __importDefault(require("util"));
// end dependencies
// define helpers object
const helpers = {
    Cipher: {
        hash: function (string) {
            if (typeof string === "string" && string.length > 0) {
                let hash = crypto_1.default.createHmac("sha256", "hashPassowrd").update(string).digest().toString("hex");
                return hash;
            }
            else {
                return "";
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
        }
    },
    parseCookies: function (request) {
        var list = {}, rc = request.headers.cookie;
        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list;
    },
    // render: function (options: any) {
    //   let data = options.data ? options.data : {};
    //   let layout = options.layout;
    //   let container = options.container || "views"
    //   let body: any = options.body ? fs.readFileSync(`${container}/${options.body}`, "utf8") : "<body></body>";
    //   body = handlebars.compile(body, { strict: false });
    //   body = body(data);
    //   data.body = body;
    //   let req = options.req;
    //   let res = options.res;
    //   let partials = options.partials ? options.partials : [];
    //   if (partials.length > 0) {
    //     partials.forEach(function (partial: any) {
    //       let partialName = path.basename(partial).split(".")[0];
    //       var partialFile = fs.readFileSync(`${container}/${partial}`, "utf8");
    //       handlebars.registerPartial(partialName, partialFile);
    //     })
    //   }
    //   // try {
    //   var htmlFile: any = fs.readFileSync(`${container}/${layout}`, "utf8");
    //   if (htmlFile) {
    //     htmlFile = handlebars.compile(htmlFile, { strict: false });
    //     htmlFile = htmlFile(data);
    //     res.end(htmlFile);
    //   }
    //   // } catch (e) {
    //   res.writeHead(200);
    //   res.end("");
    //   // }
    // },
    json: function (res, data) {
        let result = JSON.stringify(data);
        res.end(result);
    },
    sendFile: function (req, res, file) {
        var mimeTypes = config_1.default.mimeTypes;
        var fileSource = path_1.default.join(process.cwd(), file);
        fs_1.default.exists(fileSource, function (exist) {
            if (exist) {
                var headers = { "content-type": mimeTypes[path_1.default.extname(file)] };
                var fileStream = fs_1.default.createReadStream(fileSource);
                res.writeHead(200, headers);
                fileStream.pipe(res);
                return res;
            }
            else {
                throw new Error("file not found");
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
    },
    validation: {
        strip_html_tags: function (str) {
            if ((str === null) || (str === ''))
                return false;
            else
                str = str.toString();
            return str.replace(/<[^>]*>/g, '');
        },
        // validate the email
        checkEmail: function (string, cb) {
            var elementVal = string;
            elementVal = elementVal.trim();
            var regEx = new RegExp("@", "gi");
            if (elementVal !== "" || elementVal.length < 1) {
                if (cb) {
                    var test = regEx.test(elementVal);
                    return cb(test);
                }
                else {
                    return regEx.test(elementVal);
                }
            }
        },
        notEmptyString: function (string, cb) {
            let elementVal = string !== undefined ? string : "";
            elementVal = elementVal.trim();
            if (elementVal === "" || elementVal.length < 1) {
                if (!cb) {
                    return false;
                }
                if (cb) {
                    var empty = false;
                    return cb(empty);
                }
            }
            else {
                if (cb) {
                    return cb(elementVal);
                }
                else {
                    return elementVal;
                }
            }
        },
        // method to check if the value is contains a number
        checkContainsNumber: function (string, count, cb) {
            let elementVal = string.trim();
            if (typeof count === "function" && !cb) {
                cb = count;
            }
            count = typeof count === "number" ? count : 1;
            var numArr = [];
            if (elementVal !== "" || elementVal.length < 1) {
                Array.from(elementVal).forEach(function (letter) {
                    if (Number.isInteger(Number(letter))) {
                        numArr.push(letter);
                    }
                });
                if (numArr.length === count) {
                    let result = true;
                    if (cb) {
                        return cb(result);
                    }
                    else {
                        return result;
                    }
                }
                else {
                    let result = false;
                    if (cb) {
                        return cb(result);
                    }
                    else {
                        return result;
                    }
                }
            }
        },
        // method to check if the input is Object
        isObject: function (obj) {
            if (typeof obj == "object") {
                return obj;
            }
            else {
                return false;
            }
        },
        // method to check if the object is not empty
        notEmpty: function (obj) {
            if (Object.keys(obj).length > 0) {
                return obj;
            }
            else {
                return false;
            }
        },
        // method to check if the input is string
        isString: function (str) {
            if (typeof str === "string") {
                return str;
            }
            else {
                return false;
            }
        },
        // method to check if the input is number
        checkIsNumber: function (element, cb) {
            let elementVal = element;
            if (elementVal !== "") {
                var testNumber = Number.isInteger(Number(elementVal));
                if (cb) {
                    return cb(testNumber);
                }
                else {
                    return testNumber;
                }
            }
        }
    },
    serveAssets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let staticFolder = this.staticFolder;
                if (staticFolder) {
                    let sourceFolder = path_1.default.resolve("/", staticFolder.path);
                    let pathname = req.pathname.split(staticFolder.url)[1];
                    let mimeTypes = config_1.default.mimeTypes;
                    let dirName = path_1.default.join("", `${sourceFolder}`);
                    let fileSource;
                    fileSource = path_1.default.join(staticFolder.path, pathname);
                    fileSource = fileSource.split(path_1.default.sep).join("/");
                    let promisifiedState = util_1.default.promisify(fs_1.default.lstat);
                    let fileState = (yield promisifiedState(fileSource));
                    if (fileState.isFile()) {
                        let fileStream = fs_1.default.createReadStream(fileSource);
                        let extName = path_1.default.extname(pathname);
                        let headers = {
                            "Content-Type": mimeTypes[extName] || 'application/octet-stream',
                            // 'Cache-Control': `public, max-age=${cacheControl || 'no-cache'}`,
                            'Content-Length': fileState.size
                        };
                        res.writeHead(200, headers);
                        return fileStream.pipe(res);
                    }
                    else {
                        if (this.chooseHandler) {
                            return this.chooseHandler.bind(this)(req, res);
                        }
                        else {
                            res.statusCode = 404;
                            return this.errorPage(req, res);
                        }
                    }
                }
                else {
                    if (this.chooseHandler) {
                        return this.chooseHandler.bind(this)(req, res);
                    }
                    else {
                        res.statusCode = 404;
                        return this.errorPage(req, res);
                    }
                }
            }
            catch (err) {
                if (this.chooseHandler) {
                    return this.chooseHandler.bind(this)(req, res);
                }
                else {
                    res.statusCode = 404;
                    return this.errorPage(req, res);
                }
            }
        });
    },
    assignPrototype(target, instance) {
        let instancePrototype = instance.prototype;
        let targetPrototype = target;
        let execluded = ["globalMiddleWares", "getRouters", "postRouters", "deleteRouters", "putRouters", "patchRouters", "cors", "req", "request", "res", "response", "child", "base", "errorPage", "useRouter"];
        Object.keys(instancePrototype).map((key) => {
            if (!targetPrototype[key] && !execluded.includes(key)) {
                targetPrototype[key] = instancePrototype[key];
            }
        });
    }
};
exports.default = helpers;
module.exports = helpers;
