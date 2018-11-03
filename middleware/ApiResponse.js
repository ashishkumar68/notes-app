/**
 *  ApiResponse JS file for creating final responses to be released from APIs.
 *
 *  @Category Middleware
 *  @Author Ashish Kumar
 */
const errorConstants = require('../constants/ErrorConstants');
const translator = require(__dirname + '/../config/translator');

let apiResponseService = (function () {
    
    /**
     *  Function to create Error Response to be returned from API.
     *
     *  @param response
     *  @param errorKey
     *  @param statusCode
     *  @param contentType
     */
    let createApiErrorResponse = function (response, errorKey, statusCode, contentType) {
    	contentType = undefined === contentType ? 'application/json' : contentType;

        // Creating Final Response Message.
        createEndServerResponse(response, statusCode, 
            {
                'Content-Type' : contentType
            },
            {
                reasonCode: '1',
                reasonText: 'api.response.error.failure_message',
                error: errorConstants.errorMessageMap.get(errorKey)
            }
        );
    };

    /**
     *  Function to create Success Response to be returned from API.
     *
     *  @param response
     *  @param responseKey
     *  @param responseObj
     *  @param statusCode
     *  @param contentType
     *
     *  @return void
     */
    let createApiSuccessResponse = function (response, responseKey, responseObj, statusCode, contentType) {
        contentType = undefined === contentType ? 'application/json' : contentType;

        let body = {
            reasonCode: '0',
            reasonText: 'api.response.error.success_message'
        };

        // Adding response Key Object to body.
        body[responseKey] = responseObj;
        // Creating Final Response Message.
        createEndServerResponse(response, statusCode,
            {
                'Content-Type' : contentType
            },
            body
        );
    };

    /**
     *  Function to create Final Server Response.
     *
     *  @param response
     *  @param status
     *  @param headers
     *  @param body
     *
     */
    let createEndServerResponse = function (response, status, headers, body) {
        // Creating the response message.
        response.writeHead(status, headers);
        response.write(JSON.stringify(body));
        response.end();
    };

    return {
        createApiErrorResponse,
        createApiSuccessResponse,
        createEndServerResponse
    };
})();

module.exports = apiResponseService;