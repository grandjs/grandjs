export declare enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
    VALIDATIONS_ERROR = 422,
    REDIRECT = 301,
    NOT_AUTHORIZED = 401
}
export declare enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE",
    PUT = "PUT",
    ALL = "ALL"
}
export declare enum APiType {
    error = "ERROR",
    success = "SUCCESS"
}
export interface APiResponseInterface {
    type: APiType;
    textCode: string;
    message?: string | {
        [key: string]: any;
    };
    status: HttpStatusCode;
    validations?: any[];
    data?: any;
    defaultMessage?: string;
    getResponse(): any;
}
export interface SucessInfo {
    textCode: string;
    message?: string | {
        [key: string]: any;
    };
    data?: any;
    defaultMessage?: string;
    status?: number;
}
export interface ErrorInfo {
    textCode: string;
    message?: string | {
        [key: string]: any;
    };
    data?: any;
    validations?: any[];
    status?: HttpStatusCode;
    defaultMessage?: string;
}
export declare abstract class APiResponse implements APiResponseInterface {
    readonly type: APiType;
    readonly textCode: string;
    message?: string;
    defaultMessage?: string;
    status: HttpStatusCode;
    validations?: any[];
    data?: any;
    [key: string]: any;
    constructor(info: {
        type: APiType;
        textCode: string;
        message?: string | {
            [key: string]: any;
        };
        status?: HttpStatusCode;
        validations?: any[];
        data?: any;
        defaultMessage?: string;
    });
    abstract getResponse(): {
        status: HttpStatusCode;
        message?: string;
        textCode: string;
        data?: any;
        [key: string]: any;
    };
    setMessage(message: string): void;
    setData(data: any): void;
    setValidations(validations: any[]): void;
}
export declare class APiSuccess extends APiResponse {
    readonly type: APiType;
    readonly textCode: string;
    message?: string;
    status: HttpStatusCode;
    data: any;
    defaultMessage?: string;
    constructor(info: SucessInfo);
    getResponse(): {
        status: HttpStatusCode;
        message: string;
        textCode: string;
        data: any;
        defaultMessage: string;
    };
    setMessage(message: string): void;
}
export declare class APiError extends APiResponse {
    readonly type: APiType;
    readonly textCode: string;
    message?: string;
    status: HttpStatusCode;
    data: any;
    defaultMessage?: string;
    constructor(info: ErrorInfo);
    getResponse(): {
        status: HttpStatusCode;
        message: string;
        textCode: string;
        data: any;
        validations: any[];
        defaultMessage: string;
    };
    setMessage(message: string): void;
}
export interface IResponse {
    status: number;
    message: string;
    textCode: string;
    validations?: any[];
    data?: any;
}
export declare enum TextCodes {
    REGISTER_SUCCESS = "REGISTER_SUCCESS",
    REGISTER_FAILED = "REGISTER_FAILED",
    REGISTER_VALIDATIONS_ERROR = "REGISTER_VALIDATIONS_ERROR",
    VERIFIY_SUCCESS = "VERIFIY_SUCCESS",
    VERIFIY_FAILED = "VERIFIY_FAILED",
    USER_FOUND = "USER_FOUND",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGIN_FAILED = "USER_FOUND",
    FORGET_PASSWORD_SUCCESS = "FORGET_PASSWORD_SUCCESS",
    FORGET_PASSWORD_ERROR = "FORGET_PASSWORD_ERROR",
    PROCESS_SUCCESS = "PROCESS_SUCCESS",
    PROCESS_FAILED = "PROCESS_FAILED",
    NOT_FOUND = "NOT_FOUND",
    NON_AUTHORIZED = "NON_AUTHORIZED",
    FAILED_TO_AUTHENTICATE = "FAILED_TO_AUTHENTICATE"
}
