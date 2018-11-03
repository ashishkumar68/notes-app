/**
 *  DB Connect middleware file for creating a DB connection and the operation related to DB connection.
 *
 *  @Category JS
 *  @Author Ashish Kumar
 */
const mysql = require('mysql');
const config = require('../config/config');

let DbConnect = (function () {
    let __connection = null;

    /**
     *  Function to create a new DB Connection.
     *
     */
    let getConnection = async function () {

        return new Promise(function (resolve, reject) {
            __connection = mysql.createConnection({
                host     : config.db.mysql.host,
                port     : config.db.mysql.port,
                user     : config.db.mysql.user,
                password : config.db.mysql.pass,
                database : config.db.mysql.name
            });

            // Making the Connection.
            __connection.connect(function (err) {
                // checking if there was any connection error.
                if (err) {
                    console.log('Failed to connect with Database.');
                    reject(err);
                    return;
                }

                resolve(__connection);
            });
        });
    };

    /**
     *  Function to terminate the DB Connection.
     *
     */
    let terminateConnection = function () {
        // Terminating the connection if it exists.
        if (__connection) {
            __connection.distroy();
        }
    };

    return {
        getConnection,
        terminateConnection
    }
})();

module.exports = DbConnect;
