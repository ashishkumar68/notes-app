/**
 * This is the Application Configuration file which stores Configuration
 * for different Deployment environments.
 *
 * @Category JS
 * @Author Ashish Kumar
 */

// Pulling dotenv module.
const dotenv = require('dotenv');

// Loading dotenv module.
dotenv.load();

// Defining different environment config for Application
let config = {
    staging: {
        port: 3000,
        envName: 'Staging'
    },
    prod: {
        port: 5000,
        envName: 'Production'
    },
    db: {
        mysql : {
            port: process.env.DB_PORT,
            host: process.env.DB_HOST,
            name: process.env.DB_NAME,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS
        }
    }
};

// Exporting the config from Module.
module.exports = config;
