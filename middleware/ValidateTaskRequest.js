/**
 *  Validate Task Request JS file for providing Task resource related
 *  request content validation functionality.
 *
 *  @Category middleware
 *  @Author Ashish Kumar
 */
const errorConstants = require('../constants/ErrorConstants');
const utilsService = require('./Utils');
const moment = require('moment');
const generalConstants = require('../constants/GeneralConstants');
const taskRepo = require('../repository/TaskRepository');

let ValidateTaskRequest = (function () {
    /**
     *  Function to validate Create Task Request Content.
     *
     *  @param content
     *
     *  @return object
     *  @throws Error
     */
    let validateCreateTaskRequest = function (content) {
        let validateResult = {
            status: false
        };

        try {
            // Checking that all the required keys should be present.
            if (
                    undefined === content || 'object' !== typeof(content)
                ||  undefined === content.TaskRequest || 'object' !== typeof(content.TaskRequest)
                ||  undefined === content.TaskRequest.title || 'string' !== typeof(content.TaskRequest.title)
                ||  undefined === content.TaskRequest.description
                    || 'string' !== typeof(content.TaskRequest.description)
                ||  undefined === content.TaskRequest.startDate
                    || 'string' !== typeof(content.TaskRequest.startDate)
                ||  undefined === content.TaskRequest.dueDate || 'string' !== typeof(content.TaskRequest.dueDate)
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            // checking the length of title and description.
            let taskRequest = content.TaskRequest;
            if (0 === taskRequest.title.length || taskRequest.title.length > 200) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_TITLE_LEN
                }
            }

            if (0 === taskRequest.description.length || taskRequest.description.length > 1000) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_DESC_LEN
                }
            }

            let startDate = moment(taskRequest.startDate, 'YYYY-MM-DD', true);
            // Checking Start and End Date
            if (false === startDate.isValid()) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_START_DATE
                }
            }

            let dueDate = moment(taskRequest.dueDate, 'YYYY-MM-DD', true);
            if (false === dueDate.isValid()) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_DUE_DATE
                }
            }

            // Check if the start date should not be more than due date.
            if (dueDate.isBefore(startDate)) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.DUE_GREATER_THAN_START_DATE
                }
            }

            // Validating priority if set.
            if (undefined !== taskRequest.priority
                && !Object.keys(generalConstants.taskPriorityObj).includes(taskRequest.priority)
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_PRIORITY_VAL
                }
            }

            // Marking the validation as success.
            validateResult.status = true;
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

        return validateResult;
    };

    /**
     *  Function to validate Update Task Request's content.
     *
     *  @param content
     *  @param username
     *  @param dbConnection
     *
     *  @return Object
     */
    let validateUpdateTaskRequest = async function (content, username, dbConnection) {
        let validateResult = {
            status: false
        };

        try {
            // Validate that the required content should be present.
            if (
                    undefined === content || undefined === content.TaskRequest
                || 'object' !== typeof(content.TaskRequest)
                ||  undefined === content.TaskRequest.id || 'number' !== typeof(content.TaskRequest.id)
                ||  Object.keys(content.TaskRequest).length < 2
                ||  (undefined === content.TaskRequest.title && undefined === content.TaskRequest.description
                    && undefined === content.TaskRequest.startDate && undefined === content.TaskRequest.dueDate
                    && undefined === content.TaskRequest.priority)
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            let taskDetails = content.TaskRequest;
            // checking that the present keys should have valid format.
            // validating title if present.
            if (
                    undefined !== taskDetails.title
                &&  (null === taskDetails.title || 'string' !== typeof(taskDetails.title)
                    || 0 === taskDetails.title.length || taskDetails.title.length > 200)
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_TITLE_LEN
                }
            }

            // checking description if present.
            if (
                    undefined !== taskDetails.description
                &&  (null === taskDetails.description || 'string' !== typeof(taskDetails.description)
                    || 0 === taskDetails.description.length || taskDetails.description.length > 1000)
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_DESC_LEN
                }
            }

            let startDate = (undefined !== taskDetails.startDate) ? moment(taskDetails.startDate, 'YYYY-MM-DD', true)
                : undefined
            ;

            // Checking Start and Due Date if present
            if (undefined !== startDate && false === startDate.isValid()) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_START_DATE
                }
            }

            let dueDate = (undefined !== taskDetails.dueDate) ? moment(taskDetails.dueDate, 'YYYY-MM-DD', true)
                : undefined
            ;

            if (undefined !== dueDate && false === dueDate.isValid()) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_DUE_DATE
                }
            }

            // Check if the start date should not be more than due date.
            if (undefined !== startDate && undefined !== dueDate && dueDate.isBefore(startDate)) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.DUE_GREATER_THAN_START_DATE
                }
            }

            // Validating priority if set.
            if (undefined !== taskDetails.priority
                && !Object.keys(generalConstants.taskPriorityObj).includes(taskDetails.priority)
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_PRIORITY_VAL
                }
            }

            // Validating the taskId in request.
            let task = await taskRepo.fetchTaskDetails(taskDetails.id, username, dbConnection);

            if (undefined === task) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.INVALID_TASK_ID
                };
            }

            validateResult.message = {
                'response': task
            };

            validateResult.status = true;
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

        return validateResult;
    };

    /**
     *  Function to validate Patch Update Task Request's content.
     *
     *  @param content
     *  @param username
     *  @param dbConnection
     *
     *  @return Object
     */
    let validatePatchUpdateTaskRequest = async function (content, username, dbConnection) {
        let validateResult = {
            status: false
        };

        try {
            // Validate that the required content should be present.
            if (
                    undefined === content || undefined === content.TaskRequest
                || 'object' !== typeof(content.TaskRequest) ||  undefined === content.TaskRequest.id
                || 'number' !== typeof(content.TaskRequest.id) ||  2 !== Object.keys(content.TaskRequest).length
                ||  undefined === content.TaskRequest.status || 'string' !== typeof(content.TaskRequest.status)
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            // checking that status value is valid or not.
            let taskDetails = content.TaskRequest;

            if (undefined === generalConstants.taskStatusObj[taskDetails.status.toUpperCase()]) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.INVALID_TASK_STATUS
                };
            }

            // Validating the taskId in request.
            let task = await taskRepo.fetchTaskDetails(taskDetails.id, username, dbConnection);

            if (undefined === task) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.INVALID_TASK_ID
                };
            }

            validateResult.message = {
                'response': task
            };

            validateResult.status = true;
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

        return validateResult;
    };

    /**
     *  Function to Validate the Get task list request content and create filters list.
     *
     *  @param content
     */
    let validateFetchTaskListRequest = function (content) {
        let validateResult = {
            status: false
        };

        try {
            let filters = {};
            validateResult.message = {
                'response': {
                    'pagination': validatePaginationDetails(content.pagination)
                }
            };

            // checking that status value is valid or not.
            let taskFilters = (undefined !== content && undefined !== content.filter
                && 'object' === typeof(content.filter))
                ? content.filter
                : undefined
            ;

            // checking if there is no filter to be applied.
            if (undefined === taskFilters) {
                validateResult.message.response.filters = filters;
                validateResult.status = true;

                return validateResult;
            }

            // checking for the key values format, if correct, then adding to filters list.
            if (undefined !== taskFilters.id && Number.isInteger(taskFilters.id) && taskFilters.id > 0) {
                filters.id = taskFilters.id;
            }

            if (undefined !== taskFilters.title && 'string' === typeof(taskFilters.title)
                && taskFilters.title.length <= 200
            ) {
                filters.title = taskFilters.title;
            }

            if (undefined !== taskFilters.description && 'string' === typeof(taskFilters.description)
                && taskFilters.description.length <= 1000
            ) {
                filters.description = taskFilters.description;
            }

            if (undefined !== taskFilters.startDate && 'string' === typeof(taskFilters.startDate)
                && true === moment(taskFilters.startDate, 'YYYY-MM-DD', true).isValid()
            ) {
                filters.startDate = taskFilters.startDate;
            }

            if (undefined !== taskFilters.dueDate && 'string' === typeof(taskFilters.dueDate)
                && true === moment(taskFilters.dueDate, 'YYYY-MM-DD', true).isValid()
            ) {
                filters.dueDate = taskFilters.dueDate;
            }

            // checking created Date range if set.
            if (undefined === taskFilters.createdDate || 'object' !== taskFilters.createdDate) {
                validateResult.message.response.filters = filters;
                validateResult.status = true;

                return validateResult;
            }

            let createdDate = taskFilters.createdDate;

            if (undefined !== createdDate.from && 'string' === typeof(createdDate.from)
                && true === moment(createdDate.from, 'YYYY-MM-DD', true).isValid()
            ) {
                filters.createdDate = {
                    'from': createdDate.from
                };
            }

            if (undefined !== createdDate.to && 'string' === typeof(createdDate.to)
                && true === moment(createdDate.to, 'YYYY-MM-DD', true).isValid()
            ) {
                filters.createdDate = {
                    'to': createdDate.to
                };
            }

            if (undefined !== filters.createdDate) {
                if (filters.createdDate.from && !filters.createdDate.to) {
                    filters.createdDate.to = filters.createdDate.from;
                } else if (filters.createdDate.to && !filters.createdDate.from) {
                    filters.createdDate.from = filters.createdDate.to;
                }
            }

            validateResult.message.response.filters = filters;
            validateResult.status = true;
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

        return validateResult;
    };

    /**
     *  Function to validate Remove task request content.
     *
     *  @param {Object} content
     *  @param {string} username
     *  @param {Object} connection
     *
     *  @return {Object}
     */
    let validateRemoveTaskRequest = async function (content, username, connection) {
        let validateResult = {
            status: false
        };

        try {
            // validating that all the required keys should be present.
            if (    undefined === content || 'object' !== typeof(content)
                ||  undefined === content.TaskRequest || 'object' !== typeof(content.TaskRequest)
                ||  undefined === content.TaskRequest.id || false === Number.isInteger(content.TaskRequest.id)
                ||  content.TaskRequest.id < 1
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            // validating the Task Id with Database.
            let taskDetails = content.TaskRequest;
            let task = await taskRepo.fetchTaskDetails(taskDetails.id, username, connection);

            if (undefined === task) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.INVALID_TASK_ID
                };
            }

            validateResult.status = true;
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

        return validateResult;
    };

    /**
     *  Function to validate the pagination object for APIs.
     *
     *  @param pagination
     *
     *  @return Object
     */
    let validatePaginationDetails = function (pagination) {
        let pageObject = {
            page: 1,
            limit: 10
        };

        // checking if pagination value was set or not.
        if (undefined === pagination || 'object' !== typeof(pagination)) {
            return pageObject;
        }

        // updating the page value if its valid.
        if (undefined !== pagination.page && Number.isInteger(pagination.page) && pagination.page > 0) {
            pageObject.page = Math.floor(pagination.page);
        }

        // updating the limit value if valid.
        if (undefined !== pagination.limit && Number.isInteger(pagination.limit) && pagination.limit > 0) {
            pageObject.limit = Math.floor(pagination.limit);
        }

        return pageObject;
    };

    // Exposing the public functions.
    return {
        validateCreateTaskRequest,
        validateUpdateTaskRequest,
        validatePatchUpdateTaskRequest,
        validateFetchTaskListRequest,
        validateRemoveTaskRequest
    }
})();

// Exporting the module.
module.exports = ValidateTaskRequest;