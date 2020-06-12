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
import { RouterInterface, CorsInterface, MiddleWareInterface, StaticFolderInterface, ServerConfigurations } from './interfaces/index';
import Request from "./Request";
import Response from "./Response";
import RequestParser from "./requestParser";
import Route from "./Route";
declare class Router implements RouterInterface {
    [key: string]: any;
    id: string;
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
    res?: Response;
    requestParser: RequestParser;
    serverOptions?: ServerConfigurations;
    statics: Route[];
    child: boolean;
    constructor(options?: {
        base?: string;
        staticFolder?: StaticFolderInterface;
    });
    use(func: MiddleWareInterface): this;
    build(): this;
    init(): this;
    chooseRoute(req: Request, res: Response): any;
    bootstrapRoutes(): void;
    useRouter(RouterClass: any): this;
    assignChildRouterRoutes(childRouter: Router): this;
    addRoute(route: Route): this;
    setBase(): void;
    pushGlobalMiddleWares(routers: Route[], globalMiddleWares: MiddleWareInterface[], classCors: CorsInterface): void;
    resolveRoutesWithBase: () => void;
    corsMiddleWare(req: any, res: any, next: any): any;
    serveAssets(req: Request, res: Response, next: Function): Promise<any>;
    static(options: {
        url: string;
        path: string;
        absolute?: boolean;
        middleWares?: [];
    }): void;
    serverAssetsMiddleWare(): void;
}
export default Router;
