"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Server from "./Server";
class MiddleWare {
    next(matchedRoute, req, res) {
        let middleWares = matchedRoute.middleWares;
        if (middleWares && middleWares.length > 0) {
            function next() {
                nexted++;
                if (middleWares.length <= nexted) {
                    return matchedRoute.handler(req, res);
                }
                else {
                    return middleWares[nexted](req, res, next);
                }
            }
            var nexted = 0;
            return middleWares[0](req, res, next);
        }
        else {
            return matchedRoute.handler(req, res);
        }
    }
    // method to handle routers middlewares
    handleRoutersMiddleWares(req, res, allMiddleWares, matchedRouter, Server) {
        function next() {
            nexted++;
            if (allMiddleWares.length <= nexted) {
                matchedRouter.init();
            }
            else {
                // matchedClass.serveFiles(() => {
                return allMiddleWares[nexted](req, res, next);
                // });
            }
        }
        let nexted = 0;
        return allMiddleWares[nexted](req, res, next);
    }
}
exports.default = new MiddleWare();
