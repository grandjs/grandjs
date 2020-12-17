export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
    VALIDATIONS_ERROR = 422,
    REDIRECT = 301,
    NOT_AUTHORIZED = 401,
    ENTITY_NOT_EXIST = 404,
    ENTITY_ALREADY_EXIST = 400,
}
export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    PUT = 'PUT',
    ALL = 'ALL'
}
export enum APiType{
    error = "ERROR",
    success = "SUCCESS"
}
export interface APiResponseInterface {
    type:APiType,
    textCode:string,
    message?:string | {[key:string]:any}
    status:HttpStatusCode,
    validations?:any[]
    data?:any,
    defaultMessage?:string
    getResponse():any
}
export interface SucessInfo{
    textCode:string
    message?:string | {[key:string]:any}
    data?:any
    defaultMessage?:string
    status?: number
}
export interface ErrorInfo{
    textCode:string
    message?:string | {[key:string]:any}
    data?:any
    validations?:any[]
    status?:HttpStatusCode
    defaultMessage?:string
}

export abstract class APiResponse implements APiResponseInterface{
    readonly type:APiType
    readonly textCode:string
    message?:string
    defaultMessage?:string
    status:HttpStatusCode
    validations?:any[]
    data?:any
    [key:string]:any
    constructor(info:{type:APiType, textCode:string, message?:string | {[key:string]:any}, status?:HttpStatusCode, validations?:any[], data?:any, defaultMessage?:string}) {
        this.type = info.type;
        this.textCode = info.textCode;
        this.message = typeof info.message === "object" ? info.message?.message : info.message;
        this.status = info.status || this.status;
        this.validations = info.validations;
        this.data = info.data;
        this.defaultMessage = info.defaultMessage;
        if(!this.message) {
            this.message = this.defaultMessage;
        }
    }
    // get response
    abstract getResponse():{status:HttpStatusCode, message?:string, textCode:string, data?:any, [key:string]:any}
    setMessage(message:string) {
        this.message = message;
    }
    public setData(data:any) {
        this.data = data;
    }
    public setValidations(validations:any[]) {
        this.validations = validations;
    }
}


export class APiSuccess extends APiResponse {
    readonly type: APiType = APiType.success
    readonly textCode: string;
    message?:string
    status: HttpStatusCode = HttpStatusCode.OK
     data:any
     defaultMessage?:string
    constructor(info:SucessInfo) {
        super({...info, status: HttpStatusCode.OK, type:APiType.success});
        this.status = info.status || this.status;
    }
    getResponse() {
        return {
            status: this.status,
            message: this.message,
            textCode: this.textCode,
            data: this.data,
            defaultMessage: this.defaultMessage
        }
    }
    setMessage(message:string) {
        this.message = message;
    }
}

export class APiError extends APiResponse{
    readonly type: APiType = APiType.error
    readonly textCode: string;
     message?:string
    status: HttpStatusCode = HttpStatusCode.BAD_REQUEST
     data:any
     defaultMessage?:string
    constructor(info:ErrorInfo) {
        super({...info, type: APiType.error});
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
        }
    }
    setMessage(message:string) {
        this.message = message;
    }
}

export interface IResponse {
    status: number
    message:string
    textCode:string
    validations?:any[]
    data?:any
}
export enum TextCodes{
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
    FAILED_TO_AUTHENTICATE = "FAILED_TO_AUTHENTICATE",
    ENTITY_EXIST = "ENTITY_EXIST",
    ENTITY_NOT_EXIST = "ENTITY_NOT_EXIST",
    ENTITY_ALREADY_EXIST = "ENTITY_ALREADY_EXIST",
}
