enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
    VALIDATIONS_ERROR = 422,
    REDIRECT = 301,
    NOT_AUTHORIZED = 401
}
enum APiType{
    error = "ERROR",
    success = "SUCCESS"
}
interface APiResponseInterface {
    type:APiType,
    textCode:string,
    message?:string | {[key:string]:any}
    status:HttpStatusCode,
    validations?:any[]
    data?:any,
    defaultMessage?:string
    getResponse():any
}
interface SucessInfo{
    textCode:string
    message?:string | {[key:string]:any}
    data?:any
    defaultMessage?:string
    status?: number
}
interface ErrorInfo{
    textCode:string
    message?:string | {[key:string]:any}
    data?:any
    validations?:any[]
    status?:HttpStatusCode
    defaultMessage?:string
}
abstract class APiResponse implements APiResponseInterface{
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
    abstract getResponse():{status:HttpStatusCode, message?:string, textCode:string, [key:string]:any}
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


class APiSuccess extends APiResponse {
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
            textCode: this.textCode
        }
    }
    setMessage(message:string) {
        this.message = message;
    }
}

class APiError extends APiResponse{
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
            textCode: this.textCode
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

export {APiError, APiSuccess, APiResponse, APiResponseInterface, HttpStatusCode, APiType}