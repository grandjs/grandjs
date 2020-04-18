/// <reference types="node" />
import http from "http";
import { ServerInterface, MiddleWareInterface, ServerConfigurations, RouterInterface, OptionalObject } from './interfaces/index';
import Request from "./Request";
import Response from "./Response";
import RequestParser from "./requestParser";
declare class BaseServer implements ServerInterface {
    Server: http.Server;
    serverOptions?: ServerConfigurations;
    routers: Map<string, RouterInterface>;
    locals: any;
    settings: object;
    engines: object;
    cache: OptionalObject;
    mountPath: string;
    parent: any;
    middleWares: MiddleWareInterface[];
    RequestParser: RequestParser;
    constructor();
    errorPage(req: Request, res: Response): any;
    use(func: MiddleWareInterface): this;
    log(req: Request, res: Response): void;
    chooseHandler(req: Request, res: Response): any;
    setConfig(options: ServerConfigurations): this;
    initServer(): this;
    engine(ext: any[], fn: Function): this;
    set(setting: any, val?: any): any;
    get(setting: any): any;
    path(): string;
    enabled(setting: any): boolean;
    disabled(setting: any): boolean;
    enable(setting: any): any;
    disable(setting: any): any;
    logerror(err: any): void;
}
declare const Server: BaseServer;
export { Server, BaseServer };
