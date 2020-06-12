/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: HTTP Request Route Object
 * ==============================================================================
 */
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
    assetsPath?: boolean;
    constructor(options: RouteInterface, base: string);
    parseUrl?(): any;
    setCors?(corsObject: CorsInterface): void;
    handle?(options: {
        Router?: Router;
        req: Request;
        res: Response;
    }): any;
}
export default Route;
