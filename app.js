const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(morgan('express'));

const apps = require('./playstore.js')

app.get('/apps', (req, res) => {
    //getting the query params: sort & genre
    const { sort, genre} = req.query; 

    //Sort isn't required but should be either 'rating' or 'app' => nothing else
    //Some validation is necessary 
    if(sort) {
        if(!['Rating', 'App'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of rating or app');
        }
    }

    //implement filter function on apps 
    let results = genre
        ? apps.filter(app => 
            app
                .Genres
                .includes(genre))
            : apps;
    
    //After the apps are filtered by the genre => we can sort:
    if(sort === 'App') {
        results.sort((a,b) => {
            let appA = a.App.toLowerCase();
            let appB = b.App.toLowerCase();
            return appA > appB ? 1
            : appA < appB ? -1 : 0; 
        });
    }

    if(sort === 'Rating') {
        results.sort((a,b) => {
            return b.Rating - a.Rating
        });
    }

    //This will now return only the selected app in postman
    //Postman search => http://localhost:8000/apps?genre=Arcade

    res
        .json(results);
})


module.exports = app; 