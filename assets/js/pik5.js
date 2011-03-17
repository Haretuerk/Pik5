// Public vars and functions
jQuery(document).ready(function($){

var frame = $('#frame'),
    framecontainer = $('#framecontainer'),
    slidesize;

// Setup frame and frameconteiner css, add end slide
framecontainer.append('<div id="end" class="pik5-slide"><p>End of presentation.</p></div>');
pik5.slides = $('.pik5-slide');
frame.css('overflow', 'hidden');
framecontainer.css('width', 100 * pik5.slides.length + '%');

// The overlay element used to hide the presentation
var overlayclass = (pik5.inPresenter) ? 'overlay overlay-presenter' : 'overlay';
var overlay = $('<div class="' + overlayclass + '"></div>').hide().appendTo(frame);

// Function to setup positions, font and slide size
var setFontFrameSizePosition = function(){
	var frameratio = (frame.height() + frame.width()) / 1000;
	$('body').css('font-size', frameratio + 'em');
	slidesize = framecontainer.width() / pik5.slides.length;
	pik5.slides.css('width', slidesize + 'px');
	var supercenter = $('.pik5-center');
	var slideH = $('.pik5-slide').height();
	var slideW = $('.pik5-slide').width();
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
}

// Resize and reposition on load and on resize and load
$(window).bind('resize', setFontFrameSizePosition);
$(window).bind('load', setFontFrameSizePosition);

// Move to slide "index"
var slideTo = function(index){
	index = parseInt(index);
	$(pik5.slides[pik5.current]).trigger('deactivate');
	$(pik5.slides[index]).trigger('activate');
	$(document).trigger('change', index);
	framecontainer.css('left', index * slidesize * -1);
}

// Execute slide
$(window).bind('slideTo', function(evt, index){
	slideTo(index);
});

// Execute show/hide change
$(window).bind({
	'show': function(){
		overlay.hide();
	},
	'hide': function(){
		overlay.show();
	}
});

// Hide presentation on page change
$(window).bind('goTo', function(){
	overlay.show();
});

});
