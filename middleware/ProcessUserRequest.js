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
const utilsService = require('./Utils');

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

    /**
     *  Function to process Update User Profile request.
     *
     *  @param {Object} content
     *  @param {string} username
     *  @param {Object} connection
     *
     *  @return {Object}
     */
    let processUpdateUserProfileRequest = async function (content, username, connection) {
        let processResult = {
            status: false
        };

        try {
            // Updating the User Profile.
            await userRepo.updateUserProfile(content.ProfileRequest, username, connection);

            // Creating the Successful processing response.
            processResult.message = {
                'response': {
                    'status': 'api.response.success.user_profile_update'
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

    /**
     *  Function to process Create User Profile request.
     *
     *  @param {Object} content
     *  @param {Object} connection
     *
     *  @return {Object}
     */
    let processCreateUserProfileRequest = async function (content, connection) {
        let processResult = {
            status: false
        };

        try {
            // Creating the input
            let userDetails = {
                'username': content.ProfileRequest.username,
                'first_name': content.ProfileRequest.firstName,
                'last_name': content.ProfileRequest.lastName,
                'password': utilsService.generateMd5Hash(content.ProfileRequest.password)
            };

            // Updating the User Profile.
            await userRepo.createUserProfile(userDetails, connection);

            // Creating the Successful processing response.
            processResult.message = {
                'response': {
                    'status': 'api.response.success.user_profile_create'
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
        processChangePasswordRequest,
        processUpdateUserProfileRequest,
        processCreateUserProfileRequest
    };
})();

// exporting the module.
module.exports = ProcessUserRequest;