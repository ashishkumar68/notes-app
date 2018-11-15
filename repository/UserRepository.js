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
                }

                // Otherwise resolving the promise with results.
                resolve({
                    'updatedRows': results.changedRows
                });
            });
        });
    };

    return {
        getUserDetails,
        updateUserPassword
    }
})();


module.exports = UserRepository;
