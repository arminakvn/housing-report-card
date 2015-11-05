/*
	Copyright 2015, Google, Inc. 
 Licensed under the Apache License, Version 2.0 (the "License"); 
 you may not use this file except in compliance with the License. 
 You may obtain a copy of the License at 
  
    http://www.apache.org/licenses/LICENSE-2.0 
  
 Unless required by applicable law or agreed to in writing, software 
 distributed under the License is distributed on an "AS IS" BASIS, 
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 See the License for the specific language governing permissions and 
 limitations under the License.
*/
"use strict";

var carto = require('cartodb')
var express = require('express');
var path = require('path');
var http = require('http');
var path = require('path');
var async = require('async');
var serveStatic = require('serve-static')


var app = express();
var secret = {
  "USER" : "arminavn" ,
  "API_KEY" : "9150413ca8fb81229459d0a5c2947620e42d0940"
};

/* Include the app engine handlers to respond to start, stop, and health checks. */
app.use(require('./lib/appengine-handlers'));
// console.log(path.join("./bower_components", "shower-core" + '/shower.min.js'));

// [START hello_world]
/* Say hello! */
// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use( app.router );
// app.use( express.methodOverride() );
// app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(serveStatic('./', {'index': ['index.html', 'index.htm']}))
app.use(serveStatic('./bower_components/jquery/dist'))
app.use(serveStatic('./bower_components/semantic-ui/dist'))
app.use(serveStatic('./bower_components/semantic-ui/dist/components'))
app.use(serveStatic('./lib'))
app.use(serveStatic('./scripts'))

// app.set('view engine', 'ejs');

app.get('/distinctCity', function(req, res){

  var client = new carto(
  {
    user:secret.USER, 
    api_key:secret.API_KEY
  });

  var parse = function(err, data) {
    var parsed = [];
    data.rows.forEach(function(row){
      parsed.push(
      {
        "name" : row.city,
        "value" : row.city

      }
      );
      
  });




    res.send({
      "success": true,
      "results": parsed
    });
  };

  client.on('connect', function() {
    client
    .query("select distinct city from warrendata_copy", parse);
  });
    
  client.connect();  


})

app.get('/', function(req, res) {
  // res.status(200).send("Hello, world!");
  res.render('index', function(err, html) {
	  res.send(html);
	});
    // res.sendfile('./bower_components/shower-bright/index.html');
});
// [END hello_world]

// [START server]
/* Start the server */
var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  console.log("Press Ctrl+C to quit.");
  console.log("checking if adjustments work");
});
// [END server]
