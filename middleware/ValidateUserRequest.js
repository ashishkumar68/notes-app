/**
 *  Validate User Request JS File for providing user API request content 
 *  validation functionality.
 *
 *  @Category middleware
 *  @Author Ashish Kumar
 */
const errorConstants = require('../constants/ErrorConstants');
const userRepository = require('../repository/UserRepository');


var ValidateUserRequest = (function () {

    /**
     *  Async Function to validate OAuth API request.
     *
     *  @param content
     *  @param dbConnection
     *
     *  @return object
     *  @throws Error
     */
    var validateOAuthRequest = async function (content, dbConnection) {
        var validateResult = {
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
            var user = await userRepository.getUserDetails(dbConnection, 
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


    return {
        validateOAuthRequest
    }
})();


module.exports = ValidateUserRequest;
