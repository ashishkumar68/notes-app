/**
 *  User Repository JS for interaction with DB.
 *
 *
 *  @Category Repository
 *  @Author Ashish Kumar
 */
const utils = require('../middleware/Utils');
const errorConstants = require('../constants/ErrorConstants');
const xss = require('xss');

let UserRepository = (function () {

    /**
     * Map of API attributes to Table columns.
     * @type {{firstName: string, lastName: string}}
     * @private
     */
    const __allowedChangeAttrApiDbMap = {
        'firstName': 'first_name',
        'lastName': 'last_name'
    };

    /**
     * Column array of users Table.
     * @type {Array}
     * @private
     */
    const _attrList = ['username', 'first_name', 'last_name', 'password'];

    /**
     *  Function to fetch the user record from DB.
     *
     *  @param dbConnection
     *  @param username
     *  @param password
     *
     *  @return object
     */
    let getUserDetails = function (dbConnection, username, password) {
    	// Returning the promise.
        return new Promise(function (resolve, reject) {
            let hash = utils.generateMd5Hash(password);
            let sql = 'SELECT id, username, first_name as firstName, last_name as lastName, created_at as createdAt ' +
                'FROM users WHERE username = '+ dbConnection.escape(username);

            // Checking if password is not empty only then adding it to SELECT STATEMENT
            if (password) {
            	sql += ' AND password = '+ dbConnection.escape(hash);
            }

            // Firing DB Query to fetch user details.
            dbConnection.query(sql, function (err, results, fields) {
                // checking if there was any error.
                if (err) {
                    // reject the promise with error.
                    reject({
                        'status': '500',
                        'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                    });

                    return;
                }

                // Otherwise resolving the promise with results.
                resolve(results[0]);
            });
        });
    };

    /**
     *  Function to update a user's password.
     *
     *  @param {number} userId
     *  @param {string} newPass
     *  @param {Object} connection
     *
     *  @return Promise
     */
    let updateUserPassword = function (userId, newPass, connection) {
        return new Promise(function (resolve, reject) {
            let sql = 'UPDATE users SET password = "'+ utils.generateMd5Hash(xss(newPass)) +
                '" WHERE id = ' + connection.escape(userId);

            // Firing DB Query to fetch user details.
            connection.query(sql, function (err, results, fields) {
                // checking if there was any error.
                if (err) {
                    // reject the promise with error.
                    reject({
                        'status': '500',
                        'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                    });

                    return;
                }

                // Otherwise resolving the promise with results.
                resolve({
                    'updatedRows': results.changedRows
                });
            });
        });
    };

    /**
     *  Function to update user profile details.
     *
     *  @param {Object} content
     *  @param {string} username
     *  @param {Object} connection
     *
     *  @return Promise
     */
    let updateUserProfile = function (content, username, connection) {
        return new Promise(function (resolve, reject) {
            let sql = 'UPDATE users SET ';

            let updateList = [];
            // Iterating over the Allowed Update Attributes and if the attribute
            // exists then adding it to be updated in SQL.
            for (let attr in __allowedChangeAttrApiDbMap) {
                if (undefined !== content[attr] && 'string' === typeof(content[attr])) {
                    updateList.push(__allowedChangeAttrApiDbMap[attr] + ' = "' + content[attr] + '"');
                }
            }

            // Creating the final SQL to be fired.
            sql += updateList.join(', ') + ' WHERE username = ' + connection.escape(username);

            // Firing DB Query to fetch user details.
            connection.query(sql, function (err, results, fields) {
                // checking if there was any error.
                if (err) {
                    // reject the promise with error.
                    reject({
                        'status': '500',
                        'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                    });

                    return;
                }

                // Otherwise resolving the promise with results.
                resolve({
                    'updatedRows': results.changedRows
                });
            });
        })
    };

    /**
     *  Function to Create a new User Profile.
     *
     *  @param {Object} userDetails
     *  @param {Object} connection
     *
     *  @return Promise
     */
    let createUserProfile = function (userDetails, connection) {
        return new Promise(function (resolve, reject) {
            let sql = 'INSERT INTO users('+ _attrList.join(',') +') VALUES ("'+
                Object.values(userDetails).join('","') + '")'
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

                    return;
                }

                // otherwise marking the promise as resolved.
                resolve({
                    'userId': results.insertId
                });
            });
        })
    };

    return {
        getUserDetails,
        updateUserPassword,
        updateUserProfile,
        createUserProfile
    }
})();


module.exports = UserRepository;
