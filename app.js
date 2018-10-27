/**
 *  app.js to be executed first while starting the project.
 *
 *  @Category JS
 *  @Author Ashish Kumar
 */

// Pulling http module.
const http = require('http');
const config = require('./config/config');
const generalContants = require('./constants/GeneralConstants');
const url = require('url');
const dotenv = require('dotenv');

// Loading the .env variables.
dotenv.load();

// creating the Web Server.
var server = http.createServer(function (request, response) {
    // Parsing the url String.
    var parsedUrl = url.parse(request.url, true);
    // replacing the first and last / from path String
    var route = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

    response.write('Hello World');
    response.end();
});

// Fetching the environment.
var envName = undefined === process.env.environment || 
      !Object.keys(config).includes(process.env.environment)
    ? generalContants.defaultEnvironment
    : process.env.environment
;

// Checking if the env name is valid then pulling the port of this ENV.
var PORT = config[envName].port;

//listen on a required PORT.
server.listen(PORT, function () {
    console.log('Listening on PORT:' + PORT + ' on Environment:' + envName);
});
