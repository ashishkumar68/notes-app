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

// creating the Web Server.
var server = http.createServer(function (request, response) {
  response.write('Hello World');
  response.end();
});

// Fetching the environment.
var envName = undefined === process.env.environment
    || !Object.keys(config).includes(process.env.enrironment)
    ? generalContants.defaultEnvironment
    : process.env.environment
;

// Checking if the env name is valid then pulling the port of this ENV.
var PORT = config[envName].port;

//listen on a required PORT.
server.listen(PORT, function () {
  console.log('Listening on PORT:' + PORT + ' on Environment:' + envName);
});
