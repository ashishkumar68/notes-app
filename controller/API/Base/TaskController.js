/**
 *  UserController JS file for handling the requests related to User Module.
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

    /**
     *  PUT /task API.
     *
     *  Function to handle PUT /task API request.
     *
     *  @param request
     *  @param response
     *  @param urlContent
     *  @param content
     *
     *  @return void
     */
    let updateTask = function (request, response, urlContent, content) {
        try {

            // checking if username is not set then throwing the error.
            if (undefined === request.attrs.username || 'string' !== typeof(request.attrs.username)) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            content = JSON.parse(content);
            let newConnection = null;

            // Getting DB connection.
            dbConnection.getConnection()

            // After fetching connection successfully, doing Validation the Update Task request
            .then(function (connection) {
                newConnection = connection;
                return validateTaskService.validateUpdateTaskRequest(content, request.attrs.username, connection);
            })

            // Processing request after successful Validation.
            .then(function (validateResult) {
                return processTaskService.processUpdateTaskRequest(content, newConnection)
            })

            // Creating success response after successful processing.
            .then(function (processingResult) {
                dbConnection.terminateConnection();
                // Creating Success response from API.
                apiResponseService.createApiSuccessResponse(response,
                    'TaskResponse', processingResult.message.response, 200);
            })

            // Handling Reject in case of error.
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

    /**
     *  PATCH /task API.
     *
     *  Function to handle PATCH /task API request.
     *
     *  @param request
     *  @param response
     *  @param urlContent
     *  @param content
     *
     *  @return void
     */
    let patchUpdateTask = function (request, response, urlContent, content) {
        try {

            // checking if username is not set then throwing the error.
            if (undefined === request.attrs.username || 'string' !== typeof(request.attrs.username)) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            content = JSON.parse(content);
            let newConnection = null;

            // Getting DB connection.
            dbConnection.getConnection()

            // After fetching connection successfully, doing Validation the Patch Update Task request
            .then(function (connection) {
                newConnection = connection;
                return validateTaskService.validatePatchUpdateTaskRequest(content, request.attrs.username, connection);
            })

            // After successful request validation processing the request.
            .then(function (validateResult) {
                return processTaskService.processPatchUpdateTaskRequest(content, newConnection)
            })

            // Creating success response after successful processing.
            .then(function (processingResult) {
                dbConnection.terminateConnection();
                // Creating Success response from API.
                apiResponseService.createApiSuccessResponse(response,
                    'TaskResponse', processingResult.message.response, 200);
            })

            // Handling Reject in case of error.
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

    /**
     *  GET /task/list API.
     *
     *  Function to handle GET /task/list API request.
     *
     *  @param request
     *  @param response
     *  @param urlContent
     *  @param content
     *
     *  @return void
     */
    let getTasksList = function (request, response, urlContent, content) {
        try {

            // checking if username is not set then throwing the error.
            if (undefined === request.attrs.username || 'string' !== typeof(request.attrs.username)) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            content = JSON.parse(urlContent);

            // Validating the request content.
            let validateResult = validateTaskService.valideteFetchTaskListRequest(content);

            let newConnection = null;

            // TODO: Complete the request processing part.
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

    // exposing the public functions.
    return {
        createTask,
        updateTask,
        patchUpdateTask,
        getTasksList
    };
})();

module.exports = TaskController;