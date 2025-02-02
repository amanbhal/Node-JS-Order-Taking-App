// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    //mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io
    mongoose.connect('mongodb://localhost/meanstacktutorials');
    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    
    // define model =================
    
    var Food = mongoose.model('Food', {
        text : String,
        price: Number
    });
    
    // routes ======================================================================

    // api ------------
    app.get('/api/totals', function(req, res) {
      Food.find(function(err, foods) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err){
              res.send(err);
            }
            var totalPrice = 0.0;
            for(var i=0; i<foods.length; i++){
              totalPrice += foods[i].price;
            }
            var returnObj = {total:totalPrice};
            res.send(returnObj); 
        });
    });
    
    app.get('/api/foods', function(req, res) {

        Food.find(function(err, foods) {

            if (err){
              res.send(err);
            }

            res.json(foods);
        });
    });

    app.post('/api/foods', function(req, res) {

        Food.create({
            text : req.body.text,
            price : req.body.value,
            done : false
        }, function(err, food) {
            if (err){
              res.send(err);
            }

            Food.find(function(err, foods) {
                if (err){
                    res.send(err);
                }
                res.json(foods);
            });
        });

    });

    app.delete('/api/foods/:food_id', function(req, res) {
        Food.remove({
            _id : req.params.food_id
        }, function(err, food) {
            if (err){
                res.send(err);
            }

            Food.find(function(err, foods) {
                if (err){
                    res.send(err);
                }
                res.json(foods);
            });
        });
    });
    
    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    
    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");