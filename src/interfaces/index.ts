/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: Package Interfaces
 * ==============================================================================
 */
///<reference types="node"/>
import http from "http";
import Request from "../Request";
import Response from "../Response";
import Route from "../Route";
import Router from "../Router";
import Url from "url";
import RequestParser from "../requestParser";
export interface OptionalObject {
  [key:string]:any
}
export interface RequestInterface{
    method:string,
    path:string,
    url:string,
    pathname:string
    href:string,
    parsedUrl:Url.Url
    statusCode:number
    params: OptionalObject,
    query: OptionalObject,
    data: OptionalObject,
    body: OptionalObject,
    files: OptionalObject,
    Server: ServerInterface
}
export interface ResponseInterface{
    redirect(url:string):this
    status(status:number, message?:string):this
    json(object:object):this
}
export interface MiddleWareInterface{
    (req:Request, res:Response, next:Function):any
}
export interface HandlerInterface{
    (req:Request, res:Response):any
}
export interface RouteInterface{
    url:string,
    method:string,
    cors?:CorsInterface,
    middleWares?:MiddleWareInterface[],
    handler:HandlerInterface
    parseUrl?:any
    base?:string
    parsedUrl?:string
    routePattern?:any
    params?:any
    setCors?(corsObect:CorsInterface):any
    handle?(router:Router, req: Request, res:Response):any
}
export interface CorsInterface{
    origin?:string,
    methods?:string,
    preflightContinue?:boolean,
    optionsSuccessStatus?:number
}
export interface StaticFolderInterface{
  path: string,
  url: string
}
export interface RouterInterface {
    id:string
    base:string
    getRouters:Route[]
    postRouters:Route[]
    putRouters:Route[]
    patchRouters:Route[]
    deleteRouters:Route[]
    globalMiddleWares:MiddleWareInterface[],
    cors?:CorsInterface,
    use(func:MiddleWareInterface):this
    build():this
    init():this
    errorPage?(req:Request, res:Response):any
    useRouter(Router:RouterInterface):this
    addRoute(route:Route):this
    options:any
    staticFolder:StaticFolderInterface
    serveAssets:MiddleWareInterface,
    serveAssetsMiddleWare:MiddleWareInterface,
    setBase():any
    pushGlobalMiddleWares(routers:Route[], globalMiddleWares:MiddleWareInterface[], classCors:CorsInterface):any,
    resolveRoutesWithBase():any,
    corsMiddleWare(req:any, res:any, next:any):any
    serverAssetsMiddleWare():any
    req?:Request,
    res?:Response,
    bootstrapRoutes():any
    chooseRoute(req: Request, res:Response):any
    requestParser:RequestParser
    serverOptions?: ServerConfigurations
}
export interface ServerConfigurations{
    http?: any;
    port?:number,
    cacheControl?:any,
    staticFolder?:StaticFolderInterface,
    logger?:boolean,
    httpsMode?:{
        key?:string,
        cert?:string,
    },
    session?:boolean
    ENCRYPTION_KEY?:string,
    setCookie?: {
        expires?: {
            days?: number,
            minutes?:number
        }
    },
    errorPage?(req:Request, res:Response):any,
    middleWares?: MiddleWareInterface[],
    cors?:CorsInterface,
    Server?:http.Server
    nativeParsing?: boolean

}
export interface ServerInterface{
    use(func:MiddleWareInterface):this
    middleWares:MiddleWareInterface[]
    Server:http.Server
    serverOptions?: ServerConfigurations
    routers:Map<string,RouterInterface>
    errorPage(req:Request, res:Response):any,
    log(req:Request, res:Response):any,
    initServer(cb:Function):any
    chooseHandler(req:Request, res:Response):any
    setConfig(options:ServerConfigurations):this
    locals?: Map<string, any>
    settings: Map<string, any>
    engines: Map<string, any>
    cache: object
    parent:any
    mountPath:string
    RequestParser:RequestParser
    addMimeTypes(extention:string, mimeType:string):this
}

export interface HelpersInterface {

}


export interface NodeInterface {
  type:string | Function,
  nodeValue?:any,
  props:OptionalObject,
  children:any[]

}
