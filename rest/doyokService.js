

module.exports = function(app){

	app.get('/api/watson/:message',function(req,res){	
		var message = req.params.message;
		var result = {};
		var ConversationV1 = require('watson-developer-cloud/conversation/v1');
		var conversation = new ConversationV1({
	      username: '9702c62f-5b7a-48f6-af05-605033093572', // replace with username from service key
	      password: '3HFCUlVJh6Eh', // replace with password from service key
	      path: { workspace_id: 'a2ceb630-35c2-4859-be81-880c79a7cd7c' }, // replace with workspace ID
	      version_date: '2016-07-11'
	    });
	    conversation.message({}, processResponse);
	    function processResponse(err, response) {
	      if (err) {
	        return;
	      }
	      
	      // If an intent was detected, log it out to the console.
	      if (response.intents.length > 0) {
	        if(response.intents[0].intent == "AskHospitalLocation"){
	          if(response.entities[0].entity == "Disease"){
	            var disease_name = response.entities[0].value;
	            result["result"] = disease_name;
		        res.setHeader('Content-Type', 'application/json');
	    		res.send(result);
	          }
	        }
	        return;
	      }

	      var newMessageFromUser = message;
	      conversation.message({
	        input: { text: newMessageFromUser },
	        context : response.context,
	      }, processResponse);
	    }
    });


};