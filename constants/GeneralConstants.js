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
    let taskStatus = {};

    Object.defineProperty(taskStatus, TASK_STATUS_NEW, {
        value: '0', writable: true, enumerable: true
    });

    Object.defineProperty(taskStatus, TASK_STATUS_PROGRESS, {
        value: '1', writable: true, enumerable: true
    });

    Object.defineProperty(taskStatus, TASK_STATUS_DONE, {
        value: '2', writable: true, enumerable: true
    });

    // Task priority Object Map.
    let taskPriority = {};

    Object.defineProperty(taskPriority, TASK_PRIORITY_LOW, {
        value: '0', writable: true, enumerable: true
    });

    Object.defineProperty(taskPriority, TASK_PRIORITY_NORMAL, {
        value: '1', writable: true, enumerable: true
    });

    Object.defineProperty(taskPriority, TASK_PRIORITY_HIGH, {
        value: '2', writable: true, enumerable: true
    });

    // Returning the General Constants from Constants.
    return {
        defaultEnvironment: defaultEnv,
        taskStatusObj: taskStatus,
        taskPriorityObj: taskPriority,
        defaultTaskStatus: DEFAULT_TASK_STATUS,
        defaultTaskPriority: DEFAULT_TASK_PRIORITY
    }
})();


// Exporting the Constants.
module.exports = Constants;
