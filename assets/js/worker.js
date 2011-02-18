// Connection pool, slide number and hidden state
var _PIK5 = {
	pool: []
	, slidenum: 0
	, hidden: 0
}


self.onconnect = function(event){


	// Add to the connection pool
	var port = event.ports[0];
	_PIK5.pool.push(port);

	// Recieve messages
	port.onmessage = function(msg){

		// Update state
		var data = msg.data;
		if(data && typeof data.slidenum != 'undefined'){
			_PIK5.slidenum = data.slidenum;
		}
		if(data && typeof data.hidden != 'undefined'){
			_PIK5.hidden = data.hidden;
		}

		// Send changed state to all connections
		var poolsize = _PIK5.pool.length;
		for(var i = 0; i < poolsize; i++){
			_PIK5.pool[i].postMessage({
				'slidenum': _PIK5.slidenum
				, 'hidden': _PIK5.hidden
			});
		}

	};


};

