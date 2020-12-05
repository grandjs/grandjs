"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
// GET Decorator
const decorator = (options, routersType, methodType) => {
    return (target, key) => {
        let method = target[key];
        target.getRouters = target.getRouters || [];
        // check if there is options passed
        if (typeof options === "object") {
            options.middleWares = options.middleWares || [];
            let route = { url: options.url, middleWares: options.middleWares, method: methodType, handler: method };
            target[routersType] = target[routersType] || [];
            target[routersType].push(route);
        }
        else {
            let route = method();
            route.route = methodType;
            target[routersType] = target[routersType] || [];
            target[routersType].push(route);
        }
    };
};
const GET = (options) => {
    return decorator(options, "getRouters", "GET");
};
exports.GET = GET;
// POST Decorator
const POST = (options) => {
    return decorator(options, "postRouters", "POST");
};
exports.POST = POST;
// PATCH Decorator
const PATCH = (options) => {
    return decorator(options, "patchRouters", "PATCH");
};
exports.PATCH = PATCH;
// PUT Decorator
const PUT = (options) => {
    return decorator(options, "putRouters", "PUT");
};
exports.PUT = PUT;
// DELETE Decorator
const DELETE = (options) => {
    return decorator(options, "deleteRouters", "DELETE");
};
exports.DELETE = DELETE;
const MiddleWare = (target, key) => {
    let method = target[key];
    target.globalMiddleWares = target.globalMiddleWares || [];
    target.globalMiddleWares.push(method);
};
exports.MiddleWare = MiddleWare;
const RouteMiddleWare = (options) => {
    return (target, key) => {
        target.tempMiddleWares = target.tempMiddleWares || [];
        target.tempMiddleWares.push({
            middleWare: target[key],
            options: options
        });
    };
};
exports.RouteMiddleWare = RouteMiddleWare;
const Use = (path, ...middleWares) => {
    return (constructor) => {
        var _a, _b;
        (_b = (_a = constructor.prototype) === null || _a === void 0 ? void 0 : _a.use) === null || _b === void 0 ? void 0 : _b.call(_a, path, ...middleWares);
    };
};
exports.Use = Use;
