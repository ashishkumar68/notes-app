/**
 *  ErrorConstants file for storing the Applications's Errors constants and error mappings.
 *
 *  @Category Constants
 *  @Author Ashish Kumar
 */
let errorConstants = (function () {
    const errorKeys = {
        RES_NOT_FOUND : 'RESNOTFOUND',
        OP_NOT_ALLOWED: 'OPNOTALLOWED',
        INTERNAL_ERR: 'INTERNAL_ERR',
        BAD_REQUEST: 'BADREQUEST',
        INVALID_CRED: 'INVALID_CRED'
    };

    let errorMessageMap = new Map([
            [
                errorKeys.RES_NOT_FOUND, 
                {
                    code: "404",
                    message: 'api.response.error.not_found'
                }
            ],
            [
                errorKeys.OP_NOT_ALLOWED, 
                {
                    code: "405",
                    message: 'api.response.error.operation_not_allowed'
                }
            ],
            [
                errorKeys.INTERNAL_ERR, 
                {
                    code: "500",
                    message: 'api.response.error.internal_err'
                }
            ],
            [
                errorKeys.BAD_REQUEST,
                {
                    code: "400",
                    message: "api.response.error.bad_request"
                }
            ],
            [
                errorKeys.INVALID_CRED,
                {
                    code: "1001",
                    message: "api.response.error.invalid_cred"
                }
            ]
        ]
    );

    return {
        errorKeys,
    	errorMessageMap
    }
})();

module.exports = errorConstants;