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

    /**
     *  Function to Add filters for listing tasks.
     *
     *  @param filters
     *  @param connection
     *
     *  @return string
     */
    let addTaskListFilter = function (filters, connection) {
        let criteriaList = [];
        // iterate over the filters and add criteria to the Sql
        for (let attr in __apiDbAttributesMap) {
            if (undefined !== filters[attr] && null !== filters[attr] && 'priority' !== attr) {
                criteriaList.push(__apiDbAttributesMap[attr]+ ' LIKE ' + connection.escape('%' +filters[attr] +'%'));
            }
        }

        // setting the remaining fields manually
        if (undefined !== filters['id'] && null !== filters['id']) {
            criteriaList.push('id LIKE '+ connection.escape('%' + filters.id +'%'));
        }

        if (undefined !== filters['status'] && null !== filters['status']) {
            criteriaList.push('status = '+ connection.escape(generalConstants.taskStatusObj[filters['status']]));
        }

        if (undefined !== filters['priority'] && null !== filters['priority']) {
            criteriaList.push('priority = '+ connection.escape(generalConstants.taskPriorityObj[filters['priority']]));
        }

        if (undefined !== filters.createdDate && undefined !== filters.createdDate.from
            && undefined !== filters.createdDate.to
        ) {
            criteriaList.push('DATE(created_at) >= ' + connection.escape(filters.createdDate.from) + ' AND ' +
                'DATE(created_at) <=' + connection.escape(filters.createdDate.to)
            );
        }

        return criteriaList.join(' OR ');
    };

    /**
     *  Function to Fetch the list of tasks for user according
     *  to pagination parameters.
     *
     *  @param filters
     *  @param pagination
     *  @param username
     *  @param connection
     *
     *  @return Promise
     */
    let fetchTaskList = function (filters, pagination, username, connection) {
        return new Promise(function (resolve, reject) {
            let offset = (pagination.page - 1) * pagination.limit;
            let sql = 'SELECT t.id, t.title, t.description, t.start_date as startDate, t.due_date as dueDate, ' +
                't.status, t.priority, t.created_at as createdAt, t.last_updated_at as lastUpdatedAt FROM tasks t ' +
                'INNER JOIN users u ON t.user_id = u.id WHERE u.username = ' + connection.escape(username) +
                ' AND (' + addTaskListFilter(filters, connection) + ') ORDER BY t.created_at DESC LIMIT ' +
                offset  + ', '+ pagination.limit
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
                resolve(results);
            });
        });
    };

    /**
     *  Function to get the count OR the number of total task records
     *  according to the applied filters.
     *
     *  @param {Object} filters
     *  @param {string} username
     *  @param {Object} connection
     *
     *  @return Promise
     */
    let fetchTotalRecordsCount = function (filters, username, connection) {
        return new Promise(function (resolve, reject) {
            let sql = 'SELECT count(t.id) as total_tasks FROM tasks t ' +
                'INNER JOIN users u ON t.user_id = u.id  WHERE u.username = ' + connection.escape(username) +
                ' AND (' + addTaskListFilter(filters, connection) + ')'
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
                resolve(results[0].total_tasks);
            });
        });
    };

    /**
     *  Function to remove the task from Database.
     *
     *  @param {string} taskId
     *  @param {Object} connection
     *
     *  @return Promise
     */
    let removeTask = function (taskId, connection) {
        return new Promise(function (resolve, reject) {
            let sql = 'DELETE FROM tasks WHERE id = ' + connection.escape(taskId);

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
                    'affectedRows': results.affectedRows
                });
            });
        });
    };

    // returning the properties to be exposed.
    return {
        createNewTask,
        fetchTaskDetails,
        updateTask,
        updateTaskStatus,
        fetchTaskList,
        fetchTotalRecordsCount,
        removeTask
    };
})();

// exporting the Module.
module.exports = TaskRepository;