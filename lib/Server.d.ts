/// <reference types="node" />
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
import { ServerInterface, MiddleWareInterface, ServerConfigurations, RouterInterface, OptionalObject } from './interfaces/index';
import Request from "./Request";
import Response from "./Response";
import RequestParser from "./requestParser";
import Route from "./Route";
declare class BaseServer implements ServerInterface {
    Server: http.Server;
    serverOptions?: ServerConfigurations;
    routers: Map<string, RouterInterface>;
    locals: Map<string, any>;
    settings: Map<string, any>;
    engines: Map<string, any>;
    cache: OptionalObject;
    mountPath: string;
    parent: any;
    middleWares: MiddleWareInterface[];
    statics: Route[];
    RequestParser: RequestParser;
    constructor();
    errorPage(req: Request, res: Response): any;
    use(func: MiddleWareInterface): this;
    log(req: Request, res: Response): void;
    chooseHandler(req: Request, res: Response): any;
    setConfig(options: ServerConfigurations): this;
    initServer(cb?: Function): this;
    path(): string;
    addMimeTypes(extention: string, mimeType: string): this;
    static(options: {
        url: string;
        path: string;
        absolute?: boolean;
        middleWares?: [];
    }): void;
}
declare const Server: BaseServer;
export { Server, BaseServer };
