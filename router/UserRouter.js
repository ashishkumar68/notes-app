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
                    controllerFunc: userControllerV10.createAuthToken
                }
            },
            'user': {
                'POST' : {

                }
            }
        }
    };

    return {
        routeControllerMap
    };
})();

module.exports = UserRouter;