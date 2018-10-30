/**
 *  DB Connect middleware file for creating a DB connection and the operation related to DB connection.
 *
 *  @Category JS
 *  @Author Ashish Kumar
 */
const mysql = require('mysql');
const config = require('../config/config');

var dbConnect = (function () {
    var __connection = null;

    /**
     *  Function to create a new DB Connection.
     *
     */
    var getConnection = function () {
    	dbConnect.__connection = mysql.createConnection({
            host     : config.db.mysql.host,
            port     : config.db.mysql.port,
            user     : config.db.mysql.user,
            password : config.db.mysql.pass,
            database : config.db.mysql.name
        });

        // Making the Connection.
        dbConnect.__connection.connect();

        // returning the Connection.
        return dbConnect.__connection;
    };

    /**
     *  Function to terminate the DB Connection.
     *
     */
    var terminateConnection = function () {
    	// Terminating the connection if it exists.
        if (dbConnect.__connection) {
        	dbConnect.__connection.distroy();
        }
    };

    return {
    	getConnection,
    	terminateConnection
    }
})();

module.exports = dbConnect;