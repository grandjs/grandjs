"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_pattern_1 = __importDefault(require("url-pattern"));
const MiddleWare_1 = __importDefault(require("./MiddleWare"));
const cors_1 = __importDefault(require("cors"));
class Route {
    // parseUrl?():any
    constructor(options, base) {
        this.assetsPath = false;
        this.url = options.url;
        this.method = options.method.toLowerCase();
        this.handler = options.handler;
        this.middleWares = options.middleWares || [];
        this.cors = options.cors || {};
        this.base = base;
        this.assetsPath = options.assetsPath || false;
        this.parseUrl();
    }
    // method to parse url
    parseUrl() {
        this.url = `${this.base}/${this.url}`.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
            .replace(/^(.+?)\/*?$/, "$1")
            .replace(/\s+/gi, "");
        let routePattern = new url_pattern_1.default(this.url);
        let values = [];
        let joinedValues;
        routePattern.ast.map((tag) => {
            values.push(tag.value);
        });
        joinedValues = values.join("");
        joinedValues = joinedValues.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
            .replace(/^(.+?)\/*?$/, "$1");
        this.parsedUrl = joinedValues;
        this.routePattern = routePattern;
    }
    // method to set cors
    setCors(corsObject) {
        this.cors = corsObject;
        function corsMiddleWare(req, res, next) {
            return cors_1.default(this.cors)(req, res, next);
        }
        this.middleWares.unshift(corsMiddleWare);
    }
    // method to handle the route request
    handle(options) {
        if (options.Router) {
            // check if there is native parsing or not
            if (options.Router.serverOptions.nativeParsing === true) {
                if (this.method === "get") {
                    return MiddleWare_1.default.next(this, options.req, options.res);
                }
                else {
                    return options.Router.requestParser.handler(this, options.req, options.res);
                }
            }
            else {
                // continue to next middleware
                return MiddleWare_1.default.next(this, options.req, options.res);
            }
        }
        else {
            return MiddleWare_1.default.next(this, options.req, options.res);
        }
    }
}
exports.default = Route;
