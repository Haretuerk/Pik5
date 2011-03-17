// Connection pool, current slide and hidden state
var pool     = [],
    current  = 0,
    hidden   = 0,
    location = null;

self.onconnect = function(evt){

	// Add to the connection pool
	var port = evt.ports[0];
	pool.push(port);

	// Recieve messages
	port.onmessage = function(msg){

		// Update state
		if(msg.data){
			if(typeof msg.data.current != 'undefined'){
				current = msg.data.current;
			}
			if(typeof msg.data.hidden != 'undefined'){
				hidden = msg.data.hidden;
			}
			if(typeof msg.data.location != 'undefined'){
				location = msg.data.location;
			}
		}

		// Send changed state to all connections
		for(var i = 0; i < pool.length; i++){
			pool[i].postMessage({
				'current' : current,
				'hidden'  : hidden,
				'location': location
			});
		}

	};

};
