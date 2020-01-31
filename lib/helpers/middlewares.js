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
            function next(err) {
                if(err) {
                    return matchedURL.nextError(err, req, res);
                } else {
                    nexted++;
                    if (middleWares.length <= nexted) {
                        return matchedURL.handler(req, res);
                    } else {
                        return middleWares[nexted](req, res, next);
                    }
                }
            }
            var nexted = 0;
            return middleWares[0](req, res, next);
        } else {
            return matchedURL.handler(req, res);
        }
    }
}

// export middleware class
module.exports = new MiddleWares();