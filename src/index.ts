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
import {Server} from "./Server";
import Router from "./Router";
import {View} from "./View";
import Request from "./Request";
import Response from "./Response";
import helpers from './helpers';
import FileUpload from './fileupload';
import {GET, POST, PUT, PATCH, DELETE, MiddleWare} from "./decorators";
import {ComponentParser} from "./ComponentParser"
const validation = helpers.validation;
const Cipher = helpers.Cipher;
export {Server, Router, View, Request, Response, validation, Cipher, FileUpload, GET, POST, PUT, PATCH, DELETE, MiddleWare};


const test = ComponentParser.importJsx("/src/components/test.tsx")
const MyServer = ComponentParser.importJsx("/src/components/Server.tsx")
// console.log(test)
const v = ComponentParser.render(MyServer, {port: 3000});
console.log(v);