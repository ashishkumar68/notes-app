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

var UserController = (function () {
    /**
     *  Function to handle POST /user/oauth API request.
     *
     *  @param request
     *  @param response
     *  @param queryObject
     *  @param content
     *  @TODO: Complete processing part of function.
     */
    var createAuthToken = function (request, response, queryObject, content) {

        // Getting DB connection.
        dbConnection.getConnection()
        
        // After success doing Validation of OAuth Request
        .then(function (connection) {
            return validateUserService.validateOAuthRequest(JSON.parse(content), connection)
        })

        // Processing the Validation Result
        .then(function (validateResult) {
            
        })

        // Processing for Error Case.
        .catch(function (error) {
            // Creating Error Response.
            apiResponseService.createApiErrorResponse(response, 
                error.errorKey, error.status)
        });
    };

    return {
        createAuthToken
    };
})();

module.exports = UserController;