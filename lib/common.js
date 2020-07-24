"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCode[HttpStatusCode["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
    HttpStatusCode[HttpStatusCode["VALIDATIONS_ERROR"] = 422] = "VALIDATIONS_ERROR";
    HttpStatusCode[HttpStatusCode["REDIRECT"] = 301] = "REDIRECT";
    HttpStatusCode[HttpStatusCode["NOT_AUTHORIZED"] = 401] = "NOT_AUTHORIZED";
})(HttpStatusCode || (HttpStatusCode = {}));
exports.HttpStatusCode = HttpStatusCode;
var APiType;
(function (APiType) {
    APiType["error"] = "ERROR";
    APiType["success"] = "SUCCESS";
})(APiType || (APiType = {}));
exports.APiType = APiType;
class APiResponse {
    constructor(info) {
        var _a;
        this.type = info.type;
        this.textCode = info.textCode;
        this.message = typeof info.message === "object" ? (_a = info.message) === null || _a === void 0 ? void 0 : _a.message : info.message;
        this.status = info.status || this.status;
        this.validations = info.validations;
        this.data = info.data;
        this.defaultMessage = info.defaultMessage;
        if (!this.message) {
            this.message = this.defaultMessage;
        }
    }
    setMessage(message) {
        this.message = message;
    }
    setData(data) {
        this.data = data;
    }
    setValidations(validations) {
        this.validations = validations;
    }
}
exports.APiResponse = APiResponse;
class APiSuccess extends APiResponse {
    constructor(info) {
        super(Object.assign(Object.assign({}, info), { status: HttpStatusCode.OK, type: APiType.success }));
        this.type = APiType.success;
        this.status = HttpStatusCode.OK;
        this.status = info.status || this.status;
    }
    getResponse() {
        return {
            status: this.status,
            message: this.message,
            textCode: this.textCode
        };
    }
    setMessage(message) {
        this.message = message;
    }
}
exports.APiSuccess = APiSuccess;
class APiError extends APiResponse {
    constructor(info) {
        super(Object.assign(Object.assign({}, info), { type: APiType.error }));
        this.type = APiType.error;
        this.status = HttpStatusCode.BAD_REQUEST;
        this.status = info.status || this.status;
    }
    getResponse() {
        return {
            status: this.status,
            message: this.message,
            textCode: this.textCode
        };
    }
    setMessage(message) {
        this.message = message;
    }
}
exports.APiError = APiError;
