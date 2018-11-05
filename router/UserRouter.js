/**
 *  User Router JS file for handling the User Module related requests.
 *
 *  @Category Router
 *  @Author Ashish Kumar
 */
const userControllerV10 = require('../controller/API/V10/UserController');
const apiResponseService = require('../middleware/ApiResponse');
const errorConstants = require('../constants/ErrorConstants');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

let userRouter = (function () {

    const routeControllerMap = {
        '1.0': {
            'user/oauth': {
                allowedMethods: ['POST'],
                controllerFunc: userControllerV10.createAuthToken
            },
            'user': {
                allowedMethods: ['POST', 'PUT', 'GET']
            }
        }
    };

    /**
     *  Function to handle the requests for user API module.
     *
     *  @param request
     *  @param response
     *  @param apiVersion
     *  @param route
     *
     *  @return void
     */
    let handleRequest = function (request, response, apiVersion, route) {
        let routeArr = route.split('/');
        let baseRoute = routeArr.splice(0, 2);
        let mainRoute = routeArr.join('/');

        // checking if route is not present.
        if (undefined === routeControllerMap[apiVersion][mainRoute]) {
            return apiResponseService.
                createApiErrorResponse(errorConstants.errorKeys.RES_NOT_FOUND, 404)
            ;
        }

        // Checking if the method requested is allowed or not for the requested route.
        if (!routeControllerMap[apiVersion][mainRoute].allowedMethods.includes(request.method.toUpperCase())) {
            return apiResponseService.
                createApiErrorResponse(errorConstants.errorKeys.OP_NOT_ALLOWED, 405)
            ;
        }

        // getting data from request and creating the content string.
        let parsedUrl = url.parse(request.url, true);

        // Pulling decoder.
        let decoder = new StringDecoder('utf-8');
        let content = '';

        // Adding handler for data and end event on request.
        request.on('data', function (data) {
            // Writing UTF-8 string to content.
            content += decoder.write(data);
        });

        request.on('end', function () {
            // Writing remaining UTF-8 string to content.
            content += decoder.end();
            
            // Calling Controller function
            routeControllerMap[apiVersion][mainRoute].
                controllerFunc(request, response, parsedUrl.query, content);
        });
    };

    return {
        handleRequest
    };
})();

module.exports = userRouter;