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
const FileUploader = require("./helpers/fileuploader");
const multiparty = require("multiparty");
const RequestParser = require("./helpers/requestParser");
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
        this.FileUploader = FileUploader;
        const self = this;
        // define handlebars as property in grandjs
        this.handlebars = helpers.handlebars;
        this.Router = class Router {
            constructor(options) {
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
                this.staticFolder = options.staticFolder || self.staticFolder;
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
                self.classesRoutes[this.base] = this;;
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
                    let matchedURL = getRouters.find(router => {
                        return router.value == matchedRe;
                    });
                    if (matchedURL) {
                        if (matchedURL.method == "get") {
                            res.statusCode = 200;
                            if (matchedURL.middleWares && matchedURL.middleWares.length > 0) {
                                var nexted = 0;
                                matchedURL.middleWares[0](req, res, next);

                                function next() {
                                    nexted++;
                                    if (matchedURL.middleWares.length <= nexted) {
                                        matchedURL.handler(req, res);
                                    } else {
                                        return matchedURL.middleWares[nexted](req, res, next);
                                    }
                                }
                            } else {
                                matchedURL.handler(req, res);
                            }
                        } else {
                            res.writeHead(404);
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        // console.log(matchedClass)
                        this.serveFiles(() => {
                            res.writeHead(404);
                            res.statusCode = 404;

                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        });
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
                        if (
                            matchedURL.method.toLowerCase() == "post"
                        ) {
                            let contentBuffer = [];
                            let totalBytesInBuffer = 0;
                            res.statusCode = 200;
                            let headers = req.headers;
                            let comingData = "";
                            // req.data = {};
                            // req.files = {};
                            self.RequestParser.handler(matchedURL);
                            // check the type of posted data
                            // console.log(headers["content-type"].split(";")[0])
                            // console.log(headers["content-type"].includes("application/json"))
                            // let form = new multiparty.Form();
                            // form.on("part", (part) => {
                            //     part.on("data", (chunk) => {
                            //         contentBuffer.push(chunk);
                            //         totalBytesInBuffer += chunk.length;
                            //     })
                            //     part.on("end", () => {
                            //         let buf = Buffer.concat(contentBuffer, totalBytesInBuffer);
                            //         fs.writeFile(path.join(process.cwd(), `/tmp/${part.filename}`), buf, (err) => {
                            //             console.log(err);
                            //         })
                            //     })
                            //     part.resume();
                            // })
                            // form.parse(req);
                            // form.parse(req, (err, fields, files) => {
                            //         console.log(fields);
                            //     })
                            // })
                            // req.on("data", function(data) {
                            //     contentBuffer.push(data);
                            //     totalBytesInBuffer += data.length
                            //     comingData += data;
                            // });
                            // req.on("end", function() {
                            //     contentBuffer = Buffer.concat(contentBuffer, totalBytesInBuffer);
                            //     console.log(comingData)
                            //     if (comingData.length > 0) {
                            //         if (
                            //             headers["content-type"] ===
                            //             "application/x-www-form-urlencoded"
                            //         ) {
                            //             comingData = querystring.parse(comingData);
                            //         } else if (headers["content-type"] === "application/json") {
                            //             comingData = JSON.parse(comingData);
                            //         } else if (
                            //             headers["content-type"] === "text/plain" ||
                            //             headers["content-type"] === "text/plain;charset=UTF-8"
                            //         ) {
                            //             try {
                            //                 comingData = JSON.parse(comingData);
                            //             } catch (e) {
                            //                 comingData = comingData;
                            //             }
                            //         }
                            //         req.data = comingData;
                            //     }
                            // let middleWares = matchedURL.middleWares;
                            // if (middleWares && middleWares.length > 0) {
                            //     var nexted = 0;
                            //     middleWares[0](req, res, next);

                            //     function next() {
                            //         nexted++;
                            //         if (middleWares.length <= nexted) {
                            //             return matchedURL.handler(req, res);
                            //         } else {
                            //             return middleWares[nexted](req, res, next);
                            //         }
                            //     }
                            // } else {
                            //     return matchedURL.handler(req, res);
                            // }
                            // });
                        } else {
                            res.writeHead(404);
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        res.writeHead(404);
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
                        if (
                            matchedURL.method.toLowerCase() == "delete"
                        ) {
                            res.statusCode = 200;
                            let headers = req.headers;
                            let comingData = "";
                            req.on("data", function(data) {
                                comingData += data;
                            });
                            req.on("end", function() {
                                if (comingData.length > 0) {
                                    if (
                                        headers["content-type"] ===
                                        "application/x-www-form-urlencoded"
                                    ) {
                                        comingData = querystring.parse(comingData);
                                    } else if (headers["content-type"] === "application/json") {
                                        comingData = JSON.parse(comingData);
                                    } else if (
                                        headers["content-type"] === "text/plain" ||
                                        headers["content-type"] === "text/plain;charset=UTF-8"
                                    ) {
                                        try {
                                            comingData = JSON.parse(comingData);
                                        } catch (e) {
                                            comingData = comingData;
                                        }
                                    }
                                    req.data = comingData;
                                }
                                let middleWares = matchedURL.middleWares;
                                if (middleWares && middleWares.length > 0) {
                                    var nexted = 0;
                                    middleWares[0](req, res, next);

                                    function next() {
                                        nexted++;
                                        if (middleWares.length <= nexted) {
                                            return matchedURL.handler(req, res);
                                        } else {
                                            return middleWares[nexted](req, res, next);
                                        }
                                    }
                                } else {
                                    return matchedURL.handler(req, res);
                                }
                            });
                        } else {
                            res.writeHead(404);
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        res.writeHead(404);
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
                        if (
                            matchedURL.method.toLowerCase() == "put"
                        ) {
                            res.statusCode = 200;
                            let headers = req.headers;
                            let comingData = "";
                            req.on("data", function(data) {
                                comingData += data;
                            });
                            req.on("end", function() {
                                if (comingData.length > 0) {
                                    if (
                                        headers["content-type"] ===
                                        "application/x-www-form-urlencoded"
                                    ) {
                                        comingData = querystring.parse(comingData);
                                    } else if (headers["content-type"] === "application/json") {
                                        comingData = JSON.parse(comingData);
                                    } else if (
                                        headers["content-type"] === "text/plain" ||
                                        headers["content-type"] === "text/plain;charset=UTF-8"
                                    ) {
                                        try {
                                            comingData = JSON.parse(comingData);
                                        } catch (e) {
                                            comingData = comingData;
                                        }
                                    }
                                    req.data = comingData;
                                }
                                let middleWares = matchedURL.middleWares;
                                if (middleWares && middleWares.length > 0) {
                                    var nexted = 0;
                                    middleWares[0](req, res, next);

                                    function next() {
                                        nexted++;
                                        if (middleWares.length <= nexted) {
                                            return matchedURL.handler(req, res);
                                        } else {
                                            return middleWares[nexted](req, res, next);
                                        }
                                    }
                                } else {
                                    return matchedURL.handler(req, res);
                                }
                            });
                        } else {
                            res.writeHead(404);
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        res.writeHead(404);
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
                        if (
                            matchedURL.method.toLowerCase() == "patch"
                        ) {
                            res.statusCode = 200;
                            let headers = req.headers;
                            let comingData = "";
                            req.on("data", function(data) {
                                comingData += data;
                            });
                            req.on("end", function() {
                                if (comingData.length > 0) {
                                    if (
                                        headers["content-type"] ===
                                        "application/x-www-form-urlencoded"
                                    ) {
                                        comingData = querystring.parse(comingData);
                                    } else if (headers["content-type"] === "application/json") {
                                        comingData = JSON.parse(comingData);
                                    } else if (
                                        headers["content-type"] === "text/plain" ||
                                        headers["content-type"] === "text/plain;charset=UTF-8"
                                    ) {
                                        try {
                                            comingData = JSON.parse(comingData);
                                        } catch (e) {
                                            comingData = comingData;
                                        }
                                    }
                                    req.data = comingData;
                                }
                                let middleWares = matchedURL.middleWares;
                                if (middleWares && middleWares.length > 0) {
                                    var nexted = 0;
                                    middleWares[0](req, res, next);

                                    function next() {
                                        nexted++;
                                        if (middleWares.length <= nexted) {
                                            return matchedURL.handler(req, res);
                                        } else {
                                            return middleWares[nexted](req, res, next);
                                        }
                                    }
                                } else {
                                    return matchedURL.handler(req, res);
                                }
                            });
                        } else {
                            res.writeHead(404);
                            return this.errorPage ?
                                this.errorPage(req, res) :
                                self.errorPage(req, res);
                        }
                    } else {
                        res.writeHead(404);
                        return this.errorPage ?
                            this.errorPage(req, res) :
                            self.errorPage(req, res);
                    }
                }
            }
        };
    }
    setConfig(options) {
        this.timeout = options.timeout;
        this.session = options.session;
        this.type = options.type;
        this.setCookie = options.setCookie;
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
            self.RequestParser = new RequestParser(req, res);
            req.flash = flash;
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
                res.writeHead(res.statusCode, { "content-type": "application/json" });
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
            // console.log(url.query)
            // let query = querystring.parse(`${url.query}`);
            // console.log(query)
            // url.query = query;
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
                // Object.keys(self.classes).map(clas => {
                //     console.log(clas)
                // })
                // console.log(self.classesRoutes)
                let matchedReq =
                    requests[requests.length > 1 ? requests.length - 1 : 0];
                if (matchedReq) {

                    let matchedClass = self.classesRoutes[matchedReq];
                    if (matchedClass) {
                        matchedClass.req = req;
                        matchedClass.res = res;
                        if (matchedClass.globalMiddleWares) {
                            if (matchedClass.globalMiddleWares.length > 0) {
                                var nexted = 0;
                                matchedClass.req = req;
                                matchedClass.res = res;
                                matchedClass.serveFiles(() => {
                                    return matchedClass.globalMiddleWares[0](req, res, next);
                                });

                                function next() {
                                    nexted++;
                                    if (matchedClass.globalMiddleWares.length <= nexted) {
                                        matchedClass.init();
                                    } else {
                                        matchedClass.serveFiles(() => {
                                            return matchedClass.globalMiddleWares[nexted](
                                                req,
                                                res,
                                                next
                                            );
                                        });
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
                        return helpers
                            .staticFiles(
                                req,
                                res,
                                req.pathname,
                                self.staticFolder,
                                self.cacheControl
                            )
                            .catch(src => {
                                res.writeHead(404);
                                self.errorPage(req, res);
                            });
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