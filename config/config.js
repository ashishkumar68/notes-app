/**
 * This is the Application Configuration file which stores Configuration
 * for different Deployment environments.
 *
 * @Category JS
 * @Author Ashish Kumar
 */

// Defining different environment config for Application
const config = {
 staging: {
   port: 3000,
   envName: 'Staging'
 },
 prod: {
   port: 5000,
   envName: 'Production'
 }
};

// Exporting the config from Module.
module.exports = config;
