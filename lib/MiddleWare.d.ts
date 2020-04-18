/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: MiddleWare Wrapper
 * ==============================================================================
 */
import Request from './Request';
import Response from './Response';
import Router from "./Router";
import Route from "./Route";
import { MiddleWareInterface } from './interfaces/index';
declare class MiddleWare {
    next(matchedRoute: Route, req: Request, res: Response): any;
    handleRoutersMiddleWares(req: Request, res: Response, allMiddleWares: MiddleWareInterface[], matchedRouter: Router, Server: any): any;
}
declare const _default: MiddleWare;
export default _default;
