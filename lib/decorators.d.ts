/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: Package Decorators
 * ==============================================================================
 */
import Router from "./Router";
import { MiddleWareInterface, CorsInterface } from "./interfaces/index";
declare const GET: (options?: {
    url: string;
    middleWares?: MiddleWareInterface[];
    cors?: CorsInterface;
}) => (target: Router, key: string) => void;
declare const POST: (options?: {
    url: string;
    middleWares?: MiddleWareInterface[];
    cors?: CorsInterface;
}) => (target: Router, key: string) => void;
declare const PATCH: (options?: {
    url: string;
    middleWares?: MiddleWareInterface[];
    cors?: CorsInterface;
}) => (target: Router, key: string) => void;
declare const PUT: (options?: {
    url: string;
    middleWares?: MiddleWareInterface[];
    cors?: CorsInterface;
}) => (target: Router, key: string) => void;
declare const DELETE: (options?: {
    url: string;
    middleWares?: MiddleWareInterface[];
    cors?: CorsInterface;
}) => (target: Router, key: string) => void;
declare const MiddleWare: (target: Router, key: string) => void;
export { MiddleWare, GET, PUT, POST, PATCH, DELETE };
