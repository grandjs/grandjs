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
import {RouteInterface, RouterInterface, HandlerInterface, MiddleWareInterface, CorsInterface} from "./interfaces/index";
import RouteParser from "url-pattern";
import Request from "./Request";
import Response from "./Response";
import Router from "./Router";
import MiddleWare from "./MiddleWare";
import cors from "cors";
class Route implements RouteInterface{
  url:string;
  method:string;
  handler:HandlerInterface
  middleWares?: MiddleWareInterface[];
  cors?:CorsInterface
  base?:string
  parsedUrl?:string
  routePattern?:any
  params?:any
  assetsPath?: boolean = false;
  // parseUrl?():any
  constructor(options:RouteInterface, base:string) {
    this.url = options.url;
    this.method = options.method.toLowerCase();
    this.handler = options.handler;
    this.middleWares = options.middleWares || [];
    this.cors = options.cors || {};
    this.base = base;
    this.assetsPath = options.assetsPath || false;
    this.parseUrl();
  }
  // method to parse url
  parseUrl?():any {
      this.url = `${this.base}/${this.url}`.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
      .replace(/^(.+?)\/*?$/, "$1")
      .replace(/\s+/gi, "");
      let routePattern:any = new RouteParser(this.url);
      let values:any[] = [];
      let joinedValues:string;
      routePattern.ast.map((tag:any) => {
        values.push(tag.value);
      });
      joinedValues = values.join("");
      joinedValues = joinedValues.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
      .replace(/^(.+?)\/*?$/, "$1");
      this.parsedUrl = joinedValues;
      this.routePattern = routePattern;
  }
  // method to set cors
  setCors?(corsObject:CorsInterface) {
    this.cors = corsObject;
    function corsMiddleWare(req: any, res: any, next: any) {
      return cors(this.cors)(req, res, next);
    }
    this.middleWares.unshift(corsMiddleWare);
  }
  // method to handle the route request
  handle?(Router:Router, req:Request, res:Response):any {
    // check if there is native parsing or not
    if(Router.serverOptions.nativeParsing === true) {
      if(this.method === "get") {
        return MiddleWare.next(this, req, res);
      } else {
        return Router.requestParser.handler(this, req, res)
      }
    } else {
      // continue to next middleware
      return MiddleWare.next(this, req, res);
    }
  }
}

export default Route
