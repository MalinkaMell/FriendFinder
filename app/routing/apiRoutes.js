/* Your apiRoutes.js file should contain two routes:

A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
A POST routes /api/friends. This will be used to handle incoming survey results. 
This route will also be used to handle the compatibility logic. */

const friends = require('../data/friends');

module.exports = function (app) {
    
//move this to apiRoutes.js after refactoring
app.get('/api/friends', (request, response) => {
    return response.json(friends);
});

app.get('/api/friends/:id', (request, response) => {
    let memberId = request.params.id;
    friends.forEach(element => {
        console.log(element.id);
        if (element.id === memberId) {
            response.send(element);
        }
    });
});  

app.post('/api/friends', (request, response) => {
    const friend = request.body;
    console.log(`POST /api/friends called`);
    console.log(friend);
    friends.push(friend);
    response.json(friend);
});
}