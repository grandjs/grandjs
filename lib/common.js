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
})(HttpStatusCode = exports.HttpStatusCode || (exports.HttpStatusCode = {}));
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["POST"] = "POST";
    RequestMethod["PATCH"] = "PATCH";
    RequestMethod["DELETE"] = "DELETE";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["ALL"] = "ALL";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
var APiType;
(function (APiType) {
    APiType["error"] = "ERROR";
    APiType["success"] = "SUCCESS";
})(APiType = exports.APiType || (exports.APiType = {}));
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
            textCode: this.textCode,
            data: this.data,
            defaultMessage: this.defaultMessage
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
            textCode: this.textCode,
            data: this.data,
            validations: this.validations,
            defaultMessage: this.defaultMessage
        };
    }
    setMessage(message) {
        this.message = message;
    }
}
exports.APiError = APiError;
var TextCodes;
(function (TextCodes) {
    TextCodes["REGISTER_SUCCESS"] = "REGISTER_SUCCESS";
    TextCodes["REGISTER_FAILED"] = "REGISTER_FAILED";
    TextCodes["REGISTER_VALIDATIONS_ERROR"] = "REGISTER_VALIDATIONS_ERROR";
    TextCodes["VERIFIY_SUCCESS"] = "VERIFIY_SUCCESS";
    TextCodes["VERIFIY_FAILED"] = "VERIFIY_FAILED";
    TextCodes["USER_FOUND"] = "USER_FOUND";
    TextCodes["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    TextCodes["LOGIN_SUCCESS"] = "LOGIN_SUCCESS";
    TextCodes["LOGIN_FAILED"] = "USER_FOUND";
    TextCodes["FORGET_PASSWORD_SUCCESS"] = "FORGET_PASSWORD_SUCCESS";
    TextCodes["FORGET_PASSWORD_ERROR"] = "FORGET_PASSWORD_ERROR";
    TextCodes["PROCESS_SUCCESS"] = "PROCESS_SUCCESS";
    TextCodes["PROCESS_FAILED"] = "PROCESS_FAILED";
    TextCodes["NOT_FOUND"] = "NOT_FOUND";
    TextCodes["NON_AUTHORIZED"] = "NON_AUTHORIZED";
    TextCodes["FAILED_TO_AUTHENTICATE"] = "FAILED_TO_AUTHENTICATE";
})(TextCodes = exports.TextCodes || (exports.TextCodes = {}));
