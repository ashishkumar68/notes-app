/**
 *  Main Router for routing the main requests to their corresponding controllers.
 *
 *  @Category Router
 *  @Author Ashish Kumar
 */
const userRouter = require('./UserRouter');
const errorConstants = require('../constants/ErrorConstants');
const apiResponseService = require('../middleware/ApiResponse');
const url = require('url');

let mainRouter = (function () {
    
    let availableModules = ['user', 'task'];
    let availableVersions = ['1.0'];

    /**
     *  Function to handle the main request and delegating to different module routes.
     *  
     *  @param request
     *  @param response
     */
    let handleRequest = function (request, response) {
        let handleResult = {
            'status' : false
        };
        
        try {
            // Parsing the url String.
            let parsedUrl = url.parse(request.url, true);
            // replacing the first and last / from path String
            let route = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

            // Checking if the request is coming for correct API route.
            if (!route.match(/^api\//)) {
                // returning the error response for resource not found.
                apiResponseService.
                    createApiErrorResponse(response, errorConstants.errorKeys.RES_NOT_FOUND, 404);
                return;
            }

            let apiModule = route.split('/')[2];
            let apiVersion = route.split('/')[1];

            if (
                    !apiVersion || !apiModule
                ||  !availableVersions.includes(apiVersion)
                ||  !availableModules.includes(apiModule.toLowerCase())
            ) {
                // returning the error response for resource not found.
                apiResponseService.
                    createApiErrorResponse(response, errorConstants.errorKeys.RES_NOT_FOUND, 404);
                return;
            }

            // Checking for what module the request is coming for
            // and calling the respective module route handler.
            // Checking if the module call is for user.
            if ('user' === apiModule.toLowerCase()) {
                userRouter.handleRequest(request, response, apiVersion, route);
            }

        } catch (error) {
        	// Logging this error to console.
        	console.log(arguments.callee.toString() + ' Failed due to Error '+ error.message);

            // returning the error response for INTERNAL SERVER ERROR.
            apiResponseService.
                createApiErrorResponse(response, errorConstants.errorKeys.INTERNAL_ERR, 500);
        }
    };

    return {
        handleRequest
    };
})();

module.exports = mainRouter;