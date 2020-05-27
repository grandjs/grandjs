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
import { ServerInterface, MiddleWareInterface, CorsInterface, RequestInterface, ResponseInterface, ServerConfigurations, RouteInterface, RouterInterface } from './interfaces/index';
// import Server from "./Server";


class MiddleWare {
  next(matchedRoute: Route, req: Request, res: Response) {
    let middleWares: MiddleWareInterface[] = matchedRoute.middleWares;
    if (middleWares && middleWares.length > 0) {
      
      var nexted = 0;
      return middleWares[0](req, res, this.nextFunction(nexted, middleWares, matchedRoute, req, res));
    } else {
      return matchedRoute.handler(req, res);
    }
  }
  private nextFunction(nexted:number, middleWares:MiddleWareInterface[], matchedRoute:Route, req:Request, res:Response) {
    return function next() {
      nexted++;
      if (middleWares.length <= nexted) {
        return matchedRoute.handler(req, res);
      } else {
        return middleWares[nexted](req, res, next);
      }
  }
  }
  // method to handle routers middlewares
  handleRoutersMiddleWares(req: Request, res: Response, allMiddleWares: MiddleWareInterface[], matchedRouter: Router, Server: any) {
    function next() {
        nexted++;
        if (allMiddleWares.length <= nexted) {
          matchedRouter.init();
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
    let nexted: number = 0;
    return allMiddleWares[nexted](req, res, next);
  }
}

export default new MiddleWare();
