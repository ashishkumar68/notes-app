/**
 *  TaskRepository JS file for Handling the DB related Operations for
 *  Task Resource.
 *
 *  @Category Repository
 *  @Author Ashish Kumar
 */
const errorConstants = require('../constants/ErrorConstants');
const generalConstants = require('../constants/GeneralConstants');
const xss = require('xss');

let TaskRepository = (function () {

    const __attributes = ['title', 'description', 'start_date', 'due_date', 'status', 'priority', 'user_id'];

    /**
     * Mapping of API fields to DB fields.
     * @type {{title: string, description: string}}
     *
     * @private
     */
    const __apiDbAttributesMap = {
        title: 'title',
        description: 'description',
        startDate: 'start_date',
        dueDate: 'due_date',
        priority: 'priority'
    };

    /**
     *  Function to Create a new Task.
     *
     *  @param data
     *  @param connection
     *
     *  @return Promise
     */
    let createNewTask = function (data, connection) {
        return new Promise(function (resolve, reject) {
            let sql = 'INSERT INTO tasks('+ __attributes.join(',') +') VALUES ("'+
                Object.values(data).join('","') + '")'
            ;

            // Firing the query to DB.
            connection.query(sql, function (error, results, fields) {
                // checking if there was an error.
                if (error) {
                    console.log(arguments.callee.name + ' Function failed due to Error: ' + JSON.stringify(error));
                    // reject the promise with error.
                    reject({
                        'status': '500',
                        'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                    });
                }

                // otherwise marking the promise as resolved.
                resolve({
                    'taskId': results.insertId
                });
            });
        });
    };

    /**
     *  Function to get Task details
     *
     *  @param taskId
     *  @param username
     *  @param connection
     *
     *  @return Promise
     */
    let fetchTaskDetails = function (taskId, username, connection) {
        return new Promise(function (resolve, reject) {
            let sql = 'SELECT t.id as task_id, t.title, t.description, t.start_date, t.due_date, t.status, t.priority, '
                + 't.created_at, t.last_updated_at '
                + 'FROM tasks t INNER JOIN users u ON t.user_id = u.id '
                + 'WHERE u.username = ' + connection.escape(username)
                + ' AND t.id = ' + connection.escape(taskId)
            ;

            // Firing the query to DB.
            connection.query(sql, function (error, results, fields) {
                // checking if there was an error.
                if (error) {
                    console.log(arguments.callee.name + ' Function failed due to Error: ' + JSON.stringify(error));
                    // reject the promise with error.
                    reject({
                        'status': '500',
                        'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                    });
                }

                // otherwise marking the promise as resolved.
                resolve(results[0]);
            });
        });
    };

    /**
     *  Function to Update a Task.
     *
     *  @param taskDetails
     *  @param connection
     *
     *  @return Promise
     */
    let updateTask = function (taskDetails, connection) {
        return new Promise(function (resolve, reject) {
            let sql = 'UPDATE tasks SET ';

            // Iterating over content keys and updating the query.
            let updates = [];
            for (let attr in __apiDbAttributesMap) {
                if (taskDetails.hasOwnProperty(attr) && null !== taskDetails[attr]) {
                    // Updating data for priority.
                    let data = 'priority' === attr ? generalConstants.taskPriorityObj[taskDetails[attr]]
                        : taskDetails[attr];

                    // Adding the update to the list.
                    updates.push(__apiDbAttributesMap[attr] + ' = "' + xss(data) + '"');
                }
            }

            sql += updates.join(',') + ' WHERE id = '+ connection.escape(taskDetails.id);

            // Firing the query to DB.
            connection.query(sql, function (error, results, fields) {

                // checking if there was an error.
                if (error) {
                    console.log(arguments.callee.name + ' Function failed due to Error: ' + JSON.stringify(error));
                    // reject the promise with error.
                    reject({
                        'status': '500',
                        'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                    });
                }

                // otherwise marking the promise as resolved.
                resolve({
                    'updatedRows': results.changedRows
                });
            });
        });
    };

    /**
     *  Function to Update a Task Status.
     *
     *  @param taskId
     *  @param status
     *  @param connection
     *
     *  @return Promise
     */
    let updateTaskStatus = function (taskId, status, connection) {
        return new Promise(function (resolve, reject) {
            let sql = 'UPDATE tasks SET status = "' + generalConstants.taskStatusObj[status.toUpperCase()]
                + '" WHERE id = '+ connection.escape(taskId)
            ;

            // Firing the query to DB.
            connection.query(sql, function (error, results, fields) {

                // checking if there was an error.
                if (error) {
                    console.log(arguments.callee.name + ' Function failed due to Error: ' + JSON.stringify(error));
                    // reject the promise with error.
                    reject({
                        'status': '500',
                        'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                    });
                }

                // otherwise marking the promise as resolved.
                resolve({
                    'updatedRows': results.changedRows
                });
            });
        });
    };

    // returning the properties to be exposed.
    return {
        createNewTask,
        fetchTaskDetails,
        updateTask,
        updateTaskStatus
    };
})();

// exporting the Module.
module.exports = TaskRepository;