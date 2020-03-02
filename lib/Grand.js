/*
=========================================================
Grand js core file

# Author Tarek Salem
=========================================================
*/

// Dependencies
const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const path = require("path");
const URL = require("url");
const helpers = require("./helpers/helpers");
const sessionModule = require("./helpers/sessionLib");
const loginSystem = require("./helpers/loginSystem");
const RouteParser = require("url-pattern");
const config = require("./helpers/config");
const Validator = require("./helpers/validator");
const FileUpload = require("./helpers/fileupload");
const multiparty = require("multiparty");
const RequestParser = require("./helpers/requestParser");
const cors = require("cors");
// end dependencies
//define a global variable
global.baseDir = __dirname;
class BuildServer {
    constructor() {
        this.helpers = {};
        this.helpers.enCrypt = helpers.enCrypt;
        this.helpers.deCrypt = helpers.deCrypt;
        this.helpers.validation = helpers.validation;
        this.getRouters = {};
        this.postRouters = {};
        this.deleteRouters = {};
        this.patchRouters = {};
        this.putRouters = {};
        this.classes = [];
        this.bases = [];
        this.classesRoutes = {};
        this.Validator = Validator;
        this.FileUpload = FileUpload;
        const self = this;
        // define handlebars as property in grandjs
        this.handlebars = helpers.handlebars;
        this.Router = class Router {
            constructor(options) {
                this._pushGlobalMiddleWares = function(routers, globalMiddleWares, classCors) {
                    routers.forEach(obj => {
                        obj.middleWares = obj.middleWares || [];
                        obj.cors = obj.cors || {};
                        obj.cors = Object.assign({}, obj.cors, this.cors, classCors);
                        obj.middleWares.unshift(...globalMiddleWares);
                    })
                }
                this._setRouteCors = (matchedURL)=> {
                    let corsObject = typeof matchedURL.cors == "object" ? matchedURL.cors : {};
                    corsObject = Object.assign({}, matchedURL.cors, this.cors);
                    // let cors = new Cors(corsObject);
                    // let corsObject = matchedURL.cors;
                    function corsMiddleWare(req, res, next) {
                        return cors(corsObject)(req, res, next);
                        // return cors.init(req, res, next);
                        // return cors(corsObject, req, res, next);
                    }
                    matchedURL.middleWares = matchedURL.middleWares || [];
                    let allMiddleWares = [corsMiddleWare, ...matchedURL.middleWares];
                    // console.log(allMiddleWares);
                    return {
                        allMiddleWares
                    }
                }
                this.errorPage = this.errorPage = self.errorPage;
                this.options = options;
                this.base =
                    this.options.base
                    .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                    .replace(/^(.+?)\/*?$/, "$1") || "/";
                this.getRouters = [];
                this.postRouters = [];
                this.deleteRouters = [];
                this.putRouters = [];
                this.patchRouters = [];
                this.childRoutes = [];
                this.cors = this.cors || {};
                this.corsMiddleWare = function (req, res, next) {
                    let corsObject = this.cors;
                    return cors(corsObject)(req, res, next);
                    // let cors = new Cors(corsObject);
                    // return cors.init(req, res, next);
                    // return cors(this.cors, req, res, next);
                }
            }
            build() {
                // console.log(self.staticFolder)
                this.id = Math.random()
                    .toString(36)
                    .substr(2, 9);
                self.classes.push(this);
                self.bases.push(this.base);
                self.classesRoutes[this.base] = this;
                this.inited = false;
                this.initedposts = false;
                this.initedputs = false;
                this.initedpatches = false;
                this.initeddeletes = false;
                this.staticFolder = this.options.staticFolder || self.staticFolder;
                // console.log(this.staticFolder)
                this.globalMiddleWares = this.globalMiddleWares || [];
                this.globalMiddleWares.push(this.serverAssetsMiddleWare.bind(this))
            }
            serveAssets(req, res, next) {
                // console.log("yes")
                let staticFolder = this.staticFolder || "/";
                // console.log(staticFolder);
                var sourceFolder = path.resolve("/", staticFolder);
                var mimeTypes = config.mimeTypes
                var dirName = path.join("", `${sourceFolder}`);
                // if (pathname.startsWith(sourceFolder)) {
                //     pathname = pathname.split(sourceFolder)[1];
                // }
                var fileSource = path.join(process.cwd(), req.pathname);
                var existFile = fs.existsSync(fileSource);
                if (existFile) {
                    var fileStream = fs.createReadStream(fileSource);
                    let fileState = fs.statSync(fileSource);
                    var headers = {
                        "Content-Type": mimeTypes[path.extname(req.pathname)] || 'application/octet-stream',
                        // 'Cache-Control': `public, max-age=${cacheControl || 'no-cache'}`,
                        'Content-Length': fileState.size
                    };
                    res.writeHead(200, headers);
                    return fileStream.pipe(res);
                } else {
                    res.statusCode = 404;
                    return this.errorPage(req, res);
                    // res.writeHead(404);
                }

            }
            // method to serve assets
            serverAssetsMiddleWare(req, res, next) {
                // check if the static folder is exist
                if (this.staticFolder) {
                    // console.log(this.staticFolder)
                    this.getRouters.unshift({
                        url: `/${this.staticFolder}/*`,
                        method: "GET",
                        handler: this.serveAssets.bind(this)
                    })
                    return next();
                } else {
                    // continue
                    return next();
                }
            }
            serveFiles(cb) {
                let pathname = this.req.pathname;
                let ur = config.extenstions.find(ext => path.extname(pathname) == ext);
                if (ur) {
                    return helpers
                        .staticFiles(
                            this.req,
                            this.res,
                            this.req.pathname,
                            this.staticFolder,
                            self.cacheControl
                        )
                        .catch(src => {
                            this.res.statusCode = 404;
                            return cb(src);
                        });
                } else {
                    return cb();
                }
            }
            useRouter(RouterClass) {
                let newClass = new RouterClass({ base: this.base });
                newClass.build();
                self.classesRoutes[this.base] = this;
                newClass.cors = Object.assign({}, this.cors, newClass.cors);
                newClass.globalMiddleWares = newClass.globalMiddleWares || [];
                    this._pushGlobalMiddleWares(newClass.getRouters, newClass.globalMiddleWares, newClass.cors);
                    this._pushGlobalMiddleWares(newClass.postRouters, newClass.globalMiddleWares, newClass.cors);
                    this._pushGlobalMiddleWares(newClass.putRouters, newClass.globalMiddleWares, newClass.cors);
                    this._pushGlobalMiddleWares(newClass.patchRouters, newClass.globalMiddleWares, newClass.cors);
                    this._pushGlobalMiddleWares(newClass.deleteRouters, newClass.globalMiddleWares, newClass.cors);
                this.getRouters.push(...newClass.getRouters)
                this.postRouters.push(...newClass.postRouters)
                this.putRouters.push(...newClass.putRouters)
                this.patchRouters.push(...newClass.patchRouters)
                this.deleteRouters.push(...newClass.deleteRouters)
            }
            addRoute(options) {
                let handler = options.handler;
                let method = options.method.toLowerCase();
                let url = options.url.trim();
                let middleWares = options.middleWares;
                var setOptions = {
                    handler,
                    method,
                    url,
                    middleWares
                };
                if (method == "get") {
                    this.getRouters.push(setOptions);
                } else if (
                    method == "post"
                ) {
                    this.postRouters.push(setOptions);
                } else if (method == "delete") {
                    this.deleteRouters.push(setOptions)
                } else if (method == "patch") {
                    this.patchRouters.push(setOptions);
                } else if (method == "put") {
                    this.putRouters.push(setOptions);
                }
            }
            init() {
                this.req = self.req;
                this.res = self.res;
                let req = this.req;
                let res = this.res;
                if (req.method.toLowerCase() == "get") {
                    let getRouters = this.getRouters;
                    self.getRouters[this.id] = getRouters;
                    if (this.inited == false) {
                        this.finalGetRouters = [];
                        this.getRouters.forEach(router => {
                            router.url = `${this.base}${router.url}`
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            router.method = router.method.toLowerCase();
                            let routePattern = new RouteParser(router.url);
                            routePattern.class = this;
                            let values = [];
                            routePattern.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            router.value = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            this.finalGetRouters.push(routePattern);
                        });
                        this.inited = true;
                    }
                    let matchedFinal;
                    let matchedRe = req.pathname;
                    this.finalGetRouters.forEach(r => {
                        let pathToSkip = req.pathname //.replace(/\.[^.]*$/, "");
                        if(path.extname(pathToSkip)) {
                            pathToSkip = req.pathname.replace(/\.[^.]*$/, "");
                        }
                        matchedFinal = r.match(pathToSkip);
                        if (matchedFinal) {
                            let values = [];
                            r.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            matchedRe = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            req.params = matchedFinal;
                        }
                    });
                    let matchedURL = getRouters.find(router => {
                        // console.log("router value", router.value)
                        // console.log("matched re", matchedRe)
                        return router.value == matchedRe;
                    });
                    if (matchedURL) {
                        matchedURL.nextError = self.nextError;
                        let corsSetting = this._setRouteCors(matchedURL);
                        let allMiddleWares = corsSetting.allMiddleWares;
                        // console.log(allMiddleWares);
                        if (matchedURL.method == "get") {
                            res.statusCode = 200;
                            if (allMiddleWares.length > 0) {
                                // console.log(matchedURL.middleWares)
                                var nexted = 0;
                                allMiddleWares[0](req, res, next);

                                function next(err) {
                                    if(err) {
                                        return self.nextError(err, req, res);
                                    } else {
                                        nexted++;
                                        if (allMiddleWares.length <= nexted) {
                                            matchedURL.handler(req, res);
                                        } else {
                                            return allMiddleWares[nexted](req, res, next);
                                        }
                                    }
                                }
                            } else {
                                matchedURL.handler(req, res);
                            }
                        } else {
                            
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        // this.serveFiles(() => {
                            
                        //     res.statusCode = 404;

                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        // });
                    }
                } else if (
                    req.method.toLowerCase() == "post"
                ) {
                    let postRouters = this.postRouters;
                    if (this.initedposts == false) {
                        this.finalPostRouters = [];
                        this.postRouters.forEach(router => {
                            router.url = `${this.base}${router.url}`
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            router.method = router.method.toLowerCase();
                            let routePattern = new RouteParser(router.url);
                            routePattern.class = this;
                            let values = [];
                            routePattern.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            router.value = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            this.finalPostRouters.push(routePattern);
                        });
                        this.initedposts = true;
                    }
                    self.postRouters[this.id] = postRouters;
                    let matchedFinal;
                    let matchedRe = req.pathname;
                    this.finalPostRouters.forEach(r => {
                        matchedFinal = r.match(req.pathname);
                        if (matchedFinal) {
                            let values = [];
                            r.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            matchedRe = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            req.params = matchedFinal;
                        }
                    });
                    let matchedURL = postRouters.find(router => {
                        return router.value == matchedRe;
                    });
                    if (matchedURL) {
                        matchedURL.nextError = self.nextError;
                        let corsSetting = this._setRouteCors(matchedURL);
                        let allMiddleWares = corsSetting.allMiddleWares;
                        // console.log(JSON.stringify({mid: allMiddleWares}))
                        if (
                            matchedURL.method.toLowerCase() == "post"
                        ) {
                            let contentBuffer = [];
                            let totalBytesInBuffer = 0;
                            res.statusCode = 200;
                            let headers = req.headers;
                            let comingData = "";
                            return self.RequestParser.handler(Object.assign({}, matchedURL, {middleWares: allMiddleWares}), req, res);
                        } else {
                            
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        
                        return this.errorPage ?
                            this.errorPage(req, res) :
                            self.errorPage(req, res);
                    }
                } else if (
                    req.method.toLowerCase() == "delete"
                ) {
                    let deleteRouters = this.deleteRouters;
                    if (this.initeddeletes == false) {
                        this.finalDeleteRouters = [];
                        this.deleteRouters.forEach(router => {
                            router.url = `${this.base}${router.url}`
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            router.method = router.method.toLowerCase();
                            let routePattern = new RouteParser(router.url);
                            routePattern.class = this;
                            let values = [];
                            routePattern.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            router.value = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            this.finalDeleteRouters.push(routePattern);
                        });
                        this.initeddeletes = true;
                    }
                    self.deleteRouters[this.id] = deleteRouters;
                    let matchedFinal;
                    let matchedRe = req.pathname;
                    this.finalDeleteRouters.forEach(r => {
                        matchedFinal = r.match(req.pathname);
                        if (matchedFinal) {
                            let values = [];
                            r.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            matchedRe = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            req.params = matchedFinal;
                        }
                    });
                    let matchedURL = deleteRouters.find(router => {
                        return router.value == matchedRe;
                    });
                    if (matchedURL) {
                        matchedURL.nextError = self.nextError;
                        let corsSetting = this._setRouteCors(matchedURL);
                        let allMiddleWares = corsSetting.allMiddleWares;
                        if (
                            matchedURL.method.toLowerCase() == "delete"
                        ) {
                            let contentBuffer = [];
                            let totalBytesInBuffer = 0;
                            res.statusCode = 200;
                            let headers = req.headers;
                            let comingData = "";
                            return self.RequestParser.handler(Object.assign({}, matchedURL, {middleWares: allMiddleWares}), req, res);
                        } else {
                            
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        
                        return this.errorPage ?
                            this.errorPage(req, res) :
                            self.errorPage(req, res);
                    }
                } else if (
                    req.method.toLowerCase() == "put"
                ) {
                    let putRouters = this.putRouters;
                    if (this.initedputs == false) {
                        this.finalPutRouters = [];
                        this.putRouters.forEach(router => {
                            router.url = `${this.base}${router.url}`
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            router.method = router.method.toLowerCase();
                            let routePattern = new RouteParser(router.url);
                            routePattern.class = this;
                            let values = [];
                            routePattern.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            router.value = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            this.finalPutRouters.push(routePattern);
                        });
                        this.initedputs = true;
                    }
                    self.putRouters[this.id] = putRouters;
                    let matchedFinal;
                    let matchedRe = req.pathname;
                    this.finalPutRouters.forEach(r => {
                        matchedFinal = r.match(req.pathname);
                        if (matchedFinal) {
                            let values = [];
                            r.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            matchedRe = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            req.params = matchedFinal;
                        }
                    });
                    let matchedURL = putRouters.find(router => {
                        return router.value == matchedRe;
                    });
                    if (matchedURL) {
                        matchedURL.nextError = self.nextError;
                        let corsSetting = this._setRouteCors(matchedURL);
                        let allMiddleWares = corsSetting.allMiddleWares;
                        if (
                            matchedURL.method.toLowerCase() == "put"
                        ) {
                            let contentBuffer = [];
                            let totalBytesInBuffer = 0;
                            res.statusCode = 200;
                            let headers = req.headers;
                            let comingData = "";
                            return self.RequestParser.handler(Object.assign({}, matchedURL, {middleWares: allMiddleWares}), req, res);
                        } else {
                            
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        
                        return this.errorPage ?
                            this.errorPage(req, res) :
                            self.errorPage(req, res);
                    }
                } else if (
                    req.method.toLowerCase() == "patch"
                ) {
                    let patchRouters = this.patchRouters;
                    if (this.initedpatches == false) {
                        this.finalPatchRouters = [];
                        this.patchRouters.forEach(router => {
                            router.url = `${this.base}${router.url}`
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            router.method = router.method.toLowerCase();
                            let routePattern = new RouteParser(router.url);
                            routePattern.class = this;
                            let values = [];
                            routePattern.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            router.value = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            this.finalPatchRouters.push(routePattern);
                        });
                        this.initedpatches = true;
                    }
                    self.patchRouters[this.id] = patchRouters;
                    let matchedFinal;
                    let matchedRe = req.pathname;
                    this.finalPatchRouters.forEach(r => {
                        matchedFinal = r.match(req.pathname);
                        if (matchedFinal) {
                            let values = [];
                            r.ast.map(tag => {
                                values.push(tag.value);
                            });
                            values = values.join("");
                            matchedRe = values
                                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                                .replace(/^(.+?)\/*?$/, "$1");
                            req.params = matchedFinal;
                        }
                    });
                    let matchedURL = patchRouters.find(router => {
                        return router.value == matchedRe;
                    });
                    if (matchedURL) {
                        matchedURL.nextError = self.nextError;
                        let corsSetting = this._setRouteCors(matchedURL);
                        let allMiddleWares = corsSetting.allMiddleWares;
                        if (
                            matchedURL.method.toLowerCase() == "patch"
                        ) {
                            let contentBuffer = [];
                            let totalBytesInBuffer = 0;
                            res.statusCode = 200;
                            let headers = req.headers;
                            let comingData = "";
                            return self.RequestParser.handler(Object.assign({}, matchedURL, {middleWares: allMiddleWares}), req, res);
                        } else {
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        return this.errorPage ?
                            this.errorPage(req, res) :
                            self.errorPage(req, res);
                    }
                }
            }
        };
    }
    use(callback) {
        // register middleare to middlewares
        this.middleWares.push(callback);
    }
    setConfig(options) {
        this.timeout = options.timeout;
        this.session = options.session;
        this.type = options.type;
        this.setCookie = options.setCookie;
        this.middleWares = options.middleWares || [];
        this.cors = options.cors || {};
        process.env.ENCRYPTION_KEY =
            options.ENCRYPTION_KEY || "ncryptiontestforencryptionproces";
        this.serverOptions = options !== undefined ? options : {};
        var serverOptions = this.serverOptions;
        this.http = serverOptions.http || require("http");
        this.port =
            serverOptions.port !== undefined ?
            serverOptions.port :
            process.env.PORT || 3000;
        this.cacheControl = serverOptions.cacheControl;
        this.serverOptions = serverOptions;
        this.getRoutes =
            serverOptions.getRoutes !== undefined ? serverOptions.getRoutes : {};
        this.postRoutes =
            serverOptions.postRoutes !== undefined ? serverOptions.postRoutes : {};
        this.putRoutes =
            serverOptions.putRoutes !== undefined ? serverOptions.putRoutes : {};
        this.pathRoutes =
            serverOptions.patchRoutes !== undefined ? serverOptions.patchRoutes : {};
        this.deleteRoutes =
            serverOptions.deleteRoutes !== undefined ?
            serverOptions.deleteRoutes : {};
        this.handlers =
            serverOptions.handlers !== undefined ? serverOptions.handlers : {};
        this.staticFolder = serverOptions.staticFolder;
        this.errorPage = serverOptions.errorPage;
        this.logger = serverOptions.logger;
        this.httpsMode = serverOptions.httpsMode;
        this.nextError = typeof options.nextError === "function" ? options.nextError : (err, req, res) => {
            res.setHeader('Content-Length', '0');
            return res.end();
        }
    }
    loging(req, res) {
        let statusCode = res.statusCode;
        let method = req.method.toUpperCase();
        if (statusCode == 200) {
            console.log(
                "\x1b[32m",
                method,
                statusCode,
                "OK",
                ":",
                "\x1b[0m",
                req.pathname
            );
        } else if (statusCode == 302) {
            console.log(
                "\x1b[33m",
                method,
                statusCode,
                "OK",
                ":",
                "\x1b[0m",
                req.pathname
            );
        } else if (statusCode == 404) {
            console.log(
                "\x1b[31m",
                method,
                statusCode,
                "error not found",
                ":",
                "\x1b[0m",
                req.pathname
            );
        }
    }
    initServer() {
        var previousURLS = {};
        let useStaticArr = [];
        const http = this.http;
        const self = this;
        let getRoutes = this.getRoutes;
        let postRoutes = this.postRoutes;
        let putRoutes = this.putRoutes;
        let deleteRoutes = this.deleteRoutes;
        let patchRoutes = this.pathRoutes;
        let handlers = this.handlers;
        let port = this.port;
        let cookieOptions = this.setCookie;
        let cacheControl = this.cacheControl;
        var staticArr = [];
        var requestsArr = [];
        var pathnames = [];
        // flask messages
        var flash = {};
        flash.reset = function() {
            Object.keys(flash).forEach(function(fl) {
                if (fl != "reset") {
                    flash[fl] = undefined;
                }
            });
        };
        // app here
        function app(req, res) {
            req.flash = flash;
            self.RequestParser = new RequestParser(req, res);
            sessionModule.setSessionOptions({
                req: req,
                res: res,
                cookieOptions: cookieOptions
            });
            if (self.session === true) {
                session.init(req, res);
            }
            res.sendFile = file => {
                return new Promise((resolve, reject) => {
                    helpers.sendFile(req, res, file, run => {
                        if (run) {
                            return resolve();
                        } else {
                            return reject("no such file");
                        }
                    });
                });
            };
            res.render = function(options) {
                let layout = options.layout;
                let partials = options.partials;
                let body = options.body;
                let data = options.data;
                helpers.render({
                    req: req,
                    res: res,
                    layout: layout,
                    partials: partials,
                    body: body,
                    data: data
                });
                return res;
            };
            // method to set res status code
            res.status = (status, message) => {
                res.statusCode = status;
                res.statusMessage = message || "not found";
                return res;
            };
            // method to send json content
            res.json = function(data) {
                res.writeHead(res.statusCode, { "content-type": "application/json"});
                helpers.json(res, data);
                return res;
            };
            res.redirect = function(url) {
                res.writeHead(302, {
                    Location: url
                });
                res.end();
                return res;
            };
            let url = URL.parse(req.url, true);
            url.path = url.path
                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                .replace(/^(.+?)\/*?$/, "$1");
            url.href = url.href
                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                .replace(/^(.+?)\/*?$/, "$1");
            let pathname = url.pathname
                .trim()
                .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
                .replace(/^(.+?)\/*?$/, "$1");
            let method = req.method.toLowerCase();
            let headers = req.headers;
            req.method = method;
            req.query = url.query || {};
            req.pathname = pathname;
            req.params = {};
            req.url = url;
            // console.log()
            req.path = url.path;
            req.href = url.href;
            req.validation = helpers.validation;
            previousURLS[req.pathname] = req.url;
            req.previousURLS = previousURLS;
            let previousURL = Object.keys(previousURLS)[
                Object.keys(previousURLS).length > 1 ?
                Object.keys(previousURLS).length - 2 :
                Object.keys(previousURLS).length - 1
            ];
            req.previousURL = previousURL;
            var requestInfo = {
                url: url,
                headers: headers,
                pathname: pathname,
                method: method,
                query: req.query,
                req: req,
                res: res
                    // params: req.params,
            };

            function chooseHandlers() {
                let requests = [];
                self.bases.forEach(base => {
                    if (req.pathname.startsWith(base)) {
                        requests.push(base);
                    }
                });
                let matchedReq =
                    requests[requests.length > 1 ? requests.length - 1 : 0];
                if (matchedReq) {
                    let matchedClass = self.classesRoutes[matchedReq];
                    if (matchedClass) {
                        matchedClass.req = req;
                        matchedClass.res = res;
                        matchedClass.globalMiddleWares = matchedClass.globalMiddleWares || [];
                        // function corsMiddleWare(req, res, next) {
                        //     let corsObject = matchedClass.cors || self.cors;
                        //     cors(corsObject, req, res, next);
                        // }
                        let allMiddleWares = [matchedClass.corsMiddleWare.bind(matchedClass), ...self.middleWares, ...matchedClass.globalMiddleWares];
                        // check if there is middlewares registeered
                        // if(self.middleWares.length > 0) {
                        //     var nexted = 0;
                        //         // matchedClass.req = req;
                        //         // matchedClass.res = res;
                        //         matchedClass.serveFiles(() => {
                        //             return self.middleWares[0](req, res, next);
                        //         });
                        //         function next() {
                        //             nexted++;
                        //             if (self.middleWares.length <= nexted) {
                        //                 // matchedClass.init();
                        //             } else {
                        //                 matchedClass.serveFiles(() => {
                        //                     return self.middleWares[nexted](
                        //                         req,
                        //                         res,
                        //                         next
                        //                     );
                        //                 });
                        //             }
                        //         }
                        // }
                        if (allMiddleWares) {
                            if (allMiddleWares.length > 0) {
                                var nexted = 0;
                                matchedClass.req = req;
                                matchedClass.res = res;
                                // matchedClass.serveFiles(() => {
                                    return allMiddleWares[0](req, res, next);
                                // });

                                function next(err) {
                                    if(err) {
                                        return self.nextError(err, req, res);
                                    } else {
                                        nexted++;
                                        if (allMiddleWares.length <= nexted) {
                                            matchedClass.init();
                                        } else {
                                            // matchedClass.serveFiles(() => {
                                                return allMiddleWares[nexted](
                                                    req,
                                                    res,
                                                    next
                                                );
                                            // });
                                        }
                                    }
                                }
                            } else {
                                matchedClass.init();
                            }
                        } else {
                            matchedClass.init();
                        }
                    }
                } else {
                    let ur = config.extenstions.find(
                        ext => path.extname(pathname) == ext
                    );
                    if (ur) {
                        // return helpers
                        //     .staticFiles(
                        //         req,
                        //         res,
                        //         req.pathname,
                        //         self.staticFolder,
                        //         self.cacheControl
                        //     )
                        //     .catch(src => {
                        //         // res.writeHead(404);
                        //         self.errorPage(req, res);
                        //     });
                    } else {
                        res.writeHead(404);
                        self.errorPage(req, res);
                    }
                }
            }
            self.req = req;
            self.res = res;
            chooseHandlers();
            if (self.logger) {
                self.loging(req, res);
            }
        }
        if (self.httpsMode) {
            const server = http.createServer(self.httpsMode, app);
            this.server = server;
            this.listener = this.server.listen(port);
        } else {
            const server = http.createServer(app);
            this.server = server;
            this.listener = this.server.listen(port);
        }
    }
    addMimeTypes(extention, mimeType) {
        try {
            config.extenstions.push(extention);
            config.mimeTypes[extention] = mimeType;
        } catch (e) {
            console.log(e);
        }
    }
}
module.exports = BuildServer;