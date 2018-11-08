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
const validateTaskService = require('../../../middleware/ValidateTaskRequest');
const processTaskService = require('../../../middleware/ProcessTaskRequest');
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
        try {
            // checking if username is not set then throwing the error.
            if (undefined === request.attrs.username || 'string' !== typeof(request.attrs.username)) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            content = JSON.parse(content);

            // Validating the request content.
            validateTaskService.validateCreateTaskRequest(content);

            // Getting DB connection.
            dbConnection.getConnection()

            // After fetching connection successfully, doing Processing of Create Task Request
            .then(function (connection) {
                return processTaskService.processCreateTaskRequest(content, request.attrs.username, connection);
            })

            // After successful processing return the success API response.
            .then(function (processResult) {
                dbConnection.terminateConnection();
                // Creating Success response from API.
                apiResponseService.createApiSuccessResponse(response,
                    'TaskResponse', processResult.message.response, 200);
            })

            // In case of failure throwing the error.
            .catch(function (err) {
                dbConnection.terminateConnection();
                // Creating Error Response in case of Error.
                apiResponseService.createApiErrorResponse(response,
                    err.errorKey, err.status)
            });
        } catch (err) {
            // Logging the error and returning the Error API Response.
            console.log(arguments.callee.name + ' Function failed due to Error: ' + JSON.stringify(err));
            let error = err.hasOwnProperty('status')
                ?   err
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            // Creating Error Response.
            apiResponseService.createApiErrorResponse(response,
                error.errorKey, error.status)
        }
    };

    return {
        createTask
    };
})();

module.exports = TaskController;