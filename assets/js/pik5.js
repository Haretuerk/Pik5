// Global vars and functions
_PIK5.slides, _PIK5.current = 0, _PIK5.hidden = 0, _PIK5.slideTo, _PIK5.slideNext, _PIK5.slideBack, _PIK5.setHidden, _PIK5.toggleHidden;


jQuery(document).ready(function($){


var frame = $('#frame')
  , framecontainer = $('#framecontainer')
  , inPresenter = /presenter\.html(#([0-9]+))*$/.test(parent.location + '');


// Add "End of presentation" slide
framecontainer.append('<div id="end" class="slide"><p>End of presentation.</p></div>');


// All slides, including "End of presentation"
_PIK5.slides = $('.slide');


// Setup font
var frameratio = (frame.height() + frame.width()) / 1000;
$('body').css('font-size', frameratio + 'em');


// Setup frame and slides
frame.css('overflow', 'hidden');
framecontainer.css('width', 100 * _PIK5.slides.length + '%');
var slidesize = framecontainer.width() / _PIK5.slides.length;
_PIK5.slides.css('width', slidesize + 'px');


// The overlay element used to hide the presentation
var overlay = $('<div></div>').hide().css({
	position: 'absolute',
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	'z-index': 1337,
	background:'#000'
}).appendTo(frame);


// Make the overlay only semi opaque for the presenter view
if(inPresenter){
	overlay.css({
		background: 'rgba(0, 0, 0, 0.75)'
	});
}


// Hide the presentation
_PIK5.setHidden = function(state, propagate){
	// Hide
	if(state === 1){
		_PIK5.hidden = 1;
		overlay.hide();
	}
	// Show
	else if(state === 0){
		_PIK5.hidden = 0;
		overlay.show();
	}
	// Update worker
	if(_PIK5.hasWorker && propagate){
		_PIK5.port.postMessage({
			hidden: _PIK5.hidden
		});
	}
};

// Toggle the hidden state
_PIK5.toggleHidden = function(){
	if(_PIK5.hidden === 1){
		_PIK5.setHidden(0, true);
	}
	else if(_PIK5.hidden === 0){
		_PIK5.setHidden(1, true);
	}
};


// Slide to the slide index
_PIK5.slideTo = function(index, propagate){
	index = parseInt(index);
	if(_PIK5.slides[index]){
		if(!inPresenter){
			$(_PIK5.slides[_PIK5.current]).trigger('deactivate');
			$(_PIK5.slides[index]).trigger('activate');
			$(document).trigger('slidechange', index);
			if(_PIK5.hasWorker && propagate){
				_PIK5.port.postMessage({
					slidenum: index
				});
			}
		}
		framecontainer.css('left', index * slidesize * -1);
		_PIK5.current = index;
	}
};


// Go to the next slide
_PIK5.slideNext = function(){
	_PIK5.slideTo(_PIK5.current + 1, true);
};


// Go to the previous slide
_PIK5.slideBack = function(){
	_PIK5.slideTo(_PIK5.current - 1, true);
};


// Setup web worker
if(!inPresenter && _PIK5.hasWorker){
	// Recieve messages from worker
	_PIK5.port.addEventListener('message', function(evt){
		var data = evt.data;
		if(data && typeof data.slidenum != 'undefined'){
			_PIK5.slideTo(data.slidenum, false);
		}
		if(data && typeof data.hidden != 'undefined'){
			if(data.hidden != _PIK5.hidden){
				_PIK5.setHidden(data.hidden, false);
			}
		}
	});
	_PIK5.port.start();
	// Send an initial sync request to the worker
	_PIK5.port.postMessage(null);
}


// Change slides or hide presentation on keypress. Do nothing if the page is embedded in presenter.html
if(!inPresenter){
	$(document).bind({
		'slidenext': function(){
			_PIK5.slideNext();
		}
		, 'slideback': function(){
			_PIK5.slideBack();
		}
		, 'hide': function(){
			_PIK5.toggleHidden();
		}
	});
}


});
