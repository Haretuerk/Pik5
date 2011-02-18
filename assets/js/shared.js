/*
	shared.js
	Shared functionality for presentation and presenter
*/


// PIK5 global object
var _PIK5 = {};


// Create the worker for sharing information between presentation and presenter
if(typeof SharedWorker == 'function'){
	_PIK5.worker = new SharedWorker('assets/js/worker.js', '_PIK5');
	_PIK5.worker.onerror = function(err){
		if(typeof console != 'undefined'){
			console.log(err);
		}
	};
	_PIK5.port = _PIK5.worker.port;
	_PIK5.hasWorker = true;
}
else {
	_PIK5.hasWorker = false;
}


// Catch keypress events
jQuery(document).ready(function($){
	$(document).keydown(function(evt){
		var code = evt.keyCode;
		if(code == 39 || code == 34){
			$(this).trigger('slidenext');
		}
		else if(code == 37 || code == 33){
			$(this).trigger('slideback');
		}
		else if(code == 116 || code == 190 || code == 27){
			$(this).trigger('hide');
			evt.preventDefault();
		}
	});
});
