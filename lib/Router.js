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
class Router {
    constructor(options) {
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
        this.options = options || {};
        this.setBase();
        this.getRouters = this.getRouters || [];
        this.postRouters = this.postRouters || [];
        this.deleteRouters = this.deleteRouters || [];
        this.putRouters = this.putRouters || [];
        this.patchRouters = this.patchRouters || [];
        this.globalMiddleWares = this.globalMiddleWares || [];
        this.serverOptions = this.serverOptions || {};
        // this.cors = this.cors || {
        // }
        this.staticFolder = this.options.staticFolder || this.staticFolder;
    }
    use(func) {
        this.globalMiddleWares.push(func);
        return this;
    }
    build() {
        this.id = Math.random().toString(36).substr(2, 9);
        Server_1.Server.routers.set(this.base, this);
        this.errorPage = this.errorPage || Server_1.Server.errorPage;
        this.staticFolder = this.staticFolder || Server_1.Server.serverOptions.staticFolder;
        this.serverAssetsMiddleWare();
        this.bootstrapRoutes();
        return this;
    }
    init() {
        this.chooseRoute(this.req, this.res);
        return this;
    }
    // method to choose route
    chooseRoute(req, res) {
        let method = req.method;
        let pathToSkip = req.pathname;
        if (path_1.default.extname(pathToSkip)) {
            pathToSkip = req.pathname.replace(/\.[^.]*$/, "");
        }
        let matchedRoute;
        switch (method) {
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
            return matchedRoute.handle(this, req, res);
        }
        else {
            res.status(404);
            // return error page
            return this.errorPage(req, res);
        }
    }
    // method to handle routers when build
    bootstrapRoutes() {
        this.getRouters = Array.from(this.getRouters).map((route) => {
            if (route instanceof Route_1.default) {
                return route;
            }
            else {
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
            let parsedRoute = new Route_1.default(route, this.base);
            let corsObject = Object.assign({}, route.cors, this.cors);
            parsedRoute.setCors(corsObject);
            return parsedRoute;
        });
        this.putRouters = Array.from(this.putRouters).map((route) => {
            if (route instanceof Route_1.default) {
                return route;
            }
            let parsedRoute = new Route_1.default(route, this.base);
            let corsObject = Object.assign({}, route.cors, this.cors);
            parsedRoute.setCors(corsObject);
            return parsedRoute;
        });
        this.patchRouters = Array.from(this.patchRouters).map((route) => {
            if (route instanceof Route_1.default) {
                return route;
            }
            let parsedRoute = new Route_1.default(route, this.base);
            let corsObject = Object.assign({}, route.cors, this.cors);
            parsedRoute.setCors(corsObject);
            return parsedRoute;
        });
        this.deleteRouters = Array.from(this.deleteRouters).map((route) => {
            if (route instanceof Route_1.default) {
                return route;
            }
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
        newRouter.base = newRouter.base || this.base;
        newRouter.base = path_1.default.join(this.base, newRouter.base).split(path_1.default.sep).join("/");
        newRouter.cors = Object.assign({}, this.cors, newRouter.cors);
        newRouter.globalMiddleWares = newRouter.globalMiddleWares || [];
        newRouter.globalMiddleWares.unshift(...this.globalMiddleWares);
        newRouter.build();
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
            case "post":
                this.postRouters.push(parsedRoute);
            case "put":
                this.putRouters.push(parsedRoute);
            case "patch":
                this.patchRouters.push(parsedRoute);
            case "delete":
                this.deleteRouters.push(parsedRoute);
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
                    var sourceFolder = path_1.default.resolve("/", staticFolder.path);
                    // sourceFolder = sourceFolder.split(path.sep).join("/");
                    var mimeTypes = config_1.default.mimeTypes;
                    var dirName = path_1.default.join("", `${sourceFolder}`);
                    let fileSource;
                    fileSource = path_1.default.join(process.cwd(), req.pathname);
                    fileSource = fileSource.split(path_1.default.sep).join("/");
                    // var existFile = fs.existsSync(fileSource);
                    let promisifiedState = util_1.default.promisify(fs_1.default.lstat);
                    let fileState = (yield promisifiedState(fileSource));
                    if (fileState.isFile()) {
                        var fileStream = fs_1.default.createReadStream(fileSource);
                        let extName = path_1.default.extname(req.pathname);
                        var headers = {
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
