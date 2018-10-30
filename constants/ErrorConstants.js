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
        INTERNAL_ERR: 'INTERNAL_ERR'
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
            ]
        ]
    );

    return {
        errorKeys,
    	errorMessageMap
    }
})();

module.exports = errorConstants;