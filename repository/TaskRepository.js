/**
 *  TaskRepository JS file for Handling the DB related Operations for
 *  Task Resource.
 *
 *  @Category Repository
 *  @Author Ashish Kumar
 */
const errorConstants = require('../constants/ErrorConstants');

let TaskRepository = (function () {

    const __attributes = ['title', 'description', 'start_date', 'due_date', 'status', 'priority', 'user_id'];

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

    // returning the properties to be exposed.
    return {
        createNewTask,
        fetchTaskDetails
    };
})();

// exporting the Module.
module.exports = TaskRepository;