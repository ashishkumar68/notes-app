/**
 *  General Constants File for storing the Application's General Constants.
 *  @Category JS
 *  @Author Ashish Kumar
 */

const Constants = (function () {
    // Default Application environment
    const defaultEnv = 'staging';

    // Task Status.
    const TASK_STATUS_NEW = 'NEW';
    const TASK_STATUS_PROGRESS = 'PROGRESS';
    const TASK_STATUS_DONE = 'DONE';
    // Default Task Status.
    const DEFAULT_TASK_STATUS = TASK_STATUS_NEW;

    // Task Priority Map.
    const TASK_PRIORITY_LOW = 'LOW';
    const TASK_PRIORITY_NORMAL = 'NORMAL';
    const TASK_PRIORITY_HIGH = 'HIGH';
    // Default task priority.
    const DEFAULT_TASK_PRIORITY = TASK_PRIORITY_NORMAL;

    // Task Status Object Map.
    let taskStatus = {
        TASK_STATUS_NEW: '0',
        TASK_STATUS_PROGRESS: '1',
        TASK_STATUS_DONE: '2'
    };

    // Task prioriry Object Map.
    let taskPriority = {
        TASK_PRIORITY_LOW: '0',
        TASK_PRIORITY_NORMAL: '1',
        TASK_PRIORITY_HIGH: '2'
    };

    // Returning the General Constants from Constants.
    return {
        defaultEnvironment: defaultEnv,
        taskStatusObj: taskStatus,
        taskPriorityObj: taskPriority
    }
})();


// Exporting the Constants.
module.exports = Constants;
