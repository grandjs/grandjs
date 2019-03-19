const helpers = require("./helpers");
var req, res, cookieOptions;

function setSessionOptions(data) {
    req = data.req;
    res = data.res;
    cookieOptions = data.cookieOptions;
}
class Session {
    init() {
        this.req = req;
        this.res = res;
        this.cookieOptions = cookieOptions;
        if (typeof this.sessions == "undefined") {
            this.sessions = {};
        }
    }
    set(sessionName, obj, sessionOptions) {
            let res = this.res;
            let req = this.req;
            let cookiesOptions = this.cookieOptions !== undefined && typeof this.cookieOptions === "object" ? this.cookieOptions : {};
            let cookieExpires = sessionOptions || cookieOptions.expires || {};
            let expiresDays = cookieExpires.days !== undefined ? cookieExpires.days : undefined;
            var minutes = cookieExpires.minutes !== undefined ? cookieExpires.minutes : undefined;
            var date = new Date();
            if (expiresDays && minutes !== undefined) {
                date.setDate(date.getDate() + expiresDays);
                date.setMinutes(date.getMinutes() + minutes);
            }
            let expires = date.toUTCString();
            let sessionId = Math.random().toString(36).substr(2, 36);
            obj._sessionId = sessionId;
            if (sessionOptions !== false) {
                res.setHeader("set-cookie", `${sessionName}=${sessionId};${expiresDays && minutes !== undefined ? `expires=${expires}`:""};`);
        } else if (sessionOptions === false) {
            res.setHeader("set-cookie", `${sessionName}=${sessionId};`);
        }
        let sessions = this.sessions;
        sessions[sessionId] = obj;
        return sessionId;
    }
    getSession(sessionName) {
        let sessions = this.sessions;
        let req = this.req;
        let sessionId = helpers.parseCookies(req)[sessionName];
        let session = Object.keys(sessions).find((id) => id === sessionId);
        return sessions[session];
    }
    updateSession(sessionName, obj, sessionOptions) {
        let sessionId = obj._sessionId;
        let session = Object.keys(this.sessions).find((id) => id === sessionId);
        if (session) {
            delete this.sessions[sessionId];
            sessionOptions = sessionOptions !== undefined ? sessionOptions : this.cookieOptions;
            obj._sessionId = Math.random().toString(36).substr(2, 36);
            this.set(sessionName, obj, sessionOptions);
        } else {
            return null;
        }
    }
    breakSession(sessionName) {
        let session = this.getSession(sessionName);
        if (session) {
            delete this.sessions[session._sessionId];
            this.res.setHeader("set-cookie", `${sessionName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`);
        }
    }
}
global.session = new Session();

module.exports = {
    setSessionOptions: setSessionOptions
};