// Manages the presentation's state
var PIK5 = function(){

	var self         = this;
	var win          = $(window);
	this.slides      = null;
	this.current     = 0;
	this.hidden      = 0;
	this.location    = null;
	this.inPresenter = /presenter\.html(#([0-9]+))*$/.test(parent.location + '');

	// Setup worker
	if(typeof SharedWorker == 'function'){
		this.worker = new SharedWorker('assets/js/worker.js', 'Pik5');
	}
	else {
		this.worker = null;
	}

	// Wrapper for worker.postMessage that does nothing if no worker is available
	this.postMessage = function(data){
		if(this.worker !== null){
			this.worker.port.postMessage(data);
		}
	}

	// Main presentation control functions
	this.slideNext = function(){
		var newIndex = this.current + 1;
		if(this.slides[newIndex]){
			this.slideTo(newIndex);
		}
	}
	this.slideBack = function(){
		var newIndex = this.current - 1;
		if(this.slides[newIndex]){
			this.slideTo(newIndex);
		}
	}
	this.slideTo = function(index){
		this.current = index;
		win.trigger('slideTo', index);
		this.postMessage({ 'current': this.current });
	}
	this.hide = function(){
		this.hidden = 1;
		win.trigger('hide');
		this.postMessage({ 'hidden': this.hidden });
	}
	this.show = function(){
		this.hidden = 0;
		win.trigger('show');
		this.postMessage({ 'hidden': this.hidden });
	}
	this.setHidden = function(value){
		(value == 1) ? this.hide() : this.show();
	}
	this.toggleHidden = function(){
		if(this.hidden == 0){
			this.hide();
		}
		else {
			this.show();
		}
	}

	// Recieve events from the worker
	if(this.worker !== null){
		this.worker.port.addEventListener('message', function(evt){
			if(evt.data){
				// Slide number
				if(typeof evt.data.current != 'undefined'){
					if(evt.data.current !== self.current){
						self.slideTo(evt.data.current);
					}
				}
				// Hidden state
				if(typeof evt.data.hidden != 'undefined'){
					if(evt.data.hidden !== self.hidden){
						self.setHidden(evt.data.hidden);
					}
				}
				// Location
				if(typeof evt.data.location != 'undefined'){
					if(evt.data.location !== null && evt.data.location != self.location){
						location.href = evt.data.location;
					}
				}
			}
		});
		this.worker.port.start();
	}

}
var pik5 = new PIK5();


// Catch keypress events
jQuery(document).ready(function($){
	$(document).keydown(function(evt){
		var code = evt.keyCode;
		if(code == 39 || code == 34){
			pik5.slideNext();
		}
		else if(code == 37 || code == 33){
			pik5.slideBack();
		}
		else if(code == 116 || code == 190 || code == 27){
			pik5.toggleHidden();
			evt.preventDefault();
		}
	});
});
