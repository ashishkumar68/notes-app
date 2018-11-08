/**
 *  ProcessTaskRequest JS file for handling the processing functionality of Task Resource API requests.
 *
 *  @Category middleware
 *  @Author Ashish Kumar
 */
const errorConstants = require('../constants/ErrorConstants');
const generalConstants = require('../constants/GeneralConstants');
const userRepo = require('../repository/UserRepository');
const taskRepo = require('../repository/TaskRepository');

let ProcessTaskRequest = (function () {
    /**
     *  Function to process the Create new task request.
     *
     *  @param content
     *  @param username
     *  @param dbConnection
     *
     *  @return object
     */
    let processCreateTaskRequest = async function (content, username, dbConnection) {
        let processResult = {
            status: false
        };

        try {
            // Getting the user details.
            let userDetails = await userRepo.getUserDetails(dbConnection, username);
            let data = {
                'title': content.TaskRequest.title,
                'description': content.TaskRequest.description,
                'startDate': content.TaskRequest.startDate,
                'dueDate': content.TaskRequest.dueDate,
                'status': generalConstants.defaultTaskStatus,
                'priority': (undefined !== content.TaskRequest.priority
                    ? generalConstants.taskPriorityObj[content.TaskRequest.priority]
                    : generalConstants.taskPriorityObj[generalConstants.defaultTaskStatus]
                ),
                'userId': userDetails.id
            };

            // Creating the new task.
            let taskCreateResult = await taskRepo.createNewTask(data, dbConnection);

            // checking if the task creation was successful.
            if (undefined === taskCreateResult.taskId) {
                throw {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                };
            }

            processResult.message = {
                'response': {
                    'taskId': taskCreateResult.taskId,
                    'status': 'api.response.success.task_created'
                }
            };

            processResult.status = true;
        } catch (error) {
            console.log(arguments.callee.name + ' Function failed due to Error:' + JSON.stringify(error));

            validateResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw validateResult.error;
        }

        return processResult;
    };

    // Returning the properties to be exposed from module
    return {
        processCreateTaskRequest
    }
})();

// Exporting the module
module.exports = ProcessTaskRequest;