/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: Main File
 * ==============================================================================
 */
import { Server } from "./Server";
import Router from "./Router";
import { View } from "./View";
import Request from "./Request";
import Response from "./Response";
import FileUpload from './fileupload';
import { GET, POST, PUT, PATCH, DELETE, MiddleWare } from "./decorators";
declare const validation: {
    strip_html_tags: (str: string) => string | false;
    checkEmail: (string: string, cb: Function) => any;
    notEmptyString: (string: string, cb: Function) => any;
    checkContainsNumber: (string: string, count: number, cb: Function) => any;
    isObject: (obj: import("./interfaces").OptionalObject) => false | import("./interfaces").OptionalObject;
    notEmpty: (obj: import("./interfaces").OptionalObject) => false | import("./interfaces").OptionalObject;
    isString: (str: string) => string | false;
    checkIsNumber: (element: string, cb: Function) => any;
};
declare const Cipher: {
    enCrypt: (text: string) => string;
    deCrypt: (text: string) => string;
};
export { Server, Router, View, Request, Response, validation, Cipher, FileUpload, GET, POST, PUT, PATCH, DELETE, MiddleWare };
