/**
 *  UserController JS file for hanlding the requests related to User Module.
 *
 *
 *  @Category Controller
 *  @Author Ashish Kumar
 */
const errorConstants = require('../../../constants/ErrorConstants');
const apiResponseService = require('../../../middleware/ApiResponse');

var userController = (function () {
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
    	

        apiResponseService.createEndServerResponse(response, 200, 
            {
                'Content-Type' : 'application/json'
            }, {'status': true}
        )
    };

    return {
        createAuthToken
    };
})();

module.exports = userController;