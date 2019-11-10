const path = require("path");

module.exports = function (app) {

    app.get('/', (request, response) => {
        response.sendFile(path.join(__dirname, '../public/home.html')); // rout to homepage from root
    });

    app.get('/survey', (request, response) => {
        response.sendFile(path.join(__dirname, '../public/survey.html')); // rout to survey
    });

    

    /* app.get('*', (request, response) => {
        response.sendFile(path.join(__dirname, '../public/home.html')); // rout to homepage from everything else
    }); */
}