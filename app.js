
var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path');

var app = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// all environments
app.set('port', process.env.PORT || 2054);
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '/public')); 
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};

// serve index and view partials
app.get('/', routes.index);

// redirect all others to the index (HTML5 history)
//app.get('*', routes.index);

require('./container')(app);

var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

exports = module.exports = app;