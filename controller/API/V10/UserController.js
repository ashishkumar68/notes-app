/**
 *  UserController JS file for overriding Base functions for
 *  User APIs.
 *
 *  @Category Controller
 *  @Author Ashish Kumar
 */
const BaseUserController = require('../Base/UserController');

let UserControllerV10 = (function () {

    // Extending the Base User Controller.
    return {
        __proto__: BaseUserController
    };
})();

// exporting the module.
module.exports = UserControllerV10;