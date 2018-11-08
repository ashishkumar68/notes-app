/**
 *  UserController JS file for hanlding the requests related to User Module.
 *
 *
 *  @Category Controller
 *  @Author Ashish Kumar
 */
const errorConstants = require('../../../constants/ErrorConstants');
const apiResponseService = require('../../../middleware/ApiResponse');
const dbConnection = require('../../../middleware/DbConnect');
const validateUserService = require('../../../middleware/ValidateUserRequest');
const authService = require('../../../middleware/AuthenticateAuthorize');

let TaskController = (function () {
    /**
     *  POST /task API.
     *
     *  Function to handle POST /task API request.
     *
     *  @param request
     *  @param response
     *  @param urlContent
     *  @param content
     *
     *  @return void
     */
    let createTask = function (request, response, urlContent, content) {
debugger;
        content = JSON.parse(content);
        // Getting DB connection.
        dbConnection.getConnection()

        // After success doing Validation of OAuth Request
        .then(function (connection) {
            dbConnection.terminateConnection();
        })
    };

    return {
        createTask
    };
})();

module.exports = TaskController;