module.exports = function (socket) {
  socket.on('send:chat', function (data) {
      // Example 3: maintains state.
    //var ConversationV1 = require('watson-developer-cloud/conversation/v1');

    // Set up Conversation service.
    /*var conversation = new ConversationV1({
      username: '9702c62f-5b7a-48f6-af05-605033093572', // replace with username from service key
      password: '3HFCUlVJh6Eh', // replace with password from service key
      path: { workspace_id: 'a2ceb630-35c2-4859-be81-880c79a7cd7c' }, // replace with workspace ID
      version_date: '2016-07-11'
    });*/

    // Start conversation with empty message.
    //conversation.message({}, processResponse);
    console.log(data.text);
    socket.broadcast.emit('send:a', {
              text: "kanker"
            });

    // Process the conversation response.
    /*function processResponse(err, response) {
      if (err) {
        console.log(JSON.stringify(err)); // something went wrong
        return;
      }

      
      // If an intent was detected, log it out to the console.
      if (response.intents.length > 0) {
        console.log(JSON.stringify(response));
        console.log('Detected intent: #' + response.intents[0].intent);
        if(response.intents[0].intent == "AskHospitalLocation"){
          if(response.entities[0].entity == "Disease"){
            var disease_name = response.entities[0].value;
            socket.broadcast.emit('send:toVisitor', {
              text: disease_name
            });
          }
        }
        return;
      }
      
      // Display the output from dialog, if any.
      if (response.output.text.length != 0) {
          console.log(response.output.text[0]);
      }

      var newMessageFromUser = data.text;
      conversation.message({
        input: { text: newMessageFromUser },
        context : response.context,
      }, processResponse);
    }*/
    
  });

};
