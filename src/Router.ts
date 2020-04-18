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
class Router implements RouterInterface {
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
    Server.routers.set(this.base, this);
    this.errorPage = this.errorPage || Server.errorPage;
    this.staticFolder = this.staticFolder || Server.serverOptions.staticFolder;
    // console.log(this.staticFolder)
    // this.globalMiddleWares.push(this.serverAssetsMiddleWare.bind(this))
    this.serverAssetsMiddleWare();
    this.bootstrapRoutes();
    // console.log(this.getRouters)
    // console.log(this.getRouters)
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
    if(path.extname(pathToSkip)) {
      pathToSkip = req.pathname.replace(/\.[^.]*$/, "");
      console.log(pathToSkip);
    }
    let matchedRoute:Route;
    switch(method) {
      case "get":
        // console.log(method)
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
      return matchedRoute.handle(this, req, res);
    } else {
      res.status(404);
      // return error page
      return this.errorPage(req, res);
    }
  }
  // method to handle routers when build
  bootstrapRoutes() {
    this.getRouters = Array.from(this.getRouters).map((route:any) => {
      if(route instanceof Route) {
        // console.log(route);
        return route;
      } else {
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
      let parsedRoute = new Route(route, this.base);
      let corsObject = Object.assign({}, route.cors, this.cors);
      parsedRoute.setCors(corsObject);
      return parsedRoute;
    })
    this.putRouters = Array.from(this.putRouters).map((route:any) => {
      if(route instanceof Route) {
        return route;
      }
      let parsedRoute = new Route(route, this.base);
      let corsObject = Object.assign({}, route.cors, this.cors);
      parsedRoute.setCors(corsObject);
      return parsedRoute;
    })
    this.patchRouters = Array.from(this.patchRouters).map((route:any) => {
      if(route instanceof Route) {
        return route;
      }
      let parsedRoute = new Route(route, this.base);
      let corsObject = Object.assign({}, route.cors, this.cors);
      parsedRoute.setCors(corsObject);
      return parsedRoute;
    })
    this.deleteRouters = Array.from(this.deleteRouters).map((route:any) => {
      if(route instanceof Route) {
        return route;
      }
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
    newRouter.base = newRouter.base || this.base;
    newRouter.base = path.join(this.base, newRouter.base).split(path.sep).join("/")
    newRouter.cors = Object.assign({}, this.cors, newRouter.cors);
    newRouter.globalMiddleWares = newRouter.globalMiddleWares || [];
    newRouter.globalMiddleWares.unshift(...this.globalMiddleWares);
    newRouter.build();
    // console.log(newRouter.getRouters);
    // this.pushGlobalMiddleWares(newRouter.getRouters, newRouter.globalMiddleWares, newRouter.cors);
    // this.pushGlobalMiddleWares(newRouter.postRouters, newRouter.globalMiddleWares, newRouter.cors);
    // this.pushGlobalMiddleWares(newRouter.putRouters, newRouter.globalMiddleWares, newRouter.cors);
    // this.pushGlobalMiddleWares(newRouter.patchRouters, newRouter.globalMiddleWares, newRouter.cors);
    // this.pushGlobalMiddleWares(newRouter.deleteRouters, newRouter.globalMiddleWares, newRouter.cors);
    // this.getRouters.push(...newRouter.getRouters)
    // this.postRouters.push(...newRouter.postRouters)
    // this.putRouters.push(...newRouter.putRouters)
    // this.patchRouters.push(...newRouter.patchRouters)
    // this.deleteRouters.push(...newRouter.deleteRouters)
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
      case "post":
        this.postRouters.push(parsedRoute)
      case "put":
        this.putRouters.push(parsedRoute)
      case "patch":
        this.patchRouters.push(parsedRoute)
      case "delete":
        this.deleteRouters.push(parsedRoute)
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
      // console.log(staticFolder);
      // let url = `${this.base}/${staticFolder.url}/*`.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
      // .replace(/^(.+?)\/*?$/, "$1")
      // .replace(/\s+/gi, "");
      // let urlPattern = new UrlPattern(url);
      // console.log(urlPattern, url)
      // if(req.method !== "get") {
      //   // continue
      //   return next();
      // }
      // // console.log(staticFolder);
      if (staticFolder) {
        var sourceFolder = path.resolve("/", staticFolder.path);
        // sourceFolder = sourceFolder.split(path.sep).join("/");
        var mimeTypes: any = config.mimeTypes
        var dirName = path.join("", `${sourceFolder}`);
        let fileSource;
        fileSource = path.join(process.cwd(), req.pathname);
        fileSource = fileSource.split(path.sep).join("/");
        // var existFile = fs.existsSync(fileSource);
        let promisifiedState = util.promisify(fs.lstat);
        let fileState = (await promisifiedState(fileSource));
        if (fileState.isFile()) {
          var fileStream = fs.createReadStream(fileSource);
          let extName: any = path.extname(req.pathname);
          var headers = {
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
