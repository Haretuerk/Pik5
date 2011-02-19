// Global vars and functions
_PIK5.slideTo, _PIK5.slideNext, _PIK5.slideBack, _PIK5.setHidden, _PIK5.toggleHidden;


jQuery(document).ready(function($){


var frame = $('#frame')
  , framecontainer = $('#framecontainer')
  , inPresenter = /presenter\.html(#([0-9]+))*$/.test(parent.location + '')
  , slidesize;


// Setup frame and frameconteiner css, add end slide
framecontainer.append('<div id="end" class="slide"><p>End of presentation.</p></div>');
_PIK5.slides = $('.slide');
frame.css('overflow', 'hidden');
framecontainer.css('width', 100 * _PIK5.slides.length + '%');


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
			'hidden': _PIK5.hidden
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
	// Jump to index
	index = parseInt(index);
	if(_PIK5.slides[index]){
		$(_PIK5.slides[_PIK5.current]).trigger('deactivate');
		$(_PIK5.slides[index]).trigger('activate');
		$(document).trigger('slidechange', index);
		if(_PIK5.hasWorker && propagate){
			_PIK5.port.postMessage({
				'slidenum': index
			});
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
		// React to changed slide number
		if(data && typeof data.slidenum != 'undefined'){
			var index = parseInt(data.slidenum);
			_PIK5.slideTo(data.slidenum, false);
		}
		// React to changed hidden state
		if(data && typeof data.hidden != 'undefined'){
			if(data.hidden != _PIK5.hidden){
				_PIK5.setHidden(data.hidden, false);
			}
		}
		// React to changed location
		if(data && typeof data.location != 'undefined'){
			if(data.location !== null && data.location != _PIK5.location){
				location.href = data.location;
			}
		}
	});
	_PIK5.port.start();
}


// Absolute center function
var positionCenter = function(){
	var supercenter = $('.pik5-center');
	var slideH = $('.slide').height();
	var slideW = $('.slide').width();
	supercenter.each(function(index, el){
		el = $(el);
		var elH = el.outerHeight(true);
		var elW = el.outerWidth(true);
		el.css({
			position: 'relative',
			top: (slideH - elH) / 2 + 'px',
			left:  (slideW - elW) / 2 + 'px'
		});
	});
};


// Setup font and slide size
var setFontFrameSize = function(){
	var frameratio = (frame.height() + frame.width()) / 1000;
	$('body').css('font-size', frameratio + 'em');
	slidesize = framecontainer.width() / _PIK5.slides.length;
	_PIK5.slides.css('width', slidesize + 'px');
	_PIK5.slideTo(_PIK5.current);
};


// Gets called onload
var initFunction = function(){
	setFontFrameSize();
	positionCenter();
	_PIK5.location = location.href;
	if(!inPresenter && _PIK5.hasWorker){
		// Important initial sync request
		_PIK5.port.postMessage({
			'location': _PIK5.location
		});
	}
};


// Resize and reposition on load and on resize
$(window).bind('resize', setFontFrameSize);
$(window).bind('resize', positionCenter);
$(window).bind('load', initFunction);


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
