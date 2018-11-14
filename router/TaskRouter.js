/**
 *  Task Router JS file for handling the Task Module related requests.
 *
 *  @Category Router
 *  @Author Ashish Kumar
 */
const taskControllerV10 = require('../controller/API/V10/TaskController');

let TaskRouter = (function () {

    const routeControllerMap = {
        '1.0': {
            'task': {
                'POST': {
                    controllerFunc: taskControllerV10.createTask,
                    isAuthenticated: true
                },
                'PUT': {
                    controllerFunc: taskControllerV10.updateTask,
                    isAuthenticated: true
                },
                'PATCH': {
                    controllerFunc: taskControllerV10.patchUpdateTask,
                    isAuthenticated: true
                },
                'DELETE': {
                    controllerFunc: taskControllerV10.removeTask,
                    isAuthenticated: true
                }
            },
            'task/list': {
                'GET': {
                    controllerFunc: taskControllerV10.getTasksList,
                    isAuthenticated: true
                }
            }
        }
    };

    return {
        routeControllerMap
    };
})();

module.exports = TaskRouter;