jQuery(document).ready(function($){
"use strict";

var win     = $(window);
pik5.slides = null;

// Detect own location
pik5.isPresenter = (location.href.substr(-14) == 'presenter.html');
pik5.inPresenter = (!pik5.isPresenter && /presenter\.html$/.test(parent.location + ''));

// Initalize state 
pik5.state = {
	current  : 0,
	hidden   : false,
	location : (pik5.isPresenter) ? null : location.href
}

// Recieve state changes from the worker
var initOnMessage = function(){
	pik5.worker.port.onmessage = function(evt){
		var reply = evt.data
		// If the reply is null, send our own state
		if(reply === null){
			pik5.worker.port.postMessage(pik5.state);
		}
		// Else change our own state
		else {
			if(reply.current != pik5.state.current){
				var prev = pik5.state.current;
				pik5.state.current = reply.current;
				triggerChangeSlide(prev);
			}
			if(reply.hidden != pik5.state.hidden){
				pik5.state.hidden = reply.hidden;
				triggerChangeHidden();
			}
			if(reply.location != pik5.state.location){
				pik5.state.location = reply.location;
				triggerChangeLocation(reply.location);
			}
		}
	}
}

// Initalize worker
if(typeof SharedWorker == 'function' && !pik5.inPresenter){
	try {
		var worker_path = 'assets/js/worker.js';
		worker_path = (typeof pik5.base_dir != 'undefined') ? pik5.base_dir + worker_path : worker_path;
		pik5.worker = new SharedWorker(worker_path, 'Pik5');
		pik5.worker.port.postMessage(null); // Inital state request
		initOnMessage();
	}
	catch(e){
		pik5.worker = null;
	}
}
else {
	pik5.worker = null;
}

// Abstractions for general actions (changing slides, hiding the presentation)
pik5.goTo = function(index){
	var prev  = pik5.state.current;
	pik5.state.current = index;
	pik5.worker.port.postMessage(pik5.state);
	triggerChangeSlide(prev);
}
pik5.goNext = function(){
	var index = pik5.state.current + 1;
	if(pik5.slides && typeof pik5.slides[index] != 'undefined'){
		pik5.goTo(index);
	}
}
pik5.goPrev = function(){
	var index = pik5.state.current - 1;
	if(pik5.slides && typeof pik5.slides[index] != 'undefined'){
		pik5.goTo(index);
	}
}
pik5.toggleHidden = function(){
	pik5.state.hidden = (pik5.state.hidden) ? false : true;
	pik5.worker.port.postMessage(pik5.state);
	triggerChangeHidden();
}

// Trigger slideshow events
var triggerChangeSlide = function(prev){
	if(pik5.slides && typeof pik5.slides[pik5.state.current] != 'undefined'){
		$(pik5.slides[pik5.state.current]).trigger('activate');
	}
	if(pik5.slides && typeof pik5.slides[prev] != 'undefined'){
		$(pik5.slides[prev]).trigger('deactivate');
	}
	win.trigger('change', pik5.state.current);
}
var triggerChangeHidden = function(){
	if(pik5.state.hidden){
		win.trigger('hide');
	}
	else {
		win.trigger('show');
	}
}
var triggerChangeLocation = function(url){
	win.trigger('location', url);
}

// Catch keypress events
$(document).keydown(function(evt){
	var code = evt.keyCode;
	if(code == 39 || code == 34){
		pik5.goNext();
	}
	else if(code == 37 || code == 33){
		pik5.goPrev();
	}
	else if(code == 116 || code == 190 || code == 27){
		pik5.toggleHidden();
		evt.preventDefault();
	}
});


});
