import { RouteInterface, HandlerInterface, MiddleWareInterface, CorsInterface } from "./interfaces/index";
import Request from "./Request";
import Response from "./Response";
import Router from "./Router";
declare class Route implements RouteInterface {
    url: string;
    method: string;
    handler: HandlerInterface;
    middleWares?: MiddleWareInterface[];
    cors?: CorsInterface;
    base?: string;
    parsedUrl?: string;
    routePattern?: any;
    params?: any;
    constructor(options: RouteInterface, base: string);
    parseUrl?(): any;
    setCors?(corsObject: CorsInterface): void;
    handle?(Router: Router, req: Request, res: Response): any;
}
export default Route;
