/**
 *  ApiResponse JS file for creating final responses to be released from APIs.
 *
 *  @Category Middleware
 *  @Author Ashish Kumar
 */
const errorConstants = require('../constants/ErrorConstants');
const translator = require(__dirname + '/../config/translator');

var apiResponseService = (function () {
    
    /**
     *  Function to create Error Response to be returned from API.
     *
     *  @param response
     *  @param errorKey
     *  @param statusCode
     *  @param contentType
     */
    var createApiErrorResponse = function (response, errorKey, statusCode, contentType) {
    	contentType = undefined === contentType ? 'application/json' : contentType;

        // Creating Final Response Message.
        createEndServerResponse(response, statusCode, 
            {
                'Content-Type' : contentType
            },
            {
                reasonCode: '1',
                reasonText: translator.__('api.response.error.failure_message'),
                error: errorConstants.errorMessageMap.get(errorKey)
            }
        );
    };

    /**
     *  Function to create Final Server Response.
     *
     *  @param response
     *  @param status
     *  @param headers
     *  @param bodyObject
     *
     */
    var createEndServerResponse = function (response, status, headers, bodyObject) {
        // Creating the response message.
        response.writeHead(status, headers);
        response.write(JSON.stringify(bodyObject));
        response.end();
    };

    return {
        createApiErrorResponse,
        createEndServerResponse
    };
})();

module.exports = apiResponseService;