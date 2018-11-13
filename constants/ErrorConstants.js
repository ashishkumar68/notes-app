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
        INTERNAL_ERR: 'INTERNALERR',
        BAD_REQUEST: 'BADREQUEST',
        INVALID_CRED: 'INVALIDCRED',
        INVALID_TOKEN: 'INVALIDTOKEN',
        INVALID_TITLE_LEN: 'INVALIDTITLELEN',
        INVALID_DESC_LEN: 'INVALIDDESCLEN',
        INVALID_START_DATE: 'INVALIDSTARTDATE',
        INVALID_DUE_DATE: 'INVALIDDUEDATE',
        DUE_GREATER_THAN_START_DATE: 'DUEGREATERSTARTDATE',
        INVALID_TASK_ID: 'INVALIDTASKID',
        INVALID_PRIORITY_VAL: 'INVALIDPRIORITYVAL',
        INVALID_TASK_STATUS: 'INVALIDTASKSTATUS'
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
            ],
            [
                errorKeys.INVALID_TOKEN,
                {
                    code: "1002",
                    message: "api.response.error.invalid_token"
                }
            ],
            [
                errorKeys.INVALID_TITLE_LEN,
                {
                    code: "1003",
                    message: "api.response.error.invalid_title_len"
                }
            ],
            [
                errorKeys.INVALID_DESC_LEN,
                {
                    code: "1004",
                    message: "api.response.error.invalid_desc_len"
                }
            ],
            [
                errorKeys.INVALID_START_DATE,
                {
                    code: "1005",
                    message: "api.response.error.invalid_start_date"
                }
            ],
            [
                errorKeys.INVALID_DUE_DATE,
                {
                    code: "1006",
                    message: "api.response.error.invalid_due_date"
                }
            ],
            [
                errorKeys.DUE_GREATER_THAN_START_DATE,
                {
                    code: "1007",
                    message: "api.response.error.due_greater_start_date"
                }
            ],
            [
                errorKeys.INVALID_TASK_ID,
                {
                    code: "1008",
                    message: "api.response.error.invalid_task_id"
                }
            ],
            [
                errorKeys.INVALID_PRIORITY_VAL,
                {
                    code: "1009",
                    message: "api.response.error.invalid_priority_val"
                }
            ],
            [
                errorKeys.INVALID_TASK_STATUS,
                {
                    code: "1010",
                    message: "api.response.error.invalid_task_status"
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