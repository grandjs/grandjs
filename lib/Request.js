"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const accepts_1 = __importDefault(require("accepts"));
const range_parser_1 = __importDefault(require("range-parser"));
const type_is_1 = __importDefault(require("type-is"));
const helpers_1 = __importDefault(require("./helpers"));
class Request extends http_1.default.IncomingMessage {
    constructor(socket, request, Server) {
        // Object.assign(this, request);
        super(socket);
        this.validation = helpers_1.default.validation;
        this.acceptsEncodings = function () {
            var accept = accepts_1.default(this);
            return accept.encodings.apply(accept, arguments);
        };
        this.acceptsCharsets = function () {
            var accept = accepts_1.default(this);
            return accept.charsets.apply(accept, arguments);
        };
        this.acceptsLanguages = function () {
            var accept = accepts_1.default(this);
            return accept.languages.apply(accept, arguments);
        };
        Object.assign(this, request);
        this.body = this.body || {};
        this.data = this.data || {};
        this.files = this.files || {};
        this.Server = Server;
        this.parseUrl();
    }
    parseUrl() {
        let url = url_1.default.parse(this.url, true);
        url.path = url.path
            .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
            .replace(/^(.+?)\/*?$/, '$1');
        url.href = url.href
            .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
            .replace(/^(.+?)\/*?$/, '$1');
        let pathname = url.pathname
            .trim()
            .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
            .replace(/^(.+?)\/*?$/, '$1');
        this.pathname = pathname;
        this.href = url.href;
        this.method = this.method.toLowerCase();
        this.query = url.query || {};
        this.params = {};
        this.path = url.path;
        this.parsedUrl = url;
    }
    // accepts
    accepts() {
        let accept = accepts_1.default(this);
        return accept.types.apply(accept, arguments);
    }
    range(size, options) {
        var range = this.header('Range');
        if (!range)
            return;
        return range_parser_1.default(size, range, options);
    }
    header(name) {
        if (!name) {
            throw new TypeError('name argument is required to req.get');
        }
        if (typeof name !== 'string') {
            throw new TypeError('name must be a string to req.get');
        }
        var lc = name.toLowerCase();
        switch (lc) {
            case 'referer':
            case 'referrer':
                return this.headers.referrer || this.headers.referer;
            default:
                return this.headers[lc];
        }
    }
    is(types) {
        var arr = types;
        if (!Array.isArray(types)) {
            arr = new Array(arguments.length);
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arguments[i];
            }
        }
        return type_is_1.default(this, arr);
    }
    ;
    xhr() {
        var val = this.header('X-Requested-With') || '';
        return val.toLowerCase() === 'xmlhttprequest';
    }
    ;
}
exports.default = Request;
