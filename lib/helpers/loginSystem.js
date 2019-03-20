const sessionLib = require("./sessionLib");

const auth = {
    login: function (loginName, obj, sessionOptions) {
        // console.log(session)
        session.set(loginName, obj, sessionOptions)
        this.loginName = loginName;
    },
    checkAuth: function () {
        let userSession = session.getSession(this.loginName);
        if (userSession === undefined) {
            return false;
        } else if (userSession !== undefined) {
            return true;
        }
    },
    Auth: function (check, callback) {
        var done;
        check(done, callback);

    },
    logout: function () {
        return session.breakSession(this.loginName);
    }
};
global.auth = auth;

module.exports = auth;