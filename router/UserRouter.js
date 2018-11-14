/**
 *  User Router JS file for handling the User Module related requests.
 *
 *  @Category Router
 *  @Author Ashish Kumar
 */
const userControllerV10 = require('../controller/API/V10/UserController');

let UserRouter = (function () {

    const routeControllerMap = {
        '1.0': {
            'user/oauth': {
                'POST': {
                    controllerFunc: userControllerV10.createAuthToken,
                    isAuthenticated: false
                }
            },
            'user/profile': {
                'GET' : {
                    controllerFunc: userControllerV10.getUserDetails,
                    isAuthenticated: true
                }
            }
        }
    };

    return {
        routeControllerMap
    };
})();

module.exports = UserRouter;