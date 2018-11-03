/**
 *  Authenticate Authorize JS file for handling request Authentication and
 *  and authorization related functionality.
 *
 *  @Category middleware
 *  @Author Ashish Kumar
 */
const errorConstants = require('../constants/ErrorConstants');
const jwt = require('jsonwebtoken');

let AuthenticateAuthorize = (function () {
    
    /**
     *  Function to Create JWT Token for a user.
     *
     *  @param username
     *
     *  @return Promise
     */
    let createJWTToken = function (username) {
        let createResult = {
            status: false
        };

        try {
            // Creating issue time for Token.
            let issueTime = Math.floor(Date.now() / 1000);
            let payload = {
                'username': username,
                'iat': issueTime,
                // Should be available to be used after 2 sec
                'nbf': issueTime + 2,
                // Pulling expiry time from env, setting default 2 minutes expiry and adding it to issued Time
                'exp': issueTime + (undefined === process.env.TOKEN_EXPIRY ? process.env.TOKEN_EXPIRY : 2 * 60)
            };

            let options = {
                'algorithm': 'HS256'
            };

            // Convert Sign Key to base64 decoded format.
            let signKey = (new Buffer(process.env.SIGNATURE_KEY, 'Base64')).toString('utf-8');

            // Returning promise.
            return new Promise(function (resolve, reject) {
                // Signing payload Data Asynchronously with base64 decoded Secret Key.
                jwt.sign(payload, signKey, options,
                    function (err, token) {
                        // checking if error happens while creating JWT then rejecting promise.
                        if (err) {
                            console.log(JSON.stringify(err));
                            reject({
                                status: 500,
                                errorKey: errorConstants.errorKeys.INTERNAL_ERR
                            });
                        }

                        // otherwise creating success response.
                        createResult.message = {
                            response : {
                                'accessToken': token
                            }
                        };

                        createResult.status = true;
                        // and resolving promise with response.
                        resolve(createResult);
                    }
                )
            });

        } catch (error) {
        	console.log('Function ' + arguments.callee.name + ' Failed due to Error: ' +
        	    JSON.stringify(error));

        	throw {
        		status: 500,
        		errorKey: errorConstants.errorKey
        	}
        }
    };
     
    return {
    	createJWTToken
    }
})();


module.exports = AuthenticateAuthorize;