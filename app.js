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
const mainRouter = require('./router/MainRouter');
const apiResponseService = require('./middleware/ApiResponse');

// creating the Web Server.
let server = http.createServer(function (request, response) {
    // Delegating the request to Router to be handled and returning the response.
    mainRouter.handleRequest(request, response)
});

// Fetching the environment.
let envName = undefined === process.env.environment || 
      !Object.keys(config).includes(process.env.environment)
    ? generalContants.defaultEnvironment
    : process.env.environment
;

// Checking if the env name is valid then pulling the port of this ENV.
let PORT = config[envName].port;

//listen on a required PORT.
server.listen(PORT, function () {
    console.log('Listening on PORT:' + PORT + ' on Environment:' + envName);
});
