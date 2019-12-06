/**
 * ===========================================
 * @Grandjs file role: middlewares for the core
 * ===========================================
 */

//  dependnecies

// define middlewares class
class MiddleWares {
    // middleware to go to next middle ware function
    next(matchedURL, req, res) {
        let middleWares = matchedURL.middleWares;
        if (middleWares && middleWares.length > 0) {
            var nexted = 0;
            middleWares[0](req, res, next);

            function next() {
                nexted++;
                if (middleWares.length <= nexted) {
                    return matchedURL.handler(req, res);
                } else {
                    return middleWares[nexted](req, res, next);
                }
            }
        } else {
            return matchedURL.handler(req, res);
        }
    }
}

// export middleware class
module.exports = new MiddleWares();