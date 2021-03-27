"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Server from "./Server";
class MiddleWare {
    next(matchedRoute, req, res) {
        let middleWares = matchedRoute.middleWares;
        if (middleWares && middleWares.length > 0) {
            var nexted = 0;
            return middleWares[0](req, res, this.nextFunction(nexted, middleWares, matchedRoute, req, res));
        }
        else {
            return matchedRoute.handler(req, res);
        }
    }
    nextFunction(nexted, middleWares, matchedRoute, req, res) {
        return function next() {
            nexted++;
            if (middleWares.length <= nexted) {
                return matchedRoute.handler(req, res);
            }
            else {
                return middleWares[nexted](req, res, next);
            }
        };
    }
    // method to handle routers middlewares
    handleRoutersMiddleWares(req, res, allMiddleWares, matchedRouter, Server) {
        function next() {
            nexted++;
            if (allMiddleWares.length <= nexted) {
                matchedRouter.init();
            }
            else {
                return allMiddleWares[nexted](req, res, next);
            }
        }
        let nexted = 0;
        return allMiddleWares[nexted](req, res, next);
    }
}
exports.default = new MiddleWare();
