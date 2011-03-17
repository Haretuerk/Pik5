// Manages the presentation's state
var PIK5 = function(){

	var win = $(window);

	this.slides =   null;
	this.current =  0;
	this.hidden =   0;
	this.location = null;

	if(typeof SharedWorker == 'function'){
		var worker = new SharedWorker('assets/js/worker.js', 'PIK5');
		this.worker = worker.port;
	}
	else {
		this.worker = null;
	}

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
	}
	this.hide = function(){
		this.hidden = 1;
		win.trigger('hide');
	}
	this.show = function(){
		this.hidden = 0;
		win.trigger('show');
	}
	this.toggleHidden = function(){
		if(this.hidden == 0){
			this.hide();
		}
		else {
			this.show();
		}
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
