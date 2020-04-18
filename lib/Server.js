"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const url_pattern_1 = __importDefault(require("url-pattern"));
const Request_1 = __importDefault(require("./Request"));
const Response_1 = __importDefault(require("./Response"));
const helpers_1 = __importDefault(require("./helpers"));
const MiddleWare_1 = __importDefault(require("./MiddleWare"));
const requestParser_1 = __importDefault(require("./requestParser"));
let trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';
class BaseServer {
    constructor() {
        this.routers = new Map();
        this.serverOptions = {};
        this.locals = Object.create({});
        this.settings = {};
        this.engines = {};
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
            if (regexResult && typeof regexResult._ === "string" && !regexResult._.includes(item)) {
                let split = req.pathname.replace(regexResult._, "");
                let splittedPath = regexResult._.split("/");
                let foundRouter = this.routers.get(item);
                if (foundRouter) {
                    if (splittedPath.length > 1) {
                        requests.push(foundRouter);
                        // } else if(splittedPath.length === 1) {
                        //     let trimmed = `${splittedPath[0]}`.replace(/\s+/gi, "");
                        //     if(trimmed.length === 0) {
                        //         requests.push(foundRouter);
                        //     }
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
        this.serverOptions.staticFolder = this.serverOptions.staticFolder || { path: path_1.default.join(process.cwd(), "/public"), url: "/public" };
        this.serverOptions.nativeParsing = this.serverOptions.nativeParsing || false;
        this.settings = Object.assign(this.settings, this.serverOptions);
        this.errorPage = this.serverOptions.errorPage || this.errorPage;
        return this;
    }
    // initializer
    initServer() {
        this.Server = this.serverOptions.http.createServer((req, res) => {
            // instantiate new request
            let request = new Request_1.default(req.socket, req, this);
            this.RequestParser = new requestParser_1.default(req, res);
            // instantiate new response
            let BindResponse = new Response_1.default(request, res);
            this.chooseHandler(request, res);
        });
        this.Server.listen(this.serverOptions.port);
        return this;
    }
    engine(ext, fn) {
        if (typeof fn !== 'function') {
            throw new Error('callback function required');
        }
        // get file extension
        var extension = ext[0] !== '.'
            ? '.' + ext
            : ext;
        // [extension] = fn;
        Object.defineProperty(this.engines, extension, {
            value: fn,
            enumerable: true,
            writable: true,
            configurable: true,
        });
        this.engines;
        return this;
    }
    ;
    set(setting, val) {
        if (arguments.length === 1) {
            // app.get(setting)
            if (Object.getOwnPropertyDescriptor(this.settings, setting)) {
                return Object.getOwnPropertyDescriptor(this.settings, setting).value;
            }
        }
        // set value
        Object.defineProperty(this.settings, setting, {
            value: val,
            enumerable: true,
            writable: true,
            configurable: true,
        });
        // trigger matched settings
        switch (setting) {
            case 'etag':
                this.set('etag fn', helpers_1.default.compileETag(val));
                break;
            case 'query parser':
                this.set('query parser fn', helpers_1.default.compileQueryParser(val));
                break;
            case 'trust proxy':
                this.set('trust proxy fn', helpers_1.default.compileTrust(val));
                // trust proxy inherit back-compat
                Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
                    configurable: true,
                    value: false
                });
                break;
        }
        return this;
    }
    ;
    get(setting) {
        if (Object.getOwnPropertyDescriptor(this.settings, setting)) {
            return Object.getOwnPropertyDescriptor(this.settings, setting).value;
        }
        else {
            return;
        }
    }
    path() {
        return this.parent
            ? this.parent.path() + this.mountPath
            : '';
    }
    ;
    enabled(setting) {
        return Boolean(this.set(setting));
    }
    ;
    disabled(setting) {
        return !this.set(setting);
    }
    ;
    enable(setting) {
        return this.set(setting, true);
    }
    ;
    disable(setting) {
        return this.set(setting, false);
    }
    ;
    logerror(err) {
        /* istanbul ignore next */
        if (this.get('env') !== 'test')
            console.error(err.stack || err.toString());
    }
}
exports.BaseServer = BaseServer;
const Server = new BaseServer();
exports.Server = Server;
