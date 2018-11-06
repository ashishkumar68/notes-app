/**
 *  TaskController JS file for overriding Base functions for
 *  User APIs.
 *
 *  @Category Controller
 *  @Author Ashish Kumar
 */
const BaseTaskController = require('../Base/TaskController');

let TaskController = (function () {

    // Extending the Base User Controller.
    return {
        __proto__: BaseTaskController
    };
})();

// exporting the module.
module.exports = TaskController;