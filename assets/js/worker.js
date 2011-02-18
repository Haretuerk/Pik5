// Connection pool and slide number
var pool = []
  , slide = 0;


self.onconnect = function(event){
	// Add to the connection pool
	var port = event.ports[0];
	pool.push(port);
	// Send message back to all connections
	port.onmessage = function(msg){
		var data = msg.data
		  , poolsize = pool.length;
		for(var i = 0; i < poolsize; i++){
			if(pool[i] !== port){ // Dont message self
				pool[i].postMessage(data);
			}
		}
	};
};

