/**
 *  ProcessUserRequest JS file for Processing User Module related request.
 *
 *  @Category Middleware
 *  @Author Ashish Kumar
 */
const dbConnect = require('./DbConnect');
const errorConstants = require('../constants/ErrorConstants');
const generalConstants = require('../constants/GeneralConstants');
const moment = require('moment');
const userRepo = require('../repository/UserRepository');

let ProcessUserRequest = (function () {
    
    /**
     *  Function to Process the GET user profile request.
     *
     *  @param {string} username
     *  @param {Object} dbConnection
     *
     *  @return {Object}
     */
    let processGetUserProfileRequest = async function (username, dbConnection) {
        let processResult = {
            status: false
        };

        try {
            // Fetching user details from DB.
            let user = await userRepo.getUserDetails(dbConnection, username);

            // Creating success processing response.
            processResult.message = {
                'response': {
                    'username': user.username,
                    'firstName': user.firstName,
                    'lastName': user.lastName,
                    'createdAt': moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss')
                }
            };

            processResult.status = true;
        } catch (error) {
            console.log(arguments.callee.name + ' Function failed due to Error:' + JSON.stringify(error));

            processResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw processResult.error;
        }

        return processResult;
    };

    /**
     *  Function to process Change password request.
     *
     *  @param {Object} content
     *  @param {Object} user
     *  @param {Object} connection
     *
     *  @return {Object}
     */
    let processChangePasswordRequest = async function (content, user, connection) {
        let processResult = {
            status: false
        };
        
        try {
            // changing user's password
            await userRepo.updateUserPassword(user.id, content.ProfileRequest.newPassword, connection);

            processResult.message = {
                'response': {
                    'status': 'api.response.success.change_pass'
                }
            }
            processResult.status = true;
        } catch (error) {
            console.log(arguments.callee.name + ' Function failed due to Error:' + JSON.stringify(error));

            processResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw processResult.error;
        }

        return processResult;
    };

    return {
        processGetUserProfileRequest,
        processChangePasswordRequest
    };
})();

// exporting the module.
module.exports = ProcessUserRequest;