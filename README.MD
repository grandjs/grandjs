<p align="center"><img width="200" height="200" src="https://i.ibb.co/t4MDdkq/grandjs.png" alt="Grandjs logo"></p>
# Grandjs
A backend framework for solid web apps based on node.js

You want to build a solid web application but you don't want to use express and a lot of packages you need to build a basic website, Grandjs is one framework includes all main functionalities you need to build amazing, solid and secured web application without need for a ton of packages and libraries.

* Grandjs is built for solid and extended web apps


![GitHub contributors](https://img.shields.io/github/contributors/tareksalem/grandjs.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/grandjs.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/tareksalem/grandjs.svg)
![npm](https://img.shields.io/npm/dt/grandjs.svg?color=green&style=popout)
## Prerequisites

1- you need to install node.js on your system
2- init a new project using npm, so then we will be able to install this framework

## Features
* fewer packages and more productivity
* Framework includes the most needed functionalities to build a perfect web app
* depends on Handlebars template Engine which is friendly with many developers
* solid routing system built on Javascript object-oriented programming and you can extend it as you need
* controlled handling for every error page in your app
* Grandjs is built for solid and extended web apps
* Built in template engine using jsx
* Extendable Routing System
* Accepts Express Packages such as (body-parser, cookie-parser, morgan, cors)
* built in cors Handler
Built in request body parser
Usable for Typescript Apps

```javascript
//require HTTP module
const http = require("http");
//require Grandjs framework
const Grandjs = require("grandjs");

// set the configuration of the framework
Grandjs.setConfig({
    //define the port
    port: process.env.PORT || 3000,
    // http is optional you can specify http or https, if you don't specify Grandjs automatically require HTTP module
    http: http,
    // if you specified https so you should ssl files in this object
    httpsMode: {
        key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
        cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
    }
    // define the static files container folder
    staticFolder: {
        // set the path of the folder of assets
        path: path.join(process.cwd(), "/public"),
        // set the global url that will be consumed by http request
        url: "/public"
    },
        //set the encryption key, Grandjs uses encription key to cypher info
    ENCRYPTION_KEY: "ncryptiontestforencryptionproces",
    // use native request body parser or not
    nativeParser: true || false,

    //set error page for global error pages
    errorPage(req, res) {
        res.end("error page");
    }
});

// init Grandjs
Grandjs.initServer();
```
**content**
  - [Installing](#installing)
  - [Getting Started](#getting-started)
    - [Server configuration](#server-configuration)
    - [Cors]($cors)
    -[Accessing Grandjs Server](#accessing-grandjs-server)
    - [Grandjs MiddleWares](#grandjs-middlewares)
    - [Router](#router)
      - [extend Router class](#extend-router-class)
      - [define get routers](#define-get-routers)
      - [define post routers](#define-post-routers)
      - [Access on request and response objects](#access-on-request-and-response-objects)
      - [Request object](#request-object)
        - [Request params](#request-params)
        - [Handle post request](#handle-post-request)
        - [Request Uploaded Files](#request-uploaded-files)
      - [Response object](#response-object)
        - [``res.render`` function](#resrender-function)
        - [``res.write`` function](#reswrite-function)
        - [``res.end`` function](#resend-function)
        - [``res.sendFile`` function](#ressendfile-function)
        - [``res.json`` function](#resjson-function)
        - [``res.redirect`` function](#resredirect-function)
      - [middleWares](#middlewares)
      - [Use Router class inside another router class](#Use-Router-class-inside-another-router-class)
      - [TypeScript Decorators](#typescript-decorators)
    - [Validation](#validation)
      - [``validation.strip_html_tags`` function](#validationstriphtmltags-function)
      - [``validation.checkEmail`` function](#validationcheckemail-function)
      - [``validation.notEmpty`` function](#validationnotempty-function)
      - [``validation.checkContainsNumber`` function](#validationcheckcontainsnumber-function)
      - [``validation.checkIsNumber`` function](#validationcheckisnumber-function)
    - [cryption](#cryption)
      - [encrypt](#encrypt)
      - [decrypt](#decrypt)
    - [session](#session)
    - [Auth module](#auth-module)
    - [Flash Messages](#flash-messages)
    - [Add MimeTypees](#add-mimetypes)
    - [Grandjs File Upload](#grandjs-file-upload)
    - [Socket Io Support](#socket-io-support)
  - [Built With](#built-with)
  - [Contributing](#contributing)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)
  - [JSX](#JSX)


# Whats New ?
Grandjs now supports the following
- JSX Syntax for rendering dynamic content instead of using template engins
- many of express packages are now compatible with Grandjs such as cookie-parser, session, flash, morgan, express-fileupload, body-parser
- Typescript support!, Grandjs has major updates one of these updates is rebuilding the package again using typescript and changing the architecture of the project

## Please don't Forget to support us by rating the project!, Also you can contribute us


## Objectives
We aim to make grandjs the successor of express js with new vision, architecture, and modern javascript features like Router inheritance to build extendable, scalable web applications without repeating your self!

## Installing

open the command prompt and navigate to the project folder and just say

```
npm install grandjs --save
```
## Getting Started
### Server configuration
to start with Grandjs just install it and call it in your file as the following
**Javascript**
```javascript
//require Grandjs framework in javascript
const {Server, Router, Request, Response} = require("grandjs");
```

**Typescript**
```typescript
import {Server, Router, Request, Response} from "grandjs"
```

if you want to require HTTP or HTTPS module to pass it to Grand js you can, in all cases, Grandjs behind the seen requires HTTP module as a default.

Now you need to call setConfig function to set some configuration for the project

```javascript
Grandjs.setConfig({});
```
**this function takes one parameter as an object**

**Example on all configuration**
```javascript

//javascript
const {Server, Router} = require("grandjs");

//typescript
import {Server, Router} from "grandjs";

// define Grandjs configuration
Server.setConfig({
    //define the port
    port: process.env.PORT || 3000,
    // http is optional you can specify http or https, if you don't specify Grandjs automatically require HTTP module
    http: http,
    // if you specified https so you should ssl files in this object
    httpsMode: {
        key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
        cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
    },
    // define the static files container folder
    staticFolder: {
        // set the path of the folder of assets
        path: path.join(process.cwd(), "/public"),
        // set the global url that will be consumed by http request
        url: "/public"
    },
    //set the encryption key, Grandjs uses encription key to cypher info
    ENCRYPTION_KEY: "ncryptiontestforencryptionproces",
    // use native request body parser or not
    nativeParser: true || false,

    //set error page for global error pages
    errorPage(req, res) {
        res.end("error page");
    },
    // configure cors
    cors : {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    }
})
```


until now Grandjs doesn't work so you need to call "init function" to initialize the server
```javascript
Server.initServer();
```



### Cors
Grandjs uses Cors Module which is used in express, you can use the default settings of it as you use in expressjs

Grandjs installs cors and set default configuration automatically, however you can set your own configurations


### Cors Configuration
Grandjs allows you to set cors configuration on multiple level of routes as the following:
- cors setting over all app routes
**Example**

```javascript
// javascript
const {Server} = require("grandjs");
// typescript

import {Server} from "grandjs";

Server.setConfig({
    cors : {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    },

})
```
- cors setting over specific Router "group of routes"
**Example**

```javascript
// javascript
const {Server, Router} = require("grandjs");
// typescript

import {Server, Router} from "grandjs";
class HomeRouter extends Router{
    constructor(options) {
        super(options);
        this.cors = {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204
        };
    }
}
```
- cors setting over specific route
**Example**

```javascript
// javascript
const {Server, Router} = require("grandjs");
// typescript

import {Server, Router} from "grandjs";
class HomeRouter extends Router{
    constructor(options) {
        super(options);
        this.getRouters = [this.homePage()];
    }
    homePage() {
        return {
            cors: {
                origin: '*',
                methods: 'GET,',
                preflightContinue: false,
                optionsSuccessStatus: 204
        }   ,
            //define the url of router
            url: "/",
            // define the method of the router
            method: "GET",
            handler: () => {
                // handle the request and do the functionalities
            }
        }
    }
}
```

### Accessing Grandjs Server
After initializing grandjs, maybe you want to use the created server or access on it's properties so you can access on grandjs node server via this property from grandjs

```javascript
// javascript
const {Server} = require("grandjs");
// typescript

import {Server} from "grandjs";


Server.Server
// -> http Server
```


### Grandjs MiddleWares
as every nodejs developer used to add middleware to the express app to be executed before the routes, grandjs does also something similar

In grandjs you have three types of middlewares
- global middleare over app
- global middleware over single router class (group of routes)
- private middleware over single route

we will explain the last two types of middlewares in the Router section, but here we will talk about global middlewares over app.

Global middlewares over app are middlewares you want to run before executing any router in the app, this type of middlewares often is used for injecting dependencies in the app or make global settings for the whole app.

to set global middleware you can use `Server.use` function as the following:

```javascript
// javascript
const {Server} = require("grandjs");
// typescript

import {Server} from "grandjs";
Server.setConfig({});

// add global middleware here
Server.use();
Server.initServer();
```
`Server.use` function takes one argument which should be a function, this function has regular three arguments as the following:
```javascript
Server.use((req, res, next) => {
    // continue
    return next();
});
```

- `req` is the incoming request object
- `res` is the response object to send response or set headers
- `next` is a function to call to continue to the next middleware or to start executing the routers


**Note**

Grandjs takes the function which passed in `use` function and pushes it to an array of middlewares which will be executed later when a route hs requested, so these middlewares will be executed by their arrange inside the array.
To continue to the next global middleware or to start executing the matched router class you have to call `next` function, without it the routes will not be executed.

### Router

* Grandjs Routing system is built upon object-oriented programming, so Router is a class inside Grandjs you extend it and add routes to it as you wanna

**to work with router class you need to extend it or instatiate it directly and every class implies a group of routes have a specific base url**


#### extend Router class

```javascript
// javascript
const {Server, Router} = require("grandjs");
// typescript

import {Server, Router} from "grandjs";
class HomeRouter extends Router{
    constructor(options) {
        super(options);
    }
}
```

As any extended class, you should call the super inside the constructor and pass the options parameter

| parameter   |     type   |
|----------|:-------------:|
| options |  Object |

Now after defining the class, you should define the get routers which related to this class
Router class has a property called "getRouters" this is an array and you push inside it the routers you add within the class with the GET method

**Example**

```javascript
class HomeRouter extends Router{
    constructor(options) {
        super(options);
        this.getRouters = []
    }
}
```

**you can add routers which related to this class as methods inside the class and every method you use it as a router it should return an object has the following properties**

|Property   |  type |  description |
|---|---|---|
|  URL |  string (required)| the URL of the router  |
| method  |  string (required) |  HTTP method get / post / patch / put / delete |
| handler  |  function (required) | the function you want to run when the request URL matches the router url  |
| middleWares  | array (optional)  |  if you want to run a function or more to check about something before running the final handler of the router |

<!-- <hr style="border:.5px solid black;height:0"> -->
### Define get routers

**Example**

```javascript
// javascript
const {Server} = require("grandjs");
// typescript

import {Server} from "grandjs";
class HomeRouter extends Router{
    constructor(options) {
        super(options);

        //push the homePage method route into getRouters array
        this.getRouters.push(this.homePage());
    }
    homePage() {
        return {
            //define the url of router
            url: "/",
            // define the method of the router
            method: "GET",
            handler: (req, res) => {
                // handle the request and do the functionalities
            }
        }
    }
}
```


### Define post routers

**Example**

```javascript
class HomeRouter extends Grandjs.Router{
    constructor(options) {
        super(options);

        //push the homePage method route into getRouters array
        this.postRouters.push(this.homePagePost());
    }
    homePagePost() {
        return {
            //define the url of router
            url: "/",
            // define the method of the router
            method: "POST",
            handler: (req, res) => {
                // handle the request and do the functionalities
            }
        }
    }
}
```

### instantiate router class

**Example**

```javascript
// javascript
const {Server, Router} = require("grandjs");
// typescript

import {Server, Router} from "grandjs";
class HomeRouter extends Router{
    constructor(options) {
        super(options);

        //push the homePage method route into getRouters array
        this.getRouters = [this.homePage()];
    }
    homePage() {
        return {
            //define the url of router
            url: "/",
            // define the method of the router
            method: "GET",
            handler: () => {
                // handle the request and do the functionalities
            }
        }
    }
}
// instantiate the class
const homeRoters = new HomeRouter({base: "/"});
```

when you instantiate the class you should define the options parameter as an object includes two properties

| property   |     type   |descriptions |
|----------|:-------------:|-----: |
| base |  string (required) | implies the base URL you want to add routers to it. so if you defined it as "/admin" all routers inside this class would be added to /admin|
| staticFolder  | object(optional)  | the name of the folder you want to serve assets and static files from it. The default value of it is the global staticFolder that you specified in setConfig function
| staticFolder.path  | string(optional)  |the path to read files from|
|staticFolder.url|string|the url that will resolve the static and assets content|

**Example**

```javascript
const homeRoters = new HomeRouter({
    base: "/"
});
```
####  Note
you can also specify the basename of the router class inside the class constructor as the following:

```javascript
class HomeRouters extends Router{
    constructor() {
        this.base = "/admin"
    }
}
```

if you follow this pattern so you don't need to add base property when you instantiate the class because the base will be passed before


### Build Router

after instantiating the router, to make it works you need to call `build` method to start building and constructing the router

```javascript

const homeRoters = new HomeRouter({
    base: "/"
});
// this builds the router to be ready for runtime execution
homeRouters.build();
```
**Note**

Building routers should be before `Server.initServer` method
<!-- <hr style="border:.5px solid black;height:0"> -->
### Access on request and response objects

to handle the routers and check requests and responses you need to access them, so these objects are accessible using different ways

1- req & res objects are properties inside the class

**Example**

```javascript
class HomeRouter extends Router{
    constructor(options) {
        super(options);

        //push the homePage method route into getRouters array
        this.getRouters = [this.homePage()];
    }
    homePage() {
        return {
            //define the url of router
            url: "/",
            // define the method of the router
            method: "GET",
            handler: () => {
                // handle the request and do the functionalities
                //request object: this.req
                // response object: this.res
                //console the request object headers
                console.log(this.req.headers);
                this.res.end("hello home page");
            }
        }
    }
}
```

2- request & response are accessable as parameters inside handler function

**Example**

```javascript
homePage() {
    return {
        url: "/",
        method: "get",
        handler: (req, res) => {
            console.log(req.headers);
            res.end("hello home page");
        }
    }
}
```
<!-- <hr style="border:.5px solid black;height:0"> -->

#### Specify a separated folder for static files for this group of routes

```javascript
const homeRoters = new HomeRouter({
    base: "/",
    //specify the container folder fo static file for all routes inside this class
    // front path
    staticFolder: {
        path: path.join(process.cwd(), "/assets"),
        url: "/assets"
    },
});
```
<!-- <hr style="border:.5px solid black;height:0"> -->

#### Router add route

This function enables you to add routers to the class from outside it

```javascript
homeRoters.addRoute(obj);
```
this function takes one (required) parameter as an object has the following properties

|Property   |  type |  description |
|---|---|---|
|  URL |  string (required)| the URL of the router  |
| method  |  string (required) |  HTTP method get / post / patch / put / delete |
| handler  |  function (required) | the function you want to run when the request URL matches the router url  |
| middleWares  | array (optional)  |  if you want to run a function or more to check about something before running the final handler of the router |

**Example**

```javascript
// javascript
const {Server, Router} = require("grandjs");
// typescript

import {Server, Router} from "grandjs";
const adminRoute = new Router({
    baes: "/admin"
})
// add main route to admin base
adminRoute.addRoute({
    url: "/",
    method: "get",
    handler: (req, res) => {
        res.end("hello admin");
    }
});
// add profile page route to admin base
homePage.addRoute({
    url: "/profile",
    method: "get",
    handler: (req, res) => {
        res.end("hello profile");
    }
});
```
<!-- <hr style="border:.5px solid black;height:0"> -->

### Router class errorPage

you can specify a custom error page for every class you instantiate it to control on error links in a group of routes
to do that you need to define "errorPage" method to the class

1- define it inside the class

**Example**

```javascript
class HomeRouter extends Grandjs.Router{
    constructor(options) {
        super(options);
    }
    homePage() {
        return {
            url: "/",
            method: "get",
            handler: () => {
                this.res.end("hello home page");
            }
        }
    }
    aboutPage() {
        return {
            url: "/about",
            method: "get",
            handler: () => {
                this.res.end("hello about page");
            }
        }
    }
    // customize error page
    errorPage() {
        this.res.end("error page")
    }
}
```
2-Define error page from outside the class

**Example**

```javascript
const homeRouter = new Router({
    baes: "/"
})
// add main route to admin base
homeRouter.addRoute({
    url: "/",
    method: "get",
    handler: (req, res) => {
        res.end("hello homepage");
    }
});
// add profile page route to admin base
homeRouter.addRoute({
    url: "/about",
    method: "get",
    handler: (req, res) => {
        res.end("hello aboutpage");
    }
});
homeRouter.errorPage = (req, res) => {
    res.end("error page");
}
```

**not** that if you didn't define error page for the router class it automatically call error page which you specified in setConfig function

### Global middleWares

Global middleware is a way to apply middlewares on a class which includes a group of routers

globalMiddleWares is an array inside the class you can define it inside the constructor and put inside it functions that you want to run when the client requests the base name of that class

**Example**
```javascript
class HomeRouter extends Router{
    constructor(options) {
        super(options);
        // you can add one middleWare or more and it would be applied according to the arrangment
        this.globalMiddleWares = [this.sendMessage]
    }
    sendMessage(req, res, next) {
        res.write("message from middleWare");
        // continue to the next hanlders
        next();
    }
    homePage() {
        return {
            url: "/",
            method: "get",
            handler: () => {
                this.res.end("hello home page");
            }
        }
    }
    aboutPage() {
        return {
            url: "/about",
            method: "get",
            handler: () => {
                this.res.end("hello about page");
            }
        }
    }
    // customize error page
    errorPage() {
        this.res.end("error page")
    }
}
```

**not that the middlWares array can include many middleWare functions and the middleWares are applied according to the indexing inside the array**

Every middleWare has three parameters

| parameter  | type  | description  |
|---|---|---|
| req  | object  | implies the coming request object contains all information about the request  |
|res   | object  | represents the response object  |
| next  | function  | is a function you can execute it to continue to the next middleware or to the final handler of the router  |

### Router URL define params

you can add params to the URL of the router to make dynamic routes like the following:

```javascript
url: "/posts/:postId"
```
to access the parameters inside the URL using [request.params property](#request-params)

**Example**

```javascript
const homePage = new Router({
    baes: "/"
})
home.addRoute({
    url: "/posts/:postId",
    method: "get",
    handler: (req, res) => {
        console.log(req.params);
    }
});
```
<!-- <hr style="border:.5px solid black;height:0"> -->

#### Request Object
this is an object you can access on it inside the handler of the route
and the object contains all information about the request which is coming

|Property   |  type |  description |
|---|---|---|
| req.method  | string  | returns the method of the current request  |
|  req.pathname |  string |  returns the requested URL without query string |
|req.path  |  string | returns the requested URL with query string |
|req.href  |  string | returns the requested URL with query string |
| req.url  |  object | returns object contains the parsed URL  |
|req.query   |  object | contains the query & search in the URL(it parsed as key and value)  |
| req.params  |  object | returns the query parameters if it exists as key and value  |
| req.validation  | object  | returns an object contains some helper functions to validate the email and string  |
| req.data  | object  | returns an object contains the posted data if the method is "post"  |
| req.body  | object  | returns an object contains the posted data if the method is "post"  |
|  req.headers | object  | returns the headers of the coming request  |
| req.flash  | object  |  this object enables you to set messages to send it to handlebars to show to the user |

#### Request params
returns an object contains the parameters of the router URL and it's value if it exists
if there are no params so it returns an empty object

**Example**

```javascript
const homePage = new Router({
    baes: "/"
})
home.addRoute({
    url: "/posts/:category",
    method: "get",
    handler: (req, res) => {
        // user requested http://localhost:300/posts/tech?postId=2
        console.log(req.params); //output {category:"tech"};
        console.log(req.query) //output {postId: 2}
        console.log(req.pathname) //output /posts/tech
        console.log(req.path) //output /posts/tech?postId=2
        console.log(req.href) //output /posts/tech?postId=2
        console.log(req.method) //output "get"
        console.log(req.url)
        console.log(req.body);
        console.log(req.data);
        /* output
        Url {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: null,
        search: '?postId=2',
        query: 'postId=2',
        pathname: '/posts/tech',
        path: '/posts/tech?postId=2',
        href: '/posts/tech?postId=2' }
        */
    }
});
```

<!-- <hr style="border:.5px solid black;height:0"> -->

#### Handle post request

Grandjs handles all types of post requests and submitted data and returns them as an object called ``req.data`` and another property `req.body` this object contains all the submitted data and you can access on it inside the handler function if the method of the router is post

**Example**

```javascript
postAdminPage() {
    return {
        method: "post",
        url: "/admin/addinfo",
        handler: (req, res) => {
            console.log(req.data || req.data) //output {} contains all submitted info
        }
    }
}
```


#### Request Uploaded Files

In Grandjs You can upload files easily without any extra settings, all you should do is specifying Request header as `multipart/form-data`

Grandjs Uses multiparty package for file uploading

You can access on the uploaded files via `files` property in the request object as the following:

```javascript
postAdminPage() {
    return {
        method: "post",
        url: "/admin/uploadInfo",
        handler: (req, res) => {
            console.log(req.files) //output {} contains all uploaded files
        }
    }
}
```

`req.files` property is an object which includes the uploaded files as properties, each property incarnates the uploaded file as an object, but if there are multiple files uploaded with the same filed name so they will be grouped together inside the property name as an array of objects

each object has the following properties:

```javascript
{
      name: 'images' // the name of the filed,
      filename: 'download (1).jpeg' // original file name,
      data: <Buffer> // the file content as buffer,
      size: 14473 // size of file,
      extension: '.jpg' // the extension type of file,
      mimetype: 'image/jpeg' // mime type of file,
      stream: [Duplex] // ability to use this file to stream it,
       headers: [Object] // the sent headers with this file,
      byteOffset: 147,
      byteCount: 27975 // bytes count

```
**Note**

For Request Body parsing you have two options

1- use native Grandjs request parser which will also parse request with formdata

2- use `body-parser` package for parsing json requests and use `express-fileupload` for parsing `multipart/form-data` request body


#### Response Object

this is an object you can access on it inside the handler of the route
This object contains all methods that you need to send a response or content to the coming request

#### ``res.render`` function

This function you use it to render HTML content using JSX Stateless Components

```javascript
res.render()
```
takes one parameter as an object, this object should contain the following properties

| property  |  type | description |
|---|---|---|
|  Component |  Function | A functional Component written in JSX Syntax to be rendered as an HTML|
| data  | object (optional)  | object contains the data you want to render inside the rendered component

**Example**

Create App.jsx File
```jsx
// import View here (mandatory)
// javascript
const {View} = require("grandjs");

// typescript
import {View} from "grandjs";
const App = (props) => {
    return (
        <div>
            Hello world
            <h2>{props.message}</h2>
        </div>
    )
}
// use native exporting method either for typescript or javascript
module.exports = App
```

```javascript
// javascript
const {Server, Router, View} = require("grandjs");

// typescript
import {Server, Router, View} from "grandjs";

// load jsx file
const App = View.importJsx("./App.jsx");
    homePageRouter() {
        return {
            url: "/",
            method: "get",
            handler: () => {
                // render jsx component
                this.res.render(App, {message: "Hello Grandjs"})
            }
        }
    }
```

#### ``res.write`` function

this function is like the native api of node.js, it allows you to send strings to the client

```javascript
res.write("hello world");
//end the response
res.end("");
```

#### ``res.end`` function
this function is like the native api of node.js, it allows you to send strings to the client

```javascript
res.end("hello world");
```


#### ``res.sendFile`` function
```javascript
res.sendFile(path);
```
this function takes on parameter

|parameter   |  type | description  |
|---|---|---|
|  path |  String (required) | this parameter should specify the path of the file which you want to send |

this function uses promise to return a ``catch`` function if the file isn't exist

**Example**

```javascript
res.sendFile("/views/pages/home.html").catch((err) => {
    console.log(err) //output no such file
})
```

#### ``res.json`` function

this function sends json data, it accepts one parameter this parameter should be an object and Grandjs stringify this object automatically

```javascript
res.json({user: "tarek", email: "test@gmail.com", id: 1});
```

#### ``res.redirect`` function
This function is used to make redirect to another link
It accepts one parameter

|parameter   |  type | description  |
|---|---|---|
|  url |  String (required) | this parameter should specify url that you want to redirect to |

```javascript
res.redirect("/anotherurl");
```

### ``res.status`` function
this function sets the status of the response with http status code, it accepts one parameter which is the status code of the response

```javascript

res.status(200).json({user: "tarek", email: "test@gmail.com", id: 1});
```

#### MiddleWares
middleWares is a group of functions used to run something before executing the final handler

the middWares property should be an array includes the functions

Every middleware should have three parameters

| parameter  | type  | description  |
|---|---|---|
| req  | object  | implies the coming request object contains all information about the request  |
|res   | object  | represents the response object  |
| next  | function  | is a function you can execute it to continue to the next middleWare or to the final handler of the router  |

**Example**

```javascript
//middle ware
function writeWithMiddleware(req, res, next) {
    // has three parameters
    /*
    1- req: the request object
    2- res: the response object
    3- next: a function you execute it to continue to the handler
    */
   res.write("from middleware");
   next();
}
homePage() {
    return {
        url: "/home",
        middleWares: [],
        method: "get",
        handler: (req, res) => {
            res.end("hello home page");

            // final output on the browser:
            //from middleware
            //hello home page
        }
    }
}
```

**note that the middlWares array can include many middleWare functions and the middleWares are applied according to the indexing inside the array**

#### Use Router class inside another router class
you can build a router class and append another router class to its parent, This is designed for special use case as the following:
suggest you have parent router class has basename `/admin`
and you want to group some of routes to manage products for example so the default way you can create another class with basename `/admin/products`
so we came up with the solution to use router classes inside another routing classes which give you the flexibility to use child routes inside parent route as the following:

```javascript
// admin product routes
class ProductRoutes extends Router{
    constructor(options) {
        super(options);
        // add post routers to the array
        this.postRouters = [this.addProduct()]
    }
    addProduct() {
        return {
            url: "/product",
            method: "POST",
            handler: (req, res) => {
                console.log(req.data);
            }
        }
    }
}

// admin router
class AdminRoutes extends Router{
    constructor(options) {
        super(options)
        this.getRouters = [this.homePage()];
        // use child router class
        this.useRouter(ProductRoutes)
    }
    homePaage() {
        return {
            url: "/",
            method: "GET",
            handler: (req, res) => {
                res.end("home page!");
            }
        }
    }
}
```

## TypeScript Decorators
If you are using typescript wit Grandjs, you can use decorators to decorate your route methods!
Currently grandjs supports the following decorators

- `GET` (for get methods)
- `POST` (for post methods)
- `PATCH` (for patch methods)
- `PUT` (for put methods)
- `DELETE` (for delete methods)
- `MiddleWare` (for methods that act as middleWares)

**Example**
```typescript
import {Router, Request, Response} from "grandjs"
import {GET, POST, PATCH, PUT, DELETE, MiddleWare} from "grandjs";

class UserRouter extends Router{
  // get user page
  @GET({url: "/user"})
  getUserPage(req: Request, res: Response) {
    return res.status(200).json({status: 200, message: "hello world"});
  }
  // middleware
  @MiddleWare
  userMiddleWare(req: Request, res: Response, next: Function) {
    // check the user
    if(req.user) {
      // continue
      return next();
    } else {
      return res.status(401).json({status: 401, message: "user is not authorized"});
    }
  }
}
```
**Note**
the decorator function injects the method into the proper array of methods, so if you use `@GET` decorator it will be injected in `getRouters` array, the same thing for other routes, if you use `@MiddleWare` decorator, it will inject the method in `globalMiddleWares` array

### Validation

Grandjs includes awesome validation system to validate inputs and remove strip tags and check the correct email
**you can access on validation using on of two ways**
1- importing the module

**Example**

```javascript
//javascript
const {validation} = require("grandjs");

// typescript
import {validation} from "grandjs";
```

2- as a property inside the request object

```javascript
const handler = (req, res) => {
    console.log(req.validation);
}
```

#### ``validation.striphtmltags`` function

this function removes weird characters from the string to insure that there is no harmful characters inside the string
```javascript
let str = "h1hello worldh1"
Grandjs.helpers.validation.strip_html_tags(str) // output hello world
```

<!-- <hr style="border:.5px solid black;height:0"> -->

#### ``validation.checkEmail`` function
This function checks if the string is emain or not


this function takes two parameters

| parameter  | type  |  description |
|---|---|---|
| email  |  string (required) | this parameter is required and it should be a string that you want to test it as email or not |
|  cb |  function (optional) |  this is a callback function you can call it and includes one parameter either be true or false  |

This function you can call it async with a callback function or sync without callback

1- with callback function
```javascript
Grandjs.helpers.validation.checkEmail("test@gmail.com", (email) => {
    if(email) {
        console.log(email) //output true if it email
    } else {
        console.log(email) // output false if itsn't email
    }
});
```
2- without callback
```javascript
let email = Grandjs.helpers.validation.checkEmail("test@gmail");
console.log(email) // returns true if it email, if not,  returns false
```
<!-- <hr style="border:.5px solid black;height:0"> -->
#### ``validation.notEmpty`` function

This function checks if the given string is empty or not

it accepts two parameters

| parameter  | type  |  description |
|---|---|---|
| string  |  string (required) | to test it is empty or not |
|  cb |  function (optional) |  this is a callback function you can call it and includes one parameter either be true or false  |

This function you can call it async with a callback function or sync without callback

1- with callback function

```javascript

Grandjs.helpers.validation.notEmpty("", (notEmpty) => {
    if(notEmpty) {
        console.log(notEmpty) //output true if it is not empty
    } else {
        console.log(notEmpty) // output false if it is empty
    }
});
```

2- without callback

```javascript

let notEmpty = Grandjs.helpers.validation.notEmpty("");
console.log(email) // returns true if it isn't empty, if it is empty,  returns false
```
<!-- <hr style="border:.5px solid black;height:0"> -->
#### ``validation.checkContainsNumber`` function

This function checks if the given string contains numbers or not

it accepts three parameters

| parameter  | type  |  description |
|---|---|---|
| string  |  string (required) | to test it contains numbers or not |
|  count | Number (required)  |  refers to the count of the number you want to test the string contains. if you specify it for example 5 so the function checks if the given string contains five numbers |
|  cb |  function (optional) |  this is a callback function you can call it and includes one parameter either be true or false  |

This function you can call it async with a callback function or sync without callback

1- with callback function

```javascript
Grandjs.helpers.validation.checkContainsNumber("Grandjs32test1", 3, (containsNumbers) => {
    if(containsNumbers) {
        console.log(containsNumbers) //output true if it contains number
    } else {
        console.log(containsNumbers) // output false if it doesn't contain three numbers
    }
});
```

2- without callback

```javascript
let containsNumbers =
Grandjs.helpers.validation.checkContainsNumber("Grandjs32test1", 3);
console.log(containsNumbers) // returns true if it contains 3 numbers, returns false if not
```
<!-- <hr style="border:.5px solid black;height:0"> -->
#### ``validation.checkIsNumber`` function

This function checks if the given parameter is a number or not
you can use this function to authenticate phone number and stuff like that

it accepts two parameters

| parameter  | type  |  description |
|---|---|---|
| value  |  any (required) | to test it is number or not |
|  cb |  function (optional) |  this is a callback function you can call it and includes one parameter either be true or false  |

This function you can call it async with a callback function or sync without callback

1- with callback function

```javascript
let test = 1222;
Grandjs.helpers.validation.checkIsNumber(test, (number) => {
    if(number) {
        console.log(number) //output true if it is number
    } else {
        console.log(number) // output false if it isn't number
    }
});
```
2- without callback
```javascript
let test = 1222;
let number = Grandjs.helpers.validation.checkIsNumber(test);
console.log(number) // returns true if it is number, returns false if not
```


### Cryption
Grandjs gives you functionalities to crypt important info and cipher them and decrypt them
encryption functions are inside helpers inside grandjs library
This helper uses the ``ENCRYPTION_KEY`` that you specify in ``setConfig`` function.

**not that the length of ``ENCRYPTION_KEY`` should be 32 character**

#### enCrypt
```javascript

Grandjs.helpers.enCrypt(text);

```

This function takes one parameter which refers to the string you wanna encrypt or cipher it

|parameter   | type  | description  |
|---|---|---|
| text  | string (required)  | implies the text that you wanna cipher it |

This function rreturns the string after cipher it

```javascript
const {Cipher} = require("grandjs");
// encrypt password
let encryptedPassword = Cipher.enCrypt("passowrd");
```


#### deCrypt

```javascript

const {Cipher} = require("grandjs");
Cipher.deCrypt(text);
```
This function takes one parameter which refers to the string you wanna decrypt or decipher it

|parameter   | type  | description  |
|---|---|---|
| text  | string (required)  | implies the text that you wanna decipher it |

This function rreturns the string after decipher it

```javascript
// encrypt password
let decryptedPassword = Grandjs.helpers.deCrypt("passowrd");
```
<!-- <hr style="border:.5px solid black;height:0"> -->


### Session

This Module is deprecated, you can use [Express session](https://www.npmjs.com/package/express-session) and [Cookie-parser](https://www.npmjs.com/package/cookie-parser) instead!

### Flash Messages

This Module is deprecated, you can use [express flash messages](https://www.npmjs.com/package/express-flash) instead!

**Example**

```javascript
// javascript
const {Server} = require("grandjs");
// typescript
import {Server} = from "grandjs";

const flash = require('express-flash'),
const session = require('express-session')
const cookieParser = require("cookie-parser");
Server.use(cookieParser('keyboard cat'));
Server.use(session({ cookie: { maxAge: 60000 }}));
Server.use(flash());
```
## Add MimeTypes



if you want to serve more static files with another mimetype not exist in our built in mimetypes, so you can use the following function

```javascript

Server.addMimeTypes(extention, mimeType);
```

This function takes two parameters

|Parameter| type| description|
|---|---|----|
|   extention   |  string (required) | represents the extention of the file that you want to check  |
|   mimeType   |  string (required) | The mime type that you want to set in the response header for the specific file  |

**Exmple**

```javascript
Server.addMimeTypes(".pdf", "application/pdf");
```


### Grandjs File Upload



Grandjs includes a small helpers for working with files and images specifically, you can use it  via calling it from grandjs:

```javascript
// javascript
const {FileUpload} = require("grandjs");
// typescript
import {FileUpload} from "grandjs"
```

file upload has property called `uploadPath` which is the destination to save files in, you can change it anytime by calling `setUploadPath` method as the following:

```javascript
FileUpload.setUploadPath("./uploads");
```

FileUpload has implementation to make a directory in a specific destination

**Example**
```javascript
FileUpload.makeDirectory("./uploads/images");
```


##### Save Base64 as image
you can save base 64 file as image using this function:
```javascript
FileUpload.saveImageBase64(data, uploadPath)
/*
uploadPth: // default is uploadPath of the class
*/
```
this function returns promise




### Socket Io Support
Grandjs is extendable to use with socket io for realtime applications, here is an example on using grandjs with socket io

```javascript
const {Server} = require("grandjs");
const socketIo = require("socket.io");
Server.setConfig({
    //define the port
    port: process.env.PORT || 3000,
    // http is optional you can specify http or https, if you don't specify Grandjs automatically require HTTP module
    http: http,
    // if you specified https so you should ssl files in this object
    httpsMode: {
        key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
        cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
    }
    //set the encryption key, Grandjs uses encription key to cypher info
    ENCRYPTION_KEY: "ncryptiontestforencryptionproces",

    //set error page for global error pages
    errorPage(req, res) {
        res.end("error page");
    }
});

// init Grandjs
Server.initServer();


const io = socketIo(Server.Server);
io.on("connect", () => {
    console.log("connected successfully")
})
```

now once you run the application you can connect on socket via port `3000`


# JSX
## Writing JSX in Grandjs
### About
Grandjs Depends on JSX for rendering dynamic/static HTML markups, it converts the jsx syntax to html string by native parser, also the rendered JSX markup is a stateless

Grandjs loads JSX components and files on runtime fastly without a need to bable or any transpilers, Grandjs uses `import-jsx` package for requiring jsx files

## Why ?

Actually there is many different template engines can be used, all these template engines are efficient and good to work with, but you will learn a new syntax of each template engine, also you will suffer from the hassle of searching helpers for this template engine to add new features like conditions, mathematical operations inside the html markup, however we have JSX!
Most of developers now know JSX and know how can they render it, "thanks React!", so We see using JSX is good, efficient and fast in rendering and Friendly syntax that allow you to write the whole Application in just javascript, with getting the benefits if Javascript methods, helpers, functions inside the HTML markup
### How ?

Grandjs exports an object called `View`, this object includes some builtin methods and configuration for parsing, and caching jsx syntax and converting it to html strings and then send this HTML markup to the browser

**Note**
JSX syntax shouldn't be written in the entry point file, you should create a folder called `views` for example and put all JSX code there by dividing into functional components and requiring the component you wherever you want
**Example**

Project Structure
### Directory Structure  
<pre>
 ┬  
 ├ views
    ┬
    ├ App.jsx
    ├ Home.jsx
 ├ index.js
</pre>

in App.jsx

```jsx
// jsx
// importing {View} is mandatory
const {View} = require("grandjs");
// typescript
import {View} from "grandjs";
const App = (props) => {
    return (
        <div>
            <h1>hello App Component</h1>
        </div>
    )
}
module.exports = App;
```
in Home.jsx file
```jsx
const {View} = require("grandjs");
// typescript
import {View} from "grandjs";
const App = View.importJsx("./App.jsx");
const Home = (props) => {
    return (
        <div>
            <h1>This is home page</h1>
            <App/>
        </div>
    )
}
module.exports = Home;
```

**Note**


1- Any Component you write you have to import `{View}` inside the file that you write the component in, to make grandjs recognize and compile that file

2- The component should be a functional Component as the following:
```jsx
const App = (props) => {
    return (
        <div>
            <h1>hello App Component</h1>
        </div>
    )
}
```
3- You have to export the component as a nodejs module in commonjs syntax like the following:

```jsx
module.exports = App;
```

4- Importing JSX Component Should be using `View.importJsx` function which will recognize that this file is jsx syntax

```javascript
const Home = View.importJsx("./views/Home.jsx");
```


```javascript
// importing {View} is mandatory
const {Server, View, Router} = require("grandjs");
// typescript
import {Server, View, Router} from "grandjs";
// import Home Page
const Home = View.importJsx("./views/Home.jsx");
const router = new Router({base: "/"})

router.addRoute({
    url: "/",
    method: "GET",
    handler: (req, res) => {
        return res.status(200).render(Home, {})
    }
})
router.build();
Server.setConfig({port: 3000});
Server.initServer();
```





## Built With
* [Tarek Salem](https://github.com/tareksalem)



## Authors

* **Tarek Salem** - *Initial work* - [github](https://github.com/tareksalem)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
* url-pattern
* Handlebars template engine
* Hat tip to anyone whose code was used
* Inspiration
