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
import {Server, BaseServer} from "./Server";
import Router from "./Router";
import {View} from "./View";
import Request from "./Request";
import Response from "./Response";
import helpers from './helpers';
import FileUpload from './fileupload';
import {GET, POST, PUT, PATCH, DELETE, MiddleWare, RouteMiddleWare, Use} from "./decorators";
import {IResponse, APiError, APiSuccess, APiResponse, APiResponseInterface, HttpStatusCode, APiType, TextCodes, RequestMethod, ErrorInfo, SuccessInfo} from "./common"
import {Constructable, MiddleWareOptions, ServerInterface, RepositoryPromiseResponseInterface} from "./interfaces"

const validation = helpers.validation;
const Cipher = helpers.Cipher;
export {Server, Router, View, Request, Response, validation, Cipher, FileUpload, GET, POST, PUT, PATCH, DELETE, MiddleWare, RouteMiddleWare, IResponse, APiError, APiSuccess, APiResponse, APiResponseInterface, HttpStatusCode, APiType, Constructable, TextCodes, RequestMethod, MiddleWareOptions, Use, ServerInterface, BaseServer, RepositoryPromiseResponseInterface};
