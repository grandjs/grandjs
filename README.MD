# GRAND JS

A backend framework for solid web apps based on node.js

You want to build a solid web application but you don't want to use express and alot of packages you need to build a basic website, Grandjs is one framework includes all main functionalities you need to build amazin, solid and secured web application without needing for ton of packages and libraries.

* Grandjs is built for solid and extended web apps

![GitHub contributors](https://img.shields.io/github/contributors/tareksalem/grandjs.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/grandjs.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/tareksalem/grandjs.svg)
![npm](https://img.shields.io/npm/dt/grandjs.svg?color=green&style=popout)
### Prerequisites

1- you need to install node.js on your system
2- init a new project using npm, so then we will be able to install this framework

## Features
* les packages and more productivity
* Framework includes the most needed functionalities to build perfect web app
* depends on Handlebars template Engine which is friendly with many developers
* solid routing system built on Javascript object oriented programming and you can extend it as you need
* controlled handling for every error page in your app
* Grandjs is built for solid and extended web apps

```javascript
//require HTTP module
const http = require("http");
//require Grandjs framework
const Grandjs = require("Grand");

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
    staticFolder: "public",
    //enable the session
    session: true,
    //set the encryption key, Grandjs uses encription key to cypher info
    ENCRYPTION_KEY: "ncryptiontestforencryptionproces",
    // set the max age of cookies when you set the session of logged in users
    setCookie: {
        expires: {
            days: 20,
            minutes: 30
        }
    },

    //set it true to see the console info while development process
    logger: true,

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
    - [Router](#router)
      - [extend Router class](#extend-router-class)
      - [Access on request and response objects](#access-on-request-and-response-objects)
      - [Request object](#request-object)
        - [Request params](#request-params)
        - [Handle post request](#handle-post-request)
      - [Response object](#response-object)
        - [``res.render`` function](#resrender-function)
        - [``res.write`` function](#reswrite-function)
        - [``res.end`` function](#resend-function)
        - [``res.sendFile`` function](#ressendfile-function)
        - [``res.json`` function](#resjson-function)
        - [``res.redirect`` function](#resredirect-function)
      - [middleWares](#middlewares)
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
  - [Built With](#built-with)
  - [Contributing](#contributing)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

## Installing

open the command prompt and navigate to the project folder and just say

```
npm install grandjs --save
```
## Getting Started
#### Server configuration
to start with Grandjs just install it and call it in your file as the following
```javascript
//require Grandjs framework
const Grandjs = require("Grand");
```
if you want to require HTTP or HTTPS module to pass it to Grand js you can, in all cases Grandjs behind the seen requires HTTP module as a default.

Now you need to call seConfig function to set some configuration for the project

```javascript
Grandjs.setConfig({});
```
**this function takes one parameter as an object**

**Example on all configuration**
```javascript
const http = require("http");
const Grandjs = require("Grand");

// define Grandjs configuration
Grandjs.setConfig({
    //define the port of the server
    port: 3000,
    // http is optional you can specify http or https, if you don't specify Grandjs automatically require HTTP module
    http: http,
    // define the static files container folder
    staticFolder: "public",
    //enable the session
    session: true,
    //set the encryption key, Grandjs uses encription key to cypher info
    ENCRYPTION_KEY: "ncryptiontestforencryptionproces",
    // set the max age of cookies when you set the session of logged in users
    setCookie: {
        expires: {
            days: 20,
            minutes: 30
        }
    },

    //set it true to see the console info while development process
    logger: true,

    //set error page for global error pages
    errorPage(req, res) {
        res.end("error page");
    }
})
```


until now Grandjs doesn't work so you need to call "init function" to initialize the server
```javascript
Grandjs.init();
```
<hr style="border:.5px solid black;height:0">
### Router

* Grandjs Routing system is built upon object oriented programming, so Router is a class inside Grandjs you extend it and add routes to it as you wanna
<br>

**to work with router class you need to extend it or instatiate it directly and every class implies a group of routes have a specific basename**

#### extend Router class

```javascript
class HomeRouter extends Grandjs.Router{
    constructor(options) {
        super(options);
    }
}
```
As any extended class you should call the super inside the constructor and pass the options parameter

| parameter   |     type   | 
|----------|:-------------:|
| options |  Object |

Now after defining the class you should define the get routers which related to this class
Router class has a property called "getRouters" this is an array and you push inside it the routers you add within the class with the GET method

**Example**

```javascript
class HomeRouter extends Grandjs.Router{
    constructor(options) {
        super(options);
        this.getRouters.push()
    }
}
```
**you can add routers which related to this class as methods inside the class and every method you use it as a router it should return an object has the following properties**

|Property   |  type |  description |
|---|---|---|
|  url |  string (required)| the url of the router  |
| method  |  string (required) |  HTTP method get / post / patch / put / delete |
| handler  |  function (required) | the function you want to run whem the request url matches the router url  |
| middleWares  | array (optional)  |  if you want to run a function or more to check about something before running the final handler of the router |

<hr style="border:.5px solid black;height:0">
###Define get routers
**Example**
```javascript
class HomeRouter extends Grandjs.Router{
    constructor(options) {
        super(options);

        //push the homePage method route into getRouters array
        this.getRouters.push(this.homePage);
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
```
<hr style="border:.5px solid black;height:0">
###Define post routers
**Example**
```javascript
class HomeRouter extends Grandjs.Router{
    constructor(options) {
        super(options);

        //push the homePage method route into getRouters array
        this.postRouters.push(this.homePagePost);
    }
    homePagePost() {
        return {
            //define the url of router
            url: "/",
            // define the method of the router
            method: "POST",
            handler: () => {
                // handle the request and do the functionalities
            }
        }
    }
}
```

###instantiate router class
**Example**
```javascript
class HomeRouter extends Grandjs.Router{
    constructor(options) {
        super(options);

        //push the homePage method route into getRouters array
        this.getRouters.push(this.homePage);
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
const homeRoters = new HomeRouter({});
```

when you instantiate the class you should define the options parameter as an object includes two properties
| property   |     type   |descriptions |
|----------|:-------------:|-----: |
| base |  string (required) | implies the base url you want to add routers to it. so if you defined it as "/admin" all routers inside this class would be added to /admin|
| staticFolder  | string(optional)  | the name of the folder you want to serve assets and statoc files from it. The default value of it is the global staticFolder that you specified in setConfig function

**Example**
```javascript
const homeRoters = new HomeRouter({
    base: "/"
});
```
<hr style="border:.5px solid black;height:0">
### Access on request and response objects

to handle the routers and check requests and responses you need to access on them, so these object are accessable using different ways

1- req & res objects are properties inside the class
**Example**
```javascript
class HomeRouter extends Grandjs.Router{
    constructor(options) {
        super(options);

        //push the homePage method route into getRouters array
        this.getRouters.push(this.homePage);
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
<hr style="border:.5px solid black;height:0">
####Specify a separated folder for static files for this group of routes
```javascript
const homeRoters = new HomeRouter({
    base: "/",
    //specify the container folder fo static file for all routes inside this class
    staticFolder: "homePublic"
});
```
<hr style="border:.5px solid black;height:0">
####Router add route
This function enables you to add routers to the class from outside it
```javascript
homeRoters.addRoute(obj);
```
this function takes one (required) parameter as an object has the following properties:
|Property   |  type |  description |
|---|---|---|
|  url |  string (required)| the url of the router  |
| method  |  string (required) |  HTTP method get / post / patch / put / delete |
| handler  |  function (required) | the function you want to run whem the request url matches the router url  |
| middleWares  | array (optional)  |  if you want to run a function or more to check about something before running the final handler of the router |

**Example**
```javascript
const adminRoute = new Grandjs.Router({
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
<hr style="border:.5px solid black;height:0">
###Router class errorPage
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
                this.res.end("hello home page);
            }
        }
    }
    aboutPage() {
        return {
            url: "/about",
            method: "get",
            handler: () => {
                this.res.end("hello about page);
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
const homeRouter = new Grandjs.Router({
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
*not that if you didn't define error page for the router class it automatically call error page which you specified in setConfig function
<hr style="border:.5px solid black;height:0">
###Router url define params
you can add params to the url of the router to make dynamic routes like the following:
```javascript
url: "/posts/:postId"
```
to access on the parameters inside the url using [request.params property](#request-params)
**Example**
```javascript
const homePage = new Grandjs.Router({
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
<hr style="border:.5px solid black;height:0">

####Request Object
this is an object you can access on it inside the handler of the route
and the object contains the all information about the request which is coming

|Property   |  type |  description |
|---|---|---|
| req.method  | string  | returns the method of the current request  |
|  req.pathname |  string |  returns the requested url without query string |
|req.path  |  string | returns the requested url with query string |
|req.href  |  string | returns the requested url with query string |
| req.url  |  object | returns object contains the parsed url  |
|req.query   |  object | contains the query & search in the url(it parsed as key and value)  |
| req.params  |  object | returns the query parameters if it exists as key and value  |
| req.validation  | object  | returns an object contains some helper functions to valiate the email and string  |
| req.data  | object  | returns an object contains the posted data if the method is "post"  |
|  req.headers | object  | returns the headers of the comming request  |
| req.flash  | object  |  this object enables you to set messages to send it to handlebars to show to the user |

#### Request params
returns an object contains the parameters of the router url and it's value if it exists
if there is no params so it returns an empty object
**Example**
```javascript
const homePage = new Grandjs.Router({
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

<hr style="border:.5px solid black;height:0">
####Handle post request
Grandjs handls all types of post requests and sumited data and returns them as an object called ``req.data`` this object contains all the submitted data and you can access on it inside the handler function if the method of router is post

**Example**
```javascript
postAdminPage() {
    return {
        method: "post",
        url: "/admin/addinfo",
        handler: (req, res) => {
            console.log(req.data) //output {} contains all submitted info
        }
    }
}
```
<hr style="border:.5px solid black;height:0">
####Response Object
this is an object you can access on it inside the handler of the route
This object contains all methods that you need to send a response or content to the coming request

#### ``res.render`` function

This function you use it to render html content using handlebars template engine

```javascript
res.render()
```
takes one parameter as an object, this object should contains the following properties:
| property  |  type | description |
|---|---|---|
|  container |  string (required) | this property you specify the container folder which includes all handlebars files  |
| layout  | string (required)  | should be the path of the layout file |
| body  | string (optional)  | should be the path of the body file  |
|  partials | Array (optional)  | every item inside this array should be a string refers to the path of the partial file that you want to append to the layout  |
| data  | object (optional)  | object contains the data you want to render inside the handlbars files  
**Example**
```javascript
    homePageRouter() {
        return {
            url: "/",
            method: "get",
            handler: () => {
                // render content using handlebars template engine
                this.res.render({
                    container: "views",
                    layout: "/layouts/layout.hbs",
                    body: "/pages/home.hbs"
                })
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

####``res.json`` function
this function sends json data, it accepts one parameter this parameter should be an object and Grandjs stringify this object automatically
```javascript
res.json({user: "tarek", email: "test@gmail.com", id: 1});
```
####``res.redirect`` function
This function is used to make redirect to another link
It accepts one parameter
|parameter   |  type | description  |
|---|---|---|
|  url |  String (required) | this parameter should specify url that you want to redirect to |

```javascript
res.redirect("/anotherurl");
```

<hr style="border:.5px solid black;height:0">

#### MiddleWares
middlewares is a group of functions used to run something before executing the final handler

the middWares property should be an array includes the functions

Every middleware should has three parameters

| parameter  | type  | description  |
|---|---|---|
| req  | object  | implies the coming request object contains all information about the request  |
|res   | object  | represents the response object  |
| next  | function  | is a function you can execute it to continue to the final handler of the router  |
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
<hr style="border:.5px solid black;height:0">
### Validation
Grandjs includes awesome validation system to validate inputs and remove strip tags and check the correct email
**you can access on validation using on of two ways**
1- Grandjs.helpers.validation
2- as a property inside request object inside handlers
#### ``validation.strip_html_tags`` function
this function removes weird characters from the string to insure that there is no harmful characters inside the string
```javascript
let str = "h1hello worldh1"
Grandjs.helpers.validation.strip_html_tags(str) // output hello world
```

<hr style="border:.5px solid black;height:0">

#### ``validation.checkEmail`` function
This function checks if the string is emain or not


this function takes two parameters

| parameter  | type  |  description |
|---|---|---|
| email  |  string (required) | this parameter is required and it should be string that you want to test it as email or not |
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
<hr style="border:.5px solid black;height:0">
#### ``validation.notEmpty`` function

This function checks if the given string is empty or not

it accepts two parameters:
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
<hr style="border:.5px solid black;height:0">
#### ``validation.checkContainsNumber`` function

This function checks if the given string contains numbers or not

it accepts three parameters:
| parameter  | type  |  description |
|---|---|---|
| string  |  string (required) | to test it contains numbers or not |
|  count | Number (required)  |  refers to the count of number you want to test the string contains. if you specify it for example 5 so the function checks if the given string contains five numbers |
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
<hr style="border:.5px solid black;height:0">
#### ``validation.checkIsNumber`` function

This function checks if the given parameter is a number or not
you can use this function to authenticate phone number and stuf like that

it accepts two parameters:
| parameter  | type  |  description |
|---|---|---|
| val  |  any (required) | to test it is number or not |
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
<hr style="border:.5px solid black;height:0">

###Cryption
Grandjs gives you functionalities to crypt important info and cipher them and decrypt the
cryption functions are inside helpers inside grandjs library
This helper uses the ``ENCRYPTION_KEY`` that you specify in ``setConfig`` function.
####enCrypt
```javascript
Grandjs.helpers.enCrypt(text);
```
This function takes one parameter which referes to the string you wanna encrypt or cipher it
|parameter   | type  | description  |
|---|---|---|
| text  | string (required)  | implies the text that you wanna cipher it |

This function rreturns the string after cipher it
```javascript
// encrypt password
let encryptedPassword = Grandjs.helpers.enCrypt("passowrd");
```
<hr style="border:.5px solid black;height:0">
####deCrypt
```javascript
Grandjs.helpers.deCrypt(text);
```
This function takes one parameter which referes to the string you wanna decrypt or decipher it
|parameter   | type  | description  |
|---|---|---|
| text  | string (required)  | implies the text that you wanna decipher it |

This function rreturns the string after decipher it
```javascript
// encrypt password
let decryptedPassword = Grandjs.helpers.deCrypt("passowrd");
```
<hr style="border:.5px solid black;height:0">


###Session
Grandjs represents to you a session module which you can use it in login processes and setting cookies for logged in users

* you need to enable session in Grandjs configuration inside ``Grandjs.setConfig`` function as the following:
```javascript
Grandjs.setConfig({
    // enable session module
    session: true
})
```
2- now you need to set the max age of cookies for global sessions inside ``Grandjs.setConfig`` function as the following:
```javascript
Grandjs.setConfig({
    //enable session
    session: true
    //set cookies for one month and 30 minutes, after that it would be removed
    setCookie: {
        expires: {
            days: 30, // refers to one month
            minutes: 30 //refers to 30 minutes
        }
    }
})
```
``setCooki`` is an object, you specify inside it an object called ``expires`` this object has two properties
|property   | type  | description  |
|---|---|---|
|days   | number (optional)  | refers to the number of days that you want to set the cookie until it  |
|minutes   | number  | referes to the number of minutes that you want set the cookie until it  |

**Not that session is a global variable you can access on it from anywhere insde the project**

<hr style="border:.5px solid black;height:0">
#### ``session.set`` function
This is a function you call it when you want to set a session, this function takes three parameters:
| parameter  | type  | description  |
|---|---|---|
|sessionName   | string(required)  | this parameter specified the name of the session for example if the session for login so you can set it as "userInfo"  |
|obj   | object (required)  | this is the info that you want to store in the session  |
|sessionOptions  | object (optional)  | represents specific cookie configuration for this session only  |

**Example on session inside handler function**

* set it without custom cookie
```javascript
postRouter () {
    return {
        url: "/user",
        method: "post",
        handler: () => {
            let userdata = this.req.data;
            // set it without custom cookie
            session.set("userdata", userdata);
        }
    }
}
```
* set it with a custom cookie
```javascript
postRouter () {
    return {
        url: "/user",
        method: "post",
        handler: () => {
            let userdata = this.req.data;
            // set it without custom cookie
            session.set("userdata", userdata, {
                days: 1 // set the cookie for one day only
            });
        }
    }
}
```
<hr style="border:.5px solid black;height:0">
#### `session.getSession` function
This function gets the session of the user based on the name of the session that you specified in ``session.set`` function

if the session is exist this function returns an object contains data that you have stored, and if no session with that name it will return an undefined
```javascript
let info = session.getSession("userdata");
console.log(info) //output: object || undefined
```
<hr style="border:.5px solid black;height:0">
#### ``session.updateSession`` function
This function is very similar to ``session.set`` function and it takes the same parameters but this function you use it to updating an already exist session
```javascript
    // update exit session
    session.set("userdata", {name: "tarek", password: "blablabla"});
```
<hr style="border:.5px solid black;height:0">

#### ``session.breakSession`` function
This function breaks the session and stops it, so you use it when the user logs out

This function takes one parameter, that parameter is the name of the session that you want to break
```javascript
// break the session
session.breakSession("userdata");
```
<hr style="border:.5px solid black;height:0">
### Auth module
This module is a built in module in Grandjs, it is used to make authentication inside the system to allow user login and logout securely.
This module depends on session

* Auth module is a global module you can access on it from any file inside the project
* This module represents to some functionalities for loging in process

#### ``auth.login`` function
This function is used to login the user when he signs up or in.
* This function takes the same parameters of ``session.set`` function and ``auth.login`` depends on it


This function takes three parameters:
| parameter  | type  | description  |
|---|---|---|
|loginName   | string(required)  | this parameter specified the name of the session for example if the session for login so you can set it as "userInfo"  |
|obj   | object (required)  | this is the info that you want to store in the session  |
|sessionOptions  | object (optional)  | represents specific cookie configuration for this session only  |
```javascript
// login the user
auth.login("userdata", {username: "tarek", email:"test@gmail.com"});
```
<hr style="border:.5px solid black;height:0">

#### ``auth.checkAuth`` function
This function is used to check if the user is logged in or not
* If the user is logged in returns: ``true``
* if the user isn't logged in returns: ``false``
```javascript
let logged = auth.checkAuth();
// output: true | false
```
<hr style="border:.5px solid black;height:0">
#### ``auth.Auth`` function
This function is optional to use, the of it is if you are doing a heavy checks before require ``auth.login`` function so Grandjs represents to you this function which enables you to make some processing and returns a callback function after that has ``done`` parameter, it's value is: ``true`` or ``false``
```javascript
auth.Auth((done, cb) => {
    // make some logic here
    let some = 1+2;
    if(some === 3) {
        // set the done parameter
        done = true;
        return cb(done);
    } else {
        done = false;
        return cb(done);
    }
    //  
}, (done) => {
    console.log(done) // outputs true
    if(done == true) {
        // login the user
        auth.login("userdata", {});
    }
})
```
<hr style="border:.5px solid black;height:0">
#### ``auth.logout`` function
This function depends on ``session.breakSession`` function, it logouts the user and destroys the session

```javascript

// logout the user
auth.logout();
```
<hr style="border:.5px solid black;height:0">

### Flash Messages
Flash is an object inside ``request`` object, it allows you to set messages to send them to the handlebars to show allert messages or success or any message you want to show from backend to frontent


flash is accessable inside any router handler
**Example**
```javascript
// post router
router.addRoute({
    url: "/login",
    method: "post",
    handler: () => {
        // set error message
        req.flash.errorMessage = "user not found"
    }
})
// get router
router.addRoute({
    url: "/login",
    method: "get",
    handler: () => {
        this.res.render({
            layouts: "./views/layouts/main.hbs",
            body: "login.hbs",
            data: {
                errorMessage: this.req.flash.errorMessage
            }
        })
    }
})
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
