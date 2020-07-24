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
import { RouterInterface, CorsInterface, MiddleWareInterface, RequestInterface, ResponseInterface, RouteInterface, StaticFolderInterface, ServerConfigurations} from './interfaces/index';
import path from "path";
import cors from "cors";
import {Server} from "./Server"
import Request from "./Request";
import Response from "./Response";
import RequestParser from "./requestParser";
import config from './config';
import util from "util";
import fs from "fs";
import Route from "./Route";
import UrlPattern from 'url-pattern';
import helpers from './helpers';
class Router implements RouterInterface {
  [key:string]:any
  id: string
  options: any;
  staticFolder: StaticFolderInterface;
  serveAssetsMiddleWare: MiddleWareInterface;
  base: string;
  getRouters: Route[];
  postRouters: Route[];
  putRouters: Route[];
  patchRouters: Route[];
  deleteRouters: Route[];
  globalMiddleWares: MiddleWareInterface[];
  errorPage?: (req: Request, res: Response) => any;
  cors?: CorsInterface;
  req?: Request;
  res?: Response
  requestParser: RequestParser
  serverOptions?: ServerConfigurations
  statics: Route[]
  child:boolean = false;
  constructor(options?: { base?: string, staticFolder?: StaticFolderInterface }) {
    this.options = options || {};
    this.setBase();
    this.getRouters = this.getRouters || [];
    this.postRouters = this.postRouters || [];
    this.deleteRouters = this.deleteRouters || [];
    this.putRouters = this.putRouters || [];
    this.patchRouters = this.patchRouters || [];
    this.globalMiddleWares = this.globalMiddleWares || [];
    this.serverOptions = this.serverOptions || {};
    this.statics = this.statics || [];
    // this.cors = this.cors || {
    // }
    this.staticFolder = this.options.staticFolder || this.staticFolder;
  }
  use(func: MiddleWareInterface): this {
    this.globalMiddleWares.push(func);
    return this;
  }
  public build(): this {
    this.id = Math.random().toString(36).substr(2, 9)
    if(!this.child) {
      Server.routers.set(this.base, this);
    }
    this.errorPage = this.errorPage || Server.errorPage;
    this.staticFolder = this.staticFolder || Server.serverOptions.staticFolder;
    this.serverAssetsMiddleWare();
    this.bootstrapRoutes();
    return this;
  }
  public init(): this {
    this.chooseRoute(this.req, this.res);
    return this;
  }
  // method to choose route
  chooseRoute(req: Request, res:Response) {
    let method = req.method;
    let pathToSkip:string = req.pathname;
    let foundStaticRoute = this.statics.find(route => {
      let regexResult = route.routePattern.match(pathToSkip)
      if(regexResult) {
          return route;
      }
    })
    // check if found staticsroute is exist
    if(foundStaticRoute) {
      return foundStaticRoute.handle({Router: this, req, res})
    } else {
      let matchedRoute:Route;
      switch(method) {
        case "get":
          matchedRoute = this.statics.find(route => route.routePattern.match(pathToSkip))
        case "get":
          matchedRoute = this.getRouters.find(route => route.routePattern.match(pathToSkip))
          break;
        case "post":
          matchedRoute = this.postRouters.find(route => route.routePattern.match(pathToSkip))
          break;
        case "delete":
          matchedRoute = this.deleteRouters.find(route => route.routePattern.match(pathToSkip))
          break;
        case "put":
          matchedRoute = this.putRouters.find(route => route.routePattern.match(pathToSkip))
          break;
        case "patch":
          matchedRoute = this.patchRouters.find(route => route.routePattern.match(pathToSkip))
          break;
        default:
          res.status(404);
          return this.errorPage(req, res);
      }
      if(matchedRoute) {
        let params = matchedRoute.routePattern.match(pathToSkip);
        req.params = params;
        // call handle function
        return matchedRoute.handle({Router:this, req:req, res:res});
      } else {
        res.status(404);
        // return error page
        return this.errorPage(req, res);
      }
    }
  }
  // method to handle routers when build
  bootstrapRoutes() {
    this.getRouters = Array.from(this.getRouters).map((route:any) => {
      if(route instanceof Route) {
        return route;
      } else {
        route.handler = route.handler.bind(this);
        let parsedRoute = new Route(route, this.base);
        let corsObject = Object.assign({}, route.cors, this.cors);
        parsedRoute.setCors(corsObject);
        return parsedRoute;
      }
    })
    this.postRouters = Array.from(this.postRouters).map((route:any) => {
      if(route instanceof Route) {
        return route;
      }
      route.handler = route.handler.bind(this);
      let parsedRoute = new Route(route, this.base);
      let corsObject = Object.assign({}, route.cors, this.cors);
      parsedRoute.setCors(corsObject);
      return parsedRoute;
    })
    this.putRouters = Array.from(this.putRouters).map((route:any) => {
      if(route instanceof Route) {
        return route;
      }
      route.handler = route.handler.bind(this);
      let parsedRoute = new Route(route, this.base);
      let corsObject = Object.assign({}, route.cors, this.cors);
      parsedRoute.setCors(corsObject);
      return parsedRoute;
    })
    this.patchRouters = Array.from(this.patchRouters).map((route:any) => {
      if(route instanceof Route) {
        return route;
      }
      route.handler = route.handler.bind(this);
      let parsedRoute = new Route(route, this.base);
      let corsObject = Object.assign({}, route.cors, this.cors);
      parsedRoute.setCors(corsObject);
      return parsedRoute;
    })
    this.deleteRouters = Array.from(this.deleteRouters).map((route:any) => {
      if(route instanceof Route) {
        return route;
      }
      route.handler = route.handler.bind(this);
      let parsedRoute = new Route(route, this.base);
      let corsObject = Object.assign({}, route.cors, this.cors);
      parsedRoute.setCors(corsObject);
      return parsedRoute;
    })
  }
  useRouter(RouterClass: any): this {
    let newRouter = <Router>new RouterClass();
    newRouter.req = this.req;
    newRouter.res = this.res;
    newRouter.base = newRouter.base || "/";
    newRouter.child = true;
    newRouter.cors = Object.assign({}, this.cors, newRouter.cors);
    newRouter.globalMiddleWares = newRouter.globalMiddleWares || [];
    if(newRouter.child) {
      this.assignChildRouterRoutes(newRouter);
      helpers.assignPrototype(this, RouterClass);
    } else {
      newRouter.globalMiddleWares.unshift(...this.globalMiddleWares);
      newRouter.build();
    }
    return this;
  }
  // method to assign child router routes to parent
  assignChildRouterRoutes(childRouter:Router) {
    let allRoutes = [...childRouter.getRouters, ...childRouter.postRouters, ...childRouter.patchRouters, ...childRouter.putRouters, ...childRouter.deleteRouters]
    allRoutes.map((route) => {
      route.url = path.join(childRouter.base, route.url);
      route.url = route.url.split(path.sep).join("/");
      route.middleWares = route.middleWares || [];
      route.middleWares.unshift(...childRouter.globalMiddleWares);
      route.cors = Object.assign({}, childRouter.cors, route.cors || {});
      switch(route.method.toLowerCase()) {
        case "get":
          this.getRouters.push(route);
          break;
        case "post":
          this.postRouters.push(route);
          break;
        case "put":
          this.putRouters.push(route);
          break;
        case "patch":
          this.patchRouters.push(route);
          break;
        case "delete":
          this.deleteRouters.push(route);
          break;
      }
    })
    return this;
  }
  addRoute(route: Route): this {
    let handler = route.handler;
    let method = route.method.toLowerCase();
    let url = route.url;
    let middleWares = route.middleWares;
    let setOptions = {
      handler,
      method,
      url,
      middleWares
    }
    let parsedRoute = new Route(setOptions, this.base)
    let corsObject = Object.assign({}, route.cors, this.cors);
    parsedRoute.setCors(corsObject);
    switch (method) {
      case "get":
        this.getRouters.push(parsedRoute)
        break;
      case "post":
        this.postRouters.push(parsedRoute)
        break;
      case "put":
        this.putRouters.push(parsedRoute)
        break;
      case "patch":
        this.patchRouters.push(parsedRoute)
        break;
      case "delete":
        this.deleteRouters.push(parsedRoute)
        break;
    }
    return this;
  }
  setBase() {
    this.base = this.options.base || this.base || "";
    this.base =
      this.base
        .replace(/(https?:\/\/)|(\/)+/g, "$1$2")
        .replace(/^(.+?)\/*?$/, "$1") || "/";
  }
  // push global middleWares
  pushGlobalMiddleWares(routers: Route[], globalMiddleWares: MiddleWareInterface[], classCors: CorsInterface) {
    routers.forEach((router) => {
      router.cors = Object.assign({}, router.cors, classCors)
      router.middleWares.unshift(...globalMiddleWares);
    })
  }
  resolveRoutesWithBase = () => {
    this.getRouters.forEach((obj) => {
      obj.url = path.join(this.base, obj.url);
      obj.url = obj.url.split(path.sep).join("/");
    })
    this.postRouters.forEach((obj) => {
      obj.url = path.join(this.base, obj.url);
      obj.url = obj.url.split(path.sep).join("/");
    })
    this.deleteRouters.forEach((obj) => {
      obj.url = path.join(this.base, obj.url);
      obj.url = obj.url.split(path.sep).join("/");
    })
    this.putRouters.forEach((obj) => {
      obj.url = path.join(this.base, obj.url);
      obj.url = obj.url.split(path.sep).join("/");
    })
    this.patchRouters.forEach((obj) => {
      obj.url = path.join(this.base, obj.url);
      obj.url = obj.url.split(path.sep).join("/");
    })
  }
  corsMiddleWare(req: any, res: any, next: any) {
    let corsObject = this.cors;
    return cors(corsObject)(req, res, next);
  }
  async serveAssets(req: Request, res: Response, next: Function) {
    try {
      let staticFolder = this.staticFolder;
      if (staticFolder) {
        let sourceFolder = path.resolve("/", staticFolder.path);
        let pathname = req.pathname.split(staticFolder.url)[1];
        let mimeTypes: any = config.mimeTypes
        let dirName = path.join("", `${sourceFolder}`);
        let fileSource;
        fileSource = path.join(staticFolder.path, pathname);
        fileSource = fileSource.split(path.sep).join("/");
        let promisifiedState = util.promisify(fs.lstat);
        let fileState = (await promisifiedState(fileSource));
        if (fileState.isFile()) {
          let fileStream = fs.createReadStream(fileSource);
          let extName: any = path.extname(pathname);
          let headers = {
            "Content-Type": mimeTypes[extName] || 'application/octet-stream',
            // 'Cache-Control': `public, max-age=${cacheControl || 'no-cache'}`,
            'Content-Length': fileState.size
          };
          res.writeHead(200, headers);
          return fileStream.pipe(res);
        } else {
          res.statusCode = 404;
          return this.errorPage(req, res);
        }
      } else {
        res.statusCode = 404;
        return this.errorPage(req, res);
      }
    } catch (err) {
      res.status(404);
      return this.errorPage(req, res);
    }

  }
  // static method to serve static files
    static(options:{url:string, path:string, absolute?:boolean, middleWares?:[]}) {
        options.absolute = options.absolute || true;
        let middleWares = options.middleWares || [];
        let route =  {
            url: `/${options.url}${options.absolute ? "/*": ""}`,
            method: "GET",
            middleWares: middleWares,
            handler: helpers.serveAssets.bind({staticFolder: {url:options.url, path:options.path}, errorPage: this.errorPage || Server.errorPage}),
            assetsPath: true
        }
        this.statics.push(new Route(route, this.base));
    }
  // method to serve assets
  serverAssetsMiddleWare() {
    // check if the static folder is exist
    if (this.staticFolder) {
      // this.globalMiddleWares.push(this.serveAssets.bind(this));
      let route =  {
        url: `/${this.staticFolder.url}/*`,
        method: "GET",
        handler: this.serveAssets.bind(this),
        assetsPath: true
      }
      this.getRouters.unshift(route)
    }
  }
}



export default Router
