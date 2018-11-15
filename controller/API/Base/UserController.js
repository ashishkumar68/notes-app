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
const processUserService = require('../../../middleware/ProcessUserRequest');

let UserController = (function () {
    /**
     *  POST /user/oauth API.
     *
     *  Function to handle POST /user/oauth API request.
     *
     *  @param request
     *  @param response
     *  @param urlContent
     *  @param content
     *
     *  @return void
     */
    let createAuthToken = function (request, response, urlContent, content) {

        content = JSON.parse(content);
        // Getting DB connection.
        dbConnection.getConnection()

        // After success doing Validation of OAuth Request
        .then(function (connection) {
            return validateUserService.validateOAuthRequest(content, connection)
        })

        // Processing the Validation Result
        .then(function (validateResult) {
            return authService.createJWTToken(content.username);
        })

        // Creating Success Response.
        .then(function (processingResult) {
            dbConnection.terminateConnection();
            // Creating Success response from API.
            apiResponseService.createApiSuccessResponse(response,
                'OAuthResponse', processingResult.message.response, 200);
        })

        // Processing for Error Case.
        .catch(function (error) {
            dbConnection.terminateConnection();
            // Creating Error Response.
            apiResponseService.createApiErrorResponse(response,
                error.errorKey, error.status)
        })
        ;
    };

    /**
     *  GET /user/profile API.
     *
     *  Function to handle GET /user/profile API request.
     *
     *  @param {Object} request
     *  @param {Object} response
     *  @param {string} urlContent
     *  @param {string} content
     *
     *  @return void
     */
    let getUserDetails = function (request, response, urlContent, content) {
        // Getting DB connection.
        dbConnection.getConnection()

        // After success doing Processing of Fetch profile Request.
        .then(function (connection) {
            return processUserService.processGetUserProfileRequest(request.attrs.username, connection);
        })

        // Creating Success Response.
        .then(function (processingResult) {
            dbConnection.terminateConnection();
            // Creating Success response from API.
            apiResponseService.createApiSuccessResponse(response,
                'ProfileResponse', processingResult.message.response, 200);
        })

        // Processing for Error Case.
        .catch(function (error) {
            dbConnection.terminateConnection();
            // Creating Error Response.
            apiResponseService.createApiErrorResponse(response,
                error.errorKey, error.status)
        });
    };

    /**
     *  PUT /user/password API.
     *
     *  Function to handle PUT /user/password API request.
     *
     *  @param {Object} request
     *  @param {Object} response
     *  @param {string} urlContent
     *  @param {string} content
     *
     *  @return void
     */
    let changePassword = function (request, response, urlContent, content) {
        try {

            // checking if username is not set then throwing the error.
            if (undefined === request.attrs.username || 'string' !== typeof(request.attrs.username)) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            // Parsing the body content.
            content = JSON.parse(content);

            let newConnection = undefined;
            // Getting new DB connection.
            dbConnection.getConnection()

            // After fetching connection successfully, doing Validation of request.
            .then(function (connection) {
                newConnection = connection;
                return validateUserService.validateChangePasswordRequest(content, request.attrs.username, connection);
            })

            // After Successful validation doing the Processing of Request.
            .then(function (validationResult) {
                return processUserService.processChangePasswordRequest(content,
                    validationResult.message.response.user, newConnection);
            })

            // Creating success response after successful processing.
            .then(function (processingResult) {
                dbConnection.terminateConnection();
                // Creating Success response from API.
                apiResponseService.createApiSuccessResponse(response,
                    'ProfileResponse', processingResult.message.response, 200);
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

    return {
        createAuthToken,
        getUserDetails,
        changePassword
    };
})();

module.exports = UserController;