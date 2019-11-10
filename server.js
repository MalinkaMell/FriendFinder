//Your server.js file should require the basic npm packages we've used in class: express and path.
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const friends = require('./app/data/friends');
const htmlRoutes = require('./app/routing/htmlRoutes')(app);
//const apiRoutes = require('./app/routing/apiRoutes')(app);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('app/public'));

//move this to htmlRoutes.js after refactoring


//move this to apiRoutes.js after refactoring
app.get('/api/friends', (request, response) => {
    return response.json(friends);
});

app.post('/api/friends', (request, response) => {
    const friend = request.body;
    friends.push(friend);
    response.json(friend);
});

app.listen(PORT, function () {
    console.log(`Listening on http://localhost:${PORT}`);
})