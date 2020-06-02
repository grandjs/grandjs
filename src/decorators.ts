/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: Package Decorators
 * ==============================================================================
 */

// Dependencies
import Router from "./Router";
import {MiddleWareInterface, CorsInterface} from "./interfaces/index";
// GET Decorator

const decorator = (options:{url:string,middleWares?:MiddleWareInterface[], cors?:CorsInterface}, routersType:string, methodType:string) => {
    return (target:Router, key:string) => {
        let method = target[key];
        target.getRouters = target.getRouters || [];
        // check if there is options passed
        if(typeof options === "object") {
            options.middleWares = options.middleWares || [];
            let route = {url: options.url, middleWares: options.middleWares, method: methodType, handler: method};
            target[routersType].push(route);
        } else {
            let route = method();
            route.route = methodType;
            target[routersType] = target[routersType] || [];
            target[routersType].push(route);
        }
    }
}
const GET = (options?: {url:string,middleWares?:MiddleWareInterface[], cors?:CorsInterface}) => {
    return decorator(options, "getRouters", "GET");
}
// POST Decorator
const POST = (options?: {url:string,middleWares?:MiddleWareInterface[], cors?:CorsInterface}) => {
    return decorator(options, "postRouters", "POST");
}
// PATCH Decorator
const PATCH = (options?: {url:string,middleWares?:MiddleWareInterface[], cors?:CorsInterface}) => {
    return decorator(options, "patchRouters", "PATCH")
}
// PUT Decorator
const PUT = (options?: {url:string,middleWares?:MiddleWareInterface[], cors?:CorsInterface}) => {
    return decorator(options, "putRouters", "PUT")
}
// DELETE Decorator
const DELETE = (options?: {url:string,middleWares?:MiddleWareInterface[], cors?:CorsInterface}) => {
    return decorator(options, "deleteRouters", "DELETE")
}


const MiddleWare = (target:Router, key:string) => {
        let method = target[key];
        target.globalMiddleWares = target.globalMiddleWares || [];
        target.globalMiddleWares.push(method);
}

export {MiddleWare, GET, PUT, POST, PATCH, DELETE}