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
     *  Function to verify the Request Header.
     *
     *  @param request
     *
     *  @return Promise
     */
    let authenticateApiRequest = function (request) {
        return new Promise(function (resolve, reject) {
            // checking if the token is present in request or not.
            if (undefined === request.headers.authorization || 'string' !== typeof(request.headers.authorization)) {
                reject({
                    status: 401,
                    errorKey: errorConstants.errorKeys.INVALID_TOKEN
                });
            }

            // Convert Sign Key to base64 decoded format.
            let signKey = (new Buffer(process.env.SIGNATURE_KEY, 'Base64')).toString('utf-8');
            // verifing the token.
            jwt.verify(request.headers.authorization, signKey , function(err, decoded) {
                // check if the token was invalid, then rejecting it.
                if (err) {
                    reject({
                        status: 401,
                        errorKey: errorConstants.errorKeys.INVALID_TOKEN
                    });
                }

                // otherwise marking it as resolved.
                resolve(decoded);
            });
        });
    };

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
                'exp': issueTime + (undefined !== process.env.TOKEN_EXPIRY
                    ? Number(process.env.TOKEN_EXPIRY)
                    : 60 * 60)
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
                            console.log(arguments.callee.name + ' Failed due to Error:' + JSON.stringify(err));
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
    	createJWTToken,
        authenticateApiRequest
    }
})();


module.exports = AuthenticateAuthorize;