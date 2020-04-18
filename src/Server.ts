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
import http from "http";
import fs from "fs";
import querystring from "querystring";
import path from "path";
import url from "url";
import RouteParser from "url-pattern";
import multiparty from "multiparty";
import cors from "cors";
// import {compile} from  "util";
import config from "./config";
import { ServerInterface, MiddleWareInterface, CorsInterface, RequestInterface, ResponseInterface, ServerConfigurations, RouteInterface, RouterInterface, OptionalObject } from './interfaces/index';
import Request from "./Request";
import Response from "./Response";
import setprototypeof from "setprototypeof";
import helpers from './helpers';
import Router from "./Router";
import MiddleWare from "./MiddleWare";
import RequestParser from "./requestParser";
let trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';
class BaseServer implements ServerInterface {
    Server: http.Server
    serverOptions?: ServerConfigurations
    routers: Map<string, RouterInterface>
    locals: Map<string, any>;
    settings: Map<string, any>;
    engines: Map<string, any>
    cache: OptionalObject
    mountPath: string;
    parent: any
    middleWares: MiddleWareInterface[]
    RequestParser: RequestParser
    constructor() {
        this.routers = new Map();
        this.serverOptions = {};
        this.locals = new Map();
        this.settings = new Map();
        this.engines = new Map();
        this.cache = {};
        this.middleWares = [];
    }
    errorPage(req: Request, res: Response): any {
        return res.status(404).end("not found route");
    }
    use(func: MiddleWareInterface): this {
        this.middleWares.push(func)
        return this;
    }
    log(req: Request, res: Response) {
        throw new Error("Method not implemented.");
    }
    chooseHandler(req: Request, res: Response) {
        let requests: Router[] = []
        Array.from(this.routers.keys()).map((item) => {
            let routerRegex = new RouteParser(`${item}*`)
            let regexResult = routerRegex.match(req.pathname);
            if (regexResult && typeof regexResult._ === "string" && !regexResult._.includes(item)) {
                let split = req.pathname.replace(regexResult._, "");
                let splittedPath = regexResult._.split("/");
                let foundRouter: Router = this.routers.get(item);
                if (foundRouter) {
                    if (splittedPath.length > 1) {
                        requests.push(foundRouter);
                        // } else if(splittedPath.length === 1) {
                        //     let trimmed = `${splittedPath[0]}`.replace(/\s+/gi, "");
                        //     if(trimmed.length === 0) {
                        //         requests.push(foundRouter);
                        //     }
                    } else if (split === item || routerRegex.match(split)) {
                        requests.push(foundRouter);
                    }
                }
            }
        })
        requests.sort((a, b) => {
            if (a.base.length > b.base.length) {
                return 1;
            } else {
                return -1;
            }
        })
        let matchedRouter = requests[requests.length > 1 ? requests.length - 1 : 0];;
        if (matchedRouter) {
            matchedRouter.requestParser = this.RequestParser;
            matchedRouter.req = req;
            matchedRouter.res = res;
            matchedRouter.serverOptions = Object.assign(matchedRouter.serverOptions, this.serverOptions);
            let allMiddleWares: MiddleWareInterface[] = [matchedRouter.corsMiddleWare.bind(matchedRouter), ...this.middleWares, ...matchedRouter.globalMiddleWares];
            if (allMiddleWares.length > 0) {
                // call middleware handler
                return MiddleWare.handleRoutersMiddleWares(req, res, allMiddleWares, matchedRouter, this)
            } else {
                // initialize router
                matchedRouter.init();
            }
        } else {
            res.status(404);
            this.errorPage(req, res);
        }

    }
    setConfig(options: ServerConfigurations) {
        this.serverOptions = options || {};
        this.serverOptions.http = this.serverOptions.http || http;
        this.serverOptions.port = this.serverOptions.port || 3000;
        this.serverOptions.staticFolder = this.serverOptions.staticFolder || { path: path.join(process.cwd(), "/public"), url: "/public" };
        this.serverOptions.nativeParsing = this.serverOptions.nativeParsing || false;
        this.settings = Object.assign(this.settings, this.serverOptions);
        this.errorPage = this.serverOptions.errorPage || this.errorPage;
        return this;
    }
    // initializer
    initServer(cb?:Function) {
        let args = [];
        let callBack = (req: Request, res: Response) => {
            // instantiate new request
            let request = new Request(req.socket, req, this);
            this.RequestParser = new RequestParser(req, res);
            // instantiate new response
            let BindResponse = new Response(request, res);
            this.chooseHandler(request, res);
        }
        if(this.serverOptions.httpsMode) {
            args[0] = this.serverOptions.httpsMode;
            args[1] = callBack;
        } else {
            args[0] = callBack;
        }
        this.Server = this.serverOptions.http.createServer(...args)
        this.Server.listen(this.serverOptions.port, () => {
            if(cb) {
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
    addMimeTypes(extention:string, mimeType:string) {
        try {
            config.extenstions.push(extention);
            config.mimeTypes[extention] = mimeType;
            return this;
        } catch (e) {
            throw e;
        }
    }
}
const Server = new BaseServer()
export { Server, BaseServer };
