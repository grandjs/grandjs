"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: Application Router
 * ==============================================================================
 */
const http_1 = __importDefault(require("http"));
const url_pattern_1 = __importDefault(require("url-pattern"));
// import {compile} from  "util";
const config_1 = __importDefault(require("./config"));
const Request_1 = __importDefault(require("./Request"));
const Response_1 = __importDefault(require("./Response"));
const MiddleWare_1 = __importDefault(require("./MiddleWare"));
const requestParser_1 = __importDefault(require("./requestParser"));
let trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';
class BaseServer {
    constructor() {
        this.routers = new Map();
        this.serverOptions = {};
        this.locals = new Map();
        this.settings = new Map();
        this.engines = new Map();
        this.cache = {};
        this.middleWares = [];
    }
    errorPage(req, res) {
        return res.status(404).end("not found route");
    }
    use(func) {
        this.middleWares.push(func);
        return this;
    }
    log(req, res) {
        throw new Error("Method not implemented.");
    }
    chooseHandler(req, res) {
        let requests = [];
        Array.from(this.routers.keys()).map((item) => {
            let routerRegex = new url_pattern_1.default(`${item}*`);
            let regexResult = routerRegex.match(req.pathname);
            if (regexResult && typeof regexResult._ === "string" && ((regexResult._.startsWith("/") || regexResult._.length === 0) || item === "/")) {
                let split = req.pathname.replace(regexResult._, "");
                let splittedPath = regexResult._.split("/");
                let foundRouter = this.routers.get(item);
                if (foundRouter) {
                    if (splittedPath.length > 1) {
                        requests.push(foundRouter);
                    }
                    else if (split === item || routerRegex.match(split)) {
                        requests.push(foundRouter);
                    }
                }
            }
        });
        requests.sort((a, b) => {
            if (a.base.length > b.base.length) {
                return 1;
            }
            else {
                return -1;
            }
        });
        let matchedRouter = requests[requests.length > 1 ? requests.length - 1 : 0];
        ;
        if (matchedRouter) {
            matchedRouter.requestParser = this.RequestParser;
            matchedRouter.req = req;
            matchedRouter.res = res;
            matchedRouter.serverOptions = Object.assign(matchedRouter.serverOptions, this.serverOptions);
            let allMiddleWares = [matchedRouter.corsMiddleWare.bind(matchedRouter), ...this.middleWares, ...matchedRouter.globalMiddleWares];
            if (allMiddleWares.length > 0) {
                // call middleware handler
                return MiddleWare_1.default.handleRoutersMiddleWares(req, res, allMiddleWares, matchedRouter, this);
            }
            else {
                // initialize router
                matchedRouter.init();
            }
        }
        else {
            res.status(404);
            this.errorPage(req, res);
        }
    }
    setConfig(options) {
        this.serverOptions = options || {};
        this.serverOptions.http = this.serverOptions.http || http_1.default;
        this.serverOptions.port = this.serverOptions.port || 3000;
        this.serverOptions.staticFolder = this.serverOptions.staticFolder;
        //  || { path: path.join(process.cwd(), "/public"), url: "/public" };
        this.serverOptions.ENCRYPTION_KEY = this.serverOptions.ENCRYPTION_KEY || "ncryptiontestforencryptionproces";
        process.env.ENCRYPTION_KEY = this.serverOptions.ENCRYPTION_KEY;
        this.serverOptions.nativeParsing = this.serverOptions.nativeParsing || false;
        this.settings = Object.assign(this.settings, this.serverOptions);
        this.errorPage = this.serverOptions.errorPage || this.errorPage;
        return this;
    }
    // initializer
    initServer(cb) {
        let args = [];
        let callBack = (req, res) => {
            // instantiate new request
            let request = new Request_1.default(req.socket, req, this);
            this.RequestParser = new requestParser_1.default(req, res);
            // instantiate new response
            let BindResponse = new Response_1.default(request, res);
            this.chooseHandler(request, res);
        };
        if (this.serverOptions.httpsMode) {
            args[0] = this.serverOptions.httpsMode;
            args[1] = callBack;
        }
        else {
            args[0] = callBack;
        }
        this.Server = this.serverOptions.http.createServer(...args);
        this.Server.listen(this.serverOptions.port, () => {
            if (cb) {
                return cb();
            }
        });
        return this;
    }
    path() {
        return this.parent
            ? this.parent.path() + this.mountPath
            : '';
    }
    addMimeTypes(extention, mimeType) {
        try {
            config_1.default.extenstions.push(extention);
            config_1.default.mimeTypes[extention] = mimeType;
            return this;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.BaseServer = BaseServer;
const Server = new BaseServer();
exports.Server = Server;
