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
     */
    let getRequestContent = function (request) {
        return new Promise(function (resolve, reject) {
            // Pulling decoder.
            let decoder = new StringDecoder('utf-8');
            let content = '';
            let urlContent = '';

            // getting data from request and creating the content string.
            let parsedUrl = url.parse(request.url, true);

            let queryObject = parsedUrl.query;

            // checking if content is passed from URL
            if (queryObject && undefined !== queryObject.data) {
                // Base64 decoding the data.
                urlContent += (new Buffer(queryObject.data, 'Base64')).toString('utf-8');
            }

            // Adding handler for data and end event on request.
            request.on('data', function (data) {
                // Writing UTF-8 string to content.
                content += decoder.write(data);
            });

            request.on('end', function () {
                // Writing remaining UTF-8 string to content.
                content += decoder.end();

                // resolving promise with the content.
                resolve({
                    content: content,
                    urlContent: urlContent
                });
            });
        });
    };

    return {
        generateMd5Hash,
        getRequestContent
    }
})();

module.exports = Utils;