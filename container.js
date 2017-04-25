
module.exports = function(app){
	
require('./rest/doyokService')(app);
require('./rest/uberService')(app);

};
