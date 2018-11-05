/**
 *  Utils JS for handling Application utility functionalities.
 *
 *  @Category middleware
 *  @Author Ashish Kumar
 */
const crypto = require('crypto');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

let Utils = (function () {

    /**
     *  Function to generate Md5 Hash of a provided string.
     *
     *  @param input
     *  @return string
     */
    let generateMd5Hash = function (input) {
        if (!input) {
            return '';
        }

        // Creating sha1 hash of input string and creating hex representation of hash.
        return crypto.createHash('md5').update(input).digest('hex');
    };

    /**
     *  Function to process request and Parse content.
     *
     *  @param request
     *
     *  @return Promise
     *  @TODO: Add request content processing and returning parsed content from Promise.
     */
    let getRequestContent = function (request) {

    };

    return {
        generateMd5Hash
    }
})();

module.exports = Utils;