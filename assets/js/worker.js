// Connection pool, current slide and hidden state
var pool     = [],
    state    = null;

self.onconnect = function(evt){

	// Add to the connection pool
	var port = evt.ports[0];
	pool.push(port);

	// Recieve messages
	port.onmessage = function(msg){

		// Save new state
		if(msg.data !== null){
			state = msg.data;
		}

		// Broadcast state
		for(var i = 0; i < pool.length; i++){
			pool[i].postMessage(state);
		}

	}
};
