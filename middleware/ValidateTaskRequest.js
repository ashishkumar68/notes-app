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
                    'errorKey': errorConstants.errorKeys.INVALID_TITLE_LEN
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

    // Exposing the public functions.
    return {
        validateCreateTaskRequest
    }
})();

// Exporting the module.
module.exports = ValidateTaskRequest;