/**
 *  Main Router for routing the main requests to their corresponding controllers.
 *
 *  @Category Router
 *  @Author Ashish Kumar
 */
const userRouter = require('./UserRouter');
const taskRouter = require('./TaskRouter');
const errorConstants = require('../constants/ErrorConstants');
const apiResponseService = require('../middleware/ApiResponse');
const utilsService = require('../middleware/Utils');
const url = require('url');
const authService = require('../middleware/AuthenticateAuthorize');

let mainRouter = (function () {
    const USER_RESOURCE = 'user';
    const TASK_RESOURCE = 'task';

    let availableModules = [USER_RESOURCE, TASK_RESOURCE];
    let availableVersions = ['1.0'];

    /**
     *  Function to handle the requests for user API module.
     *
     *  @param request
     *  @param response
     *  @param apiVersion
     *  @param route
     *  @param routeMap
     *
     *  @return void
     */
    let delegateRequestToModule = function (request, response, apiVersion, route, routeMap) {
        let routeArr = route.split('/');
        let baseRoute = routeArr.splice(0, 2);
        let mainRoute = routeArr.join('/');
        let method = request.method.toUpperCase();

        // checking if route is not present.
        if (undefined === routeMap[apiVersion][mainRoute]) {
            return apiResponseService.
                createApiErrorResponse(response, errorConstants.errorKeys.RES_NOT_FOUND, 404)
            ;
        }

        // Checking if the method requested is allowed or not for the requested route.
        if (!routeMap[apiVersion][mainRoute].hasOwnProperty(method)) {
            return apiResponseService.
                createApiErrorResponse(response, errorConstants.errorKeys.OP_NOT_ALLOWED, 405)
            ;
        }

        let attrs = {};

        let parsedRequestContent = null;
        // check if the route is auth restricted.
        if (true === routeMap[apiVersion][mainRoute][method].isAuthenticated) {
            let authResult = authService.authenticateApiRequest(request);

            parsedRequestContent = authResult.then(function (authResult) {
                // adding user to request.
                request.attrs = {
                    'username': authResult.username
                };

                // Getting the parsed request content.
                return utilsService.getRequestContent(request);
            });

            authResult.catch(function (error) {
                apiResponseService.createApiErrorResponse(response, error.errorKey, 401);
            });
        } else {
            // Getting the request content.
            parsedRequestContent = utilsService.getRequestContent(request);
        }

        // Callback for success case.
        parsedRequestContent.then(function (data) {
            // Calling Controller function
            routeMap[apiVersion][mainRoute][method].
                controllerFunc(request, response, data.urlContent , data.content);
        })

        // Callback for error case.
        .catch(function (err) {
            return apiResponseService
                .createApiErrorResponse(response, errorConstants.errorKeys.INTERNAL_ERR, 500)
            ;
        });
    };

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

            // Checking route details.
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
            let routeMap = null;
            switch (apiModule.toLowerCase()) {
                case USER_RESOURCE:
                    routeMap = userRouter.routeControllerMap;
                    break;
                case TASK_RESOURCE:
                    routeMap = taskRouter.routeControllerMap;
                    break;
                default:
                    // returning the error response for resource not found.
                    apiResponseService.
                        createApiErrorResponse(response, errorConstants.errorKeys.RES_NOT_FOUND, 404);
                    return;
            }

            // Delegating the request to its module to be processed.
            delegateRequestToModule(request, response, apiVersion, route, routeMap);

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