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
     *  @param {Object} urlContent
     *  @param {Object} content
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

    return {
        createAuthToken,
        getUserDetails
    };
})();

module.exports = UserController;