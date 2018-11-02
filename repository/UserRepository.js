/**
 *  User Repository JS for interaction with DB.
 *
 *
 *  @Category Repository
 *  @Author Ashish Kumar
 */
const utils = require('../middleware/Utils');
const errorConstants = require('../constants/ErrorConstants');

var UserRepository = (function () {
    
    /**
     *  Function to fetch the user record from DB.
     *
     *  @param dbConnection
     *  @param username
     *  @param password
     *
     *  @return object
     */
    var getUserDetails = function (dbConnection, username, password) {
    	// Returning the promise.
        return new Promise(function (resolve, reject) {
            var hash = utils.generateMd5Hash(password);
            var sql = 'SELECT username, first_name, last_name, created_at FROM users WHERE username = '+
                dbConnection.escape(username);

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

    return {
        getUserDetails
    }
})();


module.exports = UserRepository;
