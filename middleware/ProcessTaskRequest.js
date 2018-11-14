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
const _ = require('lodash');
const moment = require('moment');

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

            processResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw processResult.error;
        }

        return processResult;
    };

    /**
     *  Function to Process Update Task request content.
     *
     *  @param content
     *  @param dbConnection
     *
     *  @return Object
     */
    let processUpdateTaskRequest= async function (content, dbConnection) {
        let processResult = {
            status: false
        };

        try {
            // updating the task
            let updateResult = await taskRepo.updateTask(content.TaskRequest, dbConnection);

            // returning the success response in case of Success Update
            processResult.message = {
                'response': {
                    'status': 'api.response.success.task_updated'
                }
            };

            // marking processing result to success.
            processResult.status = true;
        } catch (error) {
            console.log(arguments.callee.name + ' Function failed due to Error:' + JSON.stringify(error));

            processResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw processResult.error;
        }

        return processResult;
    };

    /**
     *  Function to process Patch Update Task request.
     *
     *  @param content
     *  @param dbConnection
     *
     *  @return Object
     */
    let processPatchUpdateTaskRequest = async function (content, dbConnection) {
        let processResult = {
            status: false
        };

        try {
            // updating the task status
            let updateResult = await taskRepo.updateTaskStatus(content.TaskRequest.id,
                content.TaskRequest.status, dbConnection);

            // returning the success response in case of Success Update
            processResult.message = {
                'response': {
                    'status': 'api.response.success.task_updated'
                }
            };

            // marking processing result to success.
            processResult.status = true;
        } catch (error) {
            console.log(arguments.callee.name + ' Function failed due to Error:' + JSON.stringify(error));

            processResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw processResult.error;
        }

        return processResult;
    };

    /**
     *  Function to process GET task list request.
     *
     *  @param {Object} filters
     *  @param {Object} pagination
     *  @param {string} username
     *  @param {Object} dbConnection
     *
     *  @return Object
     */
    let processFetchTaskListRequest = async function (filters, pagination, username, dbConnection) {
        let processResult = {
            status: false
        };

        try {
            // pulling the task records database.
            let tasks = await taskRepo.fetchTaskList(filters, pagination, username, dbConnection);
            // pulling the total number of task records.
            let totalCount = await taskRepo.fetchTotalRecordsCount(filters, username, dbConnection);

            // iterating over tasks and updating the status and priority values.
            tasks.forEach(function (task, key) {
                tasks[key].startDate = moment(task.startDate).format('YYYY-MM-DD');
                tasks[key].dueDate = moment(task.dueDate).format('YYYY-MM-DD');
                tasks[key].status = _.invert(generalConstants.taskStatusObj)[task.status];
                tasks[key].priority = _.invert(generalConstants.taskPriorityObj)[task.priority];
                tasks[key].createdAt = moment(task.createdAt).format('YYYY-MM-DD HH:mm:ss');
                tasks[key].lastUpdatedAt = moment(task.lastUpdatedAt).format('YYYY-MM-DD HH:mm:ss');
            });

            processResult.message = {
                'response': {
                    'tasks': tasks,
                    'totalRecords': totalCount
                }
            };

            processResult.status = true;
        } catch (error) {
            console.log(arguments.callee.name + ' Function failed due to Error:' + JSON.stringify(error));

            processResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw processResult.error;
        }

        return processResult;
    };

    // Returning the properties to be exposed from module
    return {
        processCreateTaskRequest,
        processUpdateTaskRequest,
        processPatchUpdateTaskRequest,
        processFetchTaskListRequest
    }
})();

// Exporting the module
module.exports = ProcessTaskRequest;