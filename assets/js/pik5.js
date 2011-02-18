// Global vars and functions
_PIK5.slides,
_PIK5.slideTo,
_PIK5.slideNext,
_PIK5.slideBack,
_PIK5.toggleOverlay;


jQuery(document).ready(function($){


var current = 0
  , frame = $('#frame')
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


// The function used to hide the presentation
_PIK5.toggleOverlay = function(){
	overlay.toggle()
}


// Slide to the slide index
_PIK5.slideTo = function(index){
	index = parseInt(index);
	if(_PIK5.slides[index]){
		if(!inPresenter){
			$(_PIK5.slides[current]).trigger('deactivate');
			$(_PIK5.slides[index]).trigger('activate');
			$(document).trigger('slidechange', index);
		}
		framecontainer.css('left', index * slidesize * -1);
		current = index;
	}
}


// Go to the next slide
_PIK5.slideNext = function(){
	_PIK5.slideTo(current + 1);
}


// Go to the previous slide
_PIK5.slideBack = function(){
	_PIK5.slideTo(current - 1);
}


// Change slides or hide presentation on keypress. Do nothing if the page is embedded in presenter.html
if(!inPresenter){
	$(document).bind({
		'slidenext': function(){
			_PIK5.slideNext()
		},
		'slideback': function(){
			_PIK5.slideBack()
		},
		'overlay': function(){
			_PIK5.toggleOverlay()
		}
	});
}



});
