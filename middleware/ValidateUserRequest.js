/**
 *  Validate User Request JS File for providing user API request content 
 *  validation functionality.
 *
 *  @Category middleware
 *  @Author Ashish Kumar
 */
const errorConstants = require('../constants/ErrorConstants');
const userRepository = require('../repository/UserRepository');


let ValidateUserRequest = (function () {

    /**
     *  Async Function to validate OAuth API request.
     *
     *  @param content
     *  @param dbConnection
     *
     *  @return object
     *  @throws Error
     */
    let validateOAuthRequest = async function (content, dbConnection) {
        let validateResult = {
            status: false
        };

        try {
            // Check that all the required Keys should be present.
            if (
                   2 !== Object.keys(content).length 
                || !Object.keys(content).includes('username') 
                || !Object.keys(content).includes('password')
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            // Checking if the length of username and password is more than expected 
            // then returning invalid Cred.
            if (content.username.length > 100 || content.password.length > 100) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_CRED
                };
            }
         
            // Checking Fetching User details from DB.
            let user = await userRepository.getUserDetails(dbConnection,
                    content['username'], content['password']);

            // Checking if user exists or Not, if not then throw the error
            if (undefined === user) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.INVALID_CRED
                };
            }

            // returning success response in case of user availablity.
            validateResult.message = {
                'user': user
            }

            validateResult.status = true;
        } catch (error) {
            // Logging the Error.
            console.log('Function ' +arguments.callee.name+' failed '+
                'due to Error: '+ JSON.stringify(error));

            validateResult.error = error.hasOwnProperty('status') 
            ?   error
            :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw validateResult.error;
        }

        return validateResult;
    };


    /**
     *  Function to validate Change password request content.
     *
     *  @param {Object} content
     *  @param {string} username
     *  @param {Object} connection
     *
     *  @return {Object}
     */
    let validateChangePasswordRequest = async function (content, username, connection) {
        let validateResult = {
            status: false
        };
        
        try {
            if (
                    undefined === content || 'object' !== typeof(content)
                ||  undefined === content.ProfileRequest || 'object' !== typeof(content.ProfileRequest)
                ||  undefined === content.ProfileRequest.oldPassword
                || 'string' !== typeof(content.ProfileRequest.oldPassword)
                ||  undefined === content.ProfileRequest.newPassword
                || 'string' !== typeof(content.ProfileRequest.newPassword)
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            // Getting the ProfileRequest Object.
            let profileRequest = content.ProfileRequest;

            // Validating the length of old and new Passwords.
            if (profileRequest.oldPassword.length < 1 || profileRequest.oldPassword.length > 100) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_OLD_PASS_LEN
                };
            }

            if (profileRequest.newPassword.length < 1 || profileRequest.newPassword.length > 100) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_NEW_PASS_LEN
                };
            }

            // Validating the oldPassword with DB.
            let user = await userRepository.getUserDetails(connection, username, profileRequest.oldPassword);

            if (undefined === user) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.INVALID_OLD_PASS
                };
            }

            // Marking request validation success.
            validateResult.message = {
                'response': {
                    'user': user
                }
            };
            validateResult.status = true;
        } catch (error) {
            // Logging the Error.
            console.log('Function ' +arguments.callee.name+' failed '+
                'due to Error: '+ JSON.stringify(error));

            validateResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw validateResult.error;
        }

        return validateResult;
    };

    /**
     *  Function to validate Update user profile request content.
     *
     *  @param {Object} content
     *
     *  @return Object
     */
    let validateUpdateUserProfileRequest = function (content) {
        let validateResult = {
            status: false
        };

        try {
            // checking that all the required keys should be present.
            if (
                    undefined === content || 'object' !== typeof(content)
                ||  undefined === content.ProfileRequest || 'object' !== typeof(content.ProfileRequest)
                ||  ((undefined === content.ProfileRequest.firstName
                        || 'string' !== typeof(content.ProfileRequest.firstName))
                    &&  (undefined === content.ProfileRequest.lastName
                        || 'string' !== typeof(content.ProfileRequest.lastName)))
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            // checking that available inputs should be of valid syntax.
            let profileDetails = content.ProfileRequest;

            if (undefined !== profileDetails.firstName && 'string' === profileDetails.firstName
                && profileDetails.firstName.length > 100) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.INVALID_FIRST_NAME_LEN
                };
            }

            if (undefined !== profileDetails.lastName && 'string' === profileDetails.lastName
                && profileDetails.lastName.length > 100) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.INVALID_LAST_NAME_LEN
                };
            }

            validateResult.status = true;
        } catch (error) {
            // Logging the Error.
            console.log('Function ' +arguments.callee.name+' failed '+
                'due to Error: '+ JSON.stringify(error));

            validateResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw validateResult.error;
        }

        return validateResult;
    };

    /**
     *  Function to Validate Create new user request content.
     *
     *  @param {Object} content
     *  @param {Object} connection
     *
     *  @return {Object}
     */
    let validateCreateUserRequest = async function (content, connection) {
        let validateResult = {
            status: false
        };
        
        try {
            // Checking that all the required keys should be present.
            if (
                    undefined === content || 'object' !== typeof(content)
                ||  undefined === content.ProfileRequest || 'object' !== typeof(content.ProfileRequest)
                ||  undefined === content.ProfileRequest.username
                || 'string' !== typeof(content.ProfileRequest.username)
                ||  undefined === content.ProfileRequest.firstName
                || 'string' !== typeof(content.ProfileRequest.firstName)
                ||  undefined === content.ProfileRequest.lastName
                || 'string' !== typeof(content.ProfileRequest.lastName)
                || undefined === content.ProfileRequest.password
                || 'string' !== typeof(content.ProfileRequest.password)
            ) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.BAD_REQUEST
                };
            }

            // Pulling the ProfileDetails from content.
            let profileDetails = content.ProfileRequest;
            // Validating FirstName Syntax.
            if (profileDetails.firstName.length < 1 || profileDetails.firstName.length > 100) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_FIRST_NAME_LEN
                };
            }

            // Validating LastName syntax
            if (profileDetails.lastName.length < 1 || profileDetails.lastName.length > 100) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_LAST_NAME_LEN
                };
            }

            // Validating the password length
            if (profileDetails.password.length < 1 || profileDetails.password.length > 100) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_PASS_LEN
                };
            }

            // Validating the username.
            if (profileDetails.username.length < 1 || profileDetails.username.length > 100) {
                throw {
                    'status': 400,
                    'errorKey': errorConstants.errorKeys.INVALID_USERNAME_LEN
                };
            }

            // Validating username with DB.
            let user = await userRepository.getUserDetails(connection, profileDetails.username);

            if (undefined !== user) {
                throw {
                    'status': 422,
                    'errorKey': errorConstants.errorKeys.USERNAME_TAKEN
                };
            }

            validateResult.status = true;
        } catch (error) {
            // Logging the Error.
            console.log('Function ' +arguments.callee.name+' failed '+
                'due to Error: '+ JSON.stringify(error));

            validateResult.error = error.hasOwnProperty('status')
                ?   error
                :   {
                    'status': 500,
                    'errorKey': errorConstants.errorKeys.INTERNAL_ERR
                }
            ;

            throw validateResult.error;
        }

        return validateResult;
    };

    return {
        validateOAuthRequest,
        validateChangePasswordRequest,
        validateUpdateUserProfileRequest,
        validateCreateUserRequest
    }
})();


module.exports = ValidateUserRequest;
