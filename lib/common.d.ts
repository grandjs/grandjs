declare enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
    VALIDATIONS_ERROR = 422,
    REDIRECT = 301,
    NOT_AUTHORIZED = 401
}
declare enum APiType {
    error = "ERROR",
    success = "SUCCESS"
}
interface APiResponseInterface {
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
interface SucessInfo {
    textCode: string;
    message?: string | {
        [key: string]: any;
    };
    data?: any;
    defaultMessage?: string;
    status?: number;
}
interface ErrorInfo {
    textCode: string;
    message?: string | {
        [key: string]: any;
    };
    data?: any;
    validations?: any[];
    status?: HttpStatusCode;
    defaultMessage?: string;
}
declare abstract class APiResponse implements APiResponseInterface {
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
        [key: string]: any;
    };
    setMessage(message: string): void;
    setData(data: any): void;
    setValidations(validations: any[]): void;
}
declare class APiSuccess extends APiResponse {
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
    };
    setMessage(message: string): void;
}
declare class APiError extends APiResponse {
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
export { APiError, APiSuccess, APiResponse, APiResponseInterface, HttpStatusCode, APiType };
