/**
 *  i18n JS file for configuring i18n and exporting this module to application.
 *
 *  @Category Config
 *  @Author Ashish Kumar
 */
const translator = require('i18n');

// Configuring i18n translation.
translator.configure({
    locales: ['en'],
    defaultLocale: 'en',
    queryParemeter: 'lang',
    directory: __dirname + '/../translations',
    api: {
        '__' : 'translate'
    }
});

module.exports = translator;