"use strict";
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
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const Server_1 = require("./Server");
const config_1 = __importDefault(require("./config"));
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
const Route_1 = __importDefault(require("./Route"));
const helpers_1 = __importDefault(require("./helpers"));
const common_1 = require("./common");
const url_pattern_1 = __importDefault(require("url-pattern"));
class Router {
    constructor(options) {
        this.child = false;
        this.resolveRoutesWithBase = () => {
            this.getRouters.forEach((obj) => {
                obj.url = path_1.default.join(this.base, obj.url);
                obj.url = obj.url.split(path_1.default.sep).join("/");
            });
            this.postRouters.forEach((obj) => {
                obj.url = path_1.default.join(this.base, obj.url);
                obj.url = obj.url.split(path_1.default.sep).join("/");
            });
            this.deleteRouters.forEach((obj) => {
                obj.url = path_1.default.join(this.base, obj.url);
                obj.url = obj.url.split(path_1.default.sep).join("/");
            });
            this.putRouters.forEach((obj) => {
                obj.url = path_1.default.join(this.base, obj.url);
                obj.url = obj.url.split(path_1.default.sep).join("/");
            });
            this.patchRouters.forEach((obj) => {
                obj.url = path_1.default.join(this.base, obj.url);
                obj.url = obj.url.split(path_1.default.sep).join("/");
            });
        };
        this.tempMiddleWares = this.tempMiddleWares || [];
        this.options = options || {};
        this.setBase();
        this.getRouters = this.getRouters || [];
        this.postRouters = this.postRouters || [];
        this.deleteRouters = this.deleteRouters || [];
        this.putRouters = this.putRouters || [];
        this.patchRouters = this.patchRouters || [];
        this.globalMiddleWares = this.globalMiddleWares || [];
        this.serverOptions = this.serverOptions || {};
        this.statics = this.statics || [];
        this.staticFolder = this.options.staticFolder || this.staticFolder;
        this.parseTempMiddleWares();
    }
    use(path, ...middleWares) {
        this.globalMiddleWares = this.globalMiddleWares || [];
        const pattern = new url_pattern_1.default(path);
        const applyMiddleWares = (comingMiddleWares) => {
            comingMiddleWares.map((func) => {
                const middleWare = (req, res, next) => {
                    if (pattern.match(req.pathname)) {
                        func(req, res, next);
                    }
                    else {
                        return next();
                    }
                };
                this.globalMiddleWares.push(middleWare);
            });
        };
        applyMiddleWares(middleWares);
        return this;
    }
    build() {
        this.id = Math.random().toString(36).substr(2, 9);
        if (!this.child) {
            Server_1.Server.routers.set(this.base, this);
        }
        this.errorPage = this.errorPage || Server_1.Server.errorPage;
        this.staticFolder = this.staticFolder || Server_1.Server.serverOptions.staticFolder;
        this.serverAssetsMiddleWare();
        this.bootstrapRoutes();
        return this;
    }
    // parsee temp middleWares
    parseTempMiddleWares() {
        this.tempMiddleWares.forEach((obj, i) => {
            const { options: { method, url } } = obj;
            let getRouters = [];
            let postRouters = [];
            let putRouters = [];
            let patchRouters = [];
            let deleteRouters = [];
            if (method === common_1.RequestMethod.ALL) {
                if (url === "*") {
                    this.globalMiddleWares.push(obj.middleWare);
                }
                else {
                    getRouters = this.getRouters.filter(route => route.url === url ? route : null);
                    postRouters = this.postRouters.filter(route => route.url === url ? route : null);
                    putRouters = this.putRouters.filter(route => route.url === url ? route : null);
                    patchRouters = this.patchRouters.filter(route => route.url === url ? route : null);
                    deleteRouters = this.deleteRouters.filter(route => route.url === url ? route : null);
                }
            }
            else {
                if (method === common_1.RequestMethod.GET) {
                    if (url === "*") {
                        getRouters = this.getRouters;
                    }
                    else {
                        getRouters = this.getRouters.filter(route => route.url === url ? route : null);
                    }
                }
                else if (method === common_1.RequestMethod.POST) {
                    if (url === "*") {
                        postRouters = this.postRouters;
                    }
                    else {
                        postRouters = this.postRouters.filter(route => route.url === url ? route : null);
                    }
                }
                else if (method === common_1.RequestMethod.PUT) {
                    if (url === "*") {
                        putRouters = this.putRouters;
                    }
                    else {
                        putRouters = this.putRouters.filter(route => route.url === url ? route : null);
                    }
                }
                else if (method === common_1.RequestMethod.PATCH) {
                    if (url === "*") {
                        patchRouters = this.patchRouters;
                    }
                    else {
                        patchRouters = this.patchRouters.filter(route => route.url === url ? route : null);
                    }
                }
                else if (method === common_1.RequestMethod.DELETE) {
                    if (url === "*") {
                        deleteRouters = this.deleteRouters;
                    }
                    else {
                        deleteRouters = this.deleteRouters.filter(route => route.url === url ? route : null);
                    }
                }
            }
            getRouters.forEach((route) => {
                route.middleWares.push(obj.middleWare);
            });
            postRouters.forEach((route) => {
                route.middleWares.push(obj.middleWare);
            });
            patchRouters.forEach((route) => {
                route.middleWares.push(obj.middleWare);
            });
            putRouters.forEach((route) => {
                route.middleWares.push(obj.middleWare);
            });
            deleteRouters.forEach((route) => {
                route.middleWares.push(obj.middleWare);
            });
        });
        this.tempMiddleWares = [];
    }
    init() {
        this.chooseRoute(this.req, this.res);
        return this;
    }
    // method to choose route
    chooseRoute(req, res) {
        let method = req.method;
        let pathToSkip = req.pathname;
        let foundStaticRoute = this.statics.find(route => {
            let regexResult = route.routePattern.match(pathToSkip);
            if (regexResult) {
                return route;
            }
        });
        // check if found staticsroute is exist
        if (foundStaticRoute) {
            return foundStaticRoute.handle({ Router: this, req, res });
        }
        else {
            let matchedRoute;
            switch (method) {
                case "get":
                    matchedRoute = this.statics.find(route => route.routePattern.match(pathToSkip));
                case "get":
                    matchedRoute = this.getRouters.find(route => route.routePattern.match(pathToSkip));
                    break;
                case "post":
                    matchedRoute = this.postRouters.find(route => route.routePattern.match(pathToSkip));
                    break;
                case "delete":
                    matchedRoute = this.deleteRouters.find(route => route.routePattern.match(pathToSkip));
                    break;
                case "put":
                    matchedRoute = this.putRouters.find(route => route.routePattern.match(pathToSkip));
                    break;
                case "patch":
                    matchedRoute = this.patchRouters.find(route => route.routePattern.match(pathToSkip));
                    break;
                default:
                    res.status(404);
                    return this.errorPage(req, res);
            }
            if (matchedRoute) {
                let params = matchedRoute.routePattern.match(pathToSkip);
                req.params = params;
                // call handle function
                return matchedRoute.handle({ Router: this, req: req, res: res });
            }
            else {
                res.status(404);
                // return error page
                return this.errorPage(req, res);
            }
        }
    }
    // method to handle routers when build
    bootstrapRoutes() {
        this.getRouters = Array.from(this.getRouters).map((route) => {
            if (route instanceof Route_1.default) {
                return route;
            }
            else {
                route.handler = route.handler.bind(this);
                let parsedRoute = new Route_1.default(route, this.base);
                let corsObject = Object.assign({}, route.cors, this.cors);
                parsedRoute.setCors(corsObject);
                return parsedRoute;
            }
        });
        this.postRouters = Array.from(this.postRouters).map((route) => {
            if (route instanceof Route_1.default) {
                return route;
            }
            route.handler = route.handler.bind(this);
            let parsedRoute = new Route_1.default(route, this.base);
            let corsObject = Object.assign({}, route.cors, this.cors);
            parsedRoute.setCors(corsObject);
            return parsedRoute;
        });
        this.putRouters = Array.from(this.putRouters).map((route) => {
            if (route instanceof Route_1.default) {
                return route;
            }
            route.handler = route.handler.bind(this);
            let parsedRoute = new Route_1.default(route, this.base);
            let corsObject = Object.assign({}, route.cors, this.cors);
            parsedRoute.setCors(corsObject);
            return parsedRoute;
        });
        this.patchRouters = Array.from(this.patchRouters).map((route) => {
            if (route instanceof Route_1.default) {
                return route;
            }
            route.handler = route.handler.bind(this);
            let parsedRoute = new Route_1.default(route, this.base);
            let corsObject = Object.assign({}, route.cors, this.cors);
            parsedRoute.setCors(corsObject);
            return parsedRoute;
        });
        this.deleteRouters = Array.from(this.deleteRouters).map((route) => {
            if (route instanceof Route_1.default) {
                return route;
            }
            route.handler = route.handler.bind(this);
            let parsedRoute = new Route_1.default(route, this.base);
            let corsObject = Object.assign({}, route.cors, this.cors);
            parsedRoute.setCors(corsObject);
            return parsedRoute;
        });
    }
    useRouter(RouterClass) {
        let newRouter = new RouterClass();
        newRouter.req = this.req;
        newRouter.res = this.res;
        newRouter.base = newRouter.base || "/";
        newRouter.child = true;
        newRouter.cors = Object.assign({}, this.cors, newRouter.cors);
        newRouter.globalMiddleWares = newRouter.globalMiddleWares || [];
        if (newRouter.child) {
            this.assignChildRouterRoutes(newRouter);
            helpers_1.default.assignPrototype(this, RouterClass);
        }
        else {
            newRouter.globalMiddleWares.unshift(...this.globalMiddleWares);
            newRouter.build();
        }
        return this;
    }
    // method to assign child router routes to parent
    assignChildRouterRoutes(childRouter) {
        let allRoutes = [...childRouter.getRouters, ...childRouter.postRouters, ...childRouter.patchRouters, ...childRouter.putRouters, ...childRouter.deleteRouters];
        allRoutes.map((route) => {
            route.url = path_1.default.join(childRouter.base, route.url);
            route.url = route.url.split(path_1.default.sep).join("/");
            route.middleWares = route.middleWares || [];
            route.middleWares.unshift(...childRouter.globalMiddleWares);
            route.cors = Object.assign({}, childRouter.cors, route.cors || {});
            switch (route.method.toLowerCase()) {
                case "get":
                    this.getRouters.push(route);
                    break;
                case "post":
                    this.postRouters.push(route);
                    break;
                case "put":
                    this.putRouters.push(route);
                    break;
                case "patch":
                    this.patchRouters.push(route);
                    break;
                case "delete":
                    this.deleteRouters.push(route);
                    break;
            }
        });
        return this;
    }
    addRoute(route) {
        let handler = route.handler;
        let method = route.method.toLowerCase();
        let url = route.url;
        let middleWares = route.middleWares;
        let setOptions = {
            handler,
            method,
            url,
            middleWares
        };
        let parsedRoute = new Route_1.default(setOptions, this.base);
        let corsObject = Object.assign({}, route.cors, this.cors);
        parsedRoute.setCors(corsObject);
        switch (method) {
            case "get":
                this.getRouters.push(parsedRoute);
                break;
            case "post":
                this.postRouters.push(parsedRoute);
                break;
            case "put":
                this.putRouters.push(parsedRoute);
                break;
            case "patch":
                this.patchRouters.push(parsedRoute);
                break;
            case "delete":
                this.deleteRouters.push(parsedRoute);
                break;
        }
        return this;
    }
    setBase() {
        this.base = this.options.base || this.base || "";
        this.base =
            this.base
                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                .replace(/^(.+?)\/*?$/, "$1") || "/";
    }
    // push global middleWares
    pushGlobalMiddleWares(routers, globalMiddleWares, classCors) {
        routers.forEach((router) => {
            router.cors = Object.assign({}, router.cors, classCors);
            router.middleWares.unshift(...globalMiddleWares);
        });
    }
    corsMiddleWare(req, res, next) {
        let corsObject = this.cors;
        return cors_1.default(corsObject)(req, res, next);
    }
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
                        res.statusCode = 404;
                        return this.errorPage(req, res);
                    }
                }
                else {
                    res.statusCode = 404;
                    return this.errorPage(req, res);
                }
            }
            catch (err) {
                res.status(404);
                return this.errorPage(req, res);
            }
        });
    }
    // static method to serve static files
    static(options) {
        options.absolute = options.absolute || true;
        let middleWares = options.middleWares || [];
        let route = {
            url: `/${options.url}${options.absolute ? "/*" : ""}`,
            method: "GET",
            middleWares: middleWares,
            handler: helpers_1.default.serveAssets.bind({ staticFolder: { url: options.url, path: options.path }, errorPage: this.errorPage || Server_1.Server.errorPage }),
            assetsPath: true
        };
        this.statics.push(new Route_1.default(route, this.base));
    }
    // method to serve assets
    serverAssetsMiddleWare() {
        // check if the static folder is exist
        if (this.staticFolder) {
            // this.globalMiddleWares.push(this.serveAssets.bind(this));
            let route = {
                url: `/${this.staticFolder.url}/*`,
                method: "GET",
                handler: this.serveAssets.bind(this),
                assetsPath: true
            };
            this.getRouters.unshift(route);
        }
    }
}
exports.default = Router;
