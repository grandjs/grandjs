# Grandjs
A backend framework for solid web apps based on node.js

You want to build a solid web application but you don't want to use express and alot of packages you need to build a basic website, Grandjs is one framework includes all main functionalities you need to build amazin, solid and secured web application without needing for ton of packages and libraries.

* Grandjs is built for solid and extended web apps
![GitHub contributors](https://img.shields.io/github/contributors/tareksalem/grandjs.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/grandjs.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/tareksalem/grandjs.svg)
![npm](https://img.shields.io/npm/dt/grandjs.svg?color=green&style=popout)
## Prerequisites

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
