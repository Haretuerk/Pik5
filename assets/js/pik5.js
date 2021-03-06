// Public vars and functions
var slideTo, show, hide, changePage;

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
var overlay = $('<div class="' + overlayclass + '"></div>').hide().appendTo(document.body);
show = function(){
	overlay.hide();
}
hide = function(){
	overlay.show();
}

// Function to setup aspect ratio, positions, font and slide size
var setFontFrameSizePosition = function(){
	// Force 4:3 aspect ratio
	var bw = $('body').width(), bh = $('body').height();
	var ratio = 4 / 3;
	if(bw > bh * ratio){
		frame.css('width', bh * ratio + 'px');
		frame.css('height', bh + 'px');
	}
	else if(bh > bw / ratio){
		frame.css('width', bw + 'px');
		frame.css('height', bw / ratio + 'px');
	}
	// Set font size and slide width
	var fontsize = (frame.height() + frame.width()) / 1000;
	$('body').css('font-size', fontsize + 'em');
	slidesize = framecontainer.width() / pik5.slides.length;
	pik5.slides.css('width', slidesize + 'px');
	// Center elements
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
	// Re-position current slide
	slideTo(null, pik5.current);
}

// Resize and reposition on load and on resize and load
$(window).bind('resize', setFontFrameSizePosition);
$(window).bind('load', setFontFrameSizePosition);

// Fire slide change events on document load
$(window).bind('load', function(){
	$(this).trigger('change', pik5.current);
	$(pik5.slides[pik5.current]).trigger('activate');
});


// Move to slide "index"
slideTo = function(evt, index){
	if(typeof evt != 'undefined'){
		index = (typeof index != 'undefined') ? parseInt(index) : 0;
		framecontainer.css('left', index * slidesize * -1);
	}
}

// Sync slide and body background color
if(!pik5.inPresenter){ // prevents all sorts of chaos in the presenter view
	if(typeof $.Color != 'undefined'){ // for compatibility reasons
		var default_color = $('body').css('background-color');
		if(default_color){
			$('.pik5-slide').bind('activate', function(){
				var c = $.Color($(this).css('background-color'));
				if(c.alpha()){
					$('body').css('background-color', c);
				}
				else {
					$('body').css('background-color', default_color);
				}
			});
		}
	}
}

// Do a page change
changePage = function(evt, url){
	hide();
	location.href = url;
};

// Execute events only if not in presenter
if(!pik5.inPresenter){
	$(window).bind({
		'slideTo' : slideTo,
		'show'    : show,
		'hide'    : hide,
		'goTo'    : changePage,
		'location': changePage
	});
}

// Add presenter style modifications
if(pik5.inPresenter){
	var presenter_style_path = 'assets/css/pik5-presenter.css';
	presenter_style_path = (typeof pik5_base_dir != 'undefined') ? pik5_base_dir + presenter_style_path : presenter_style_path;
	$('head').append('<link rel="stylesheet" href="' + presenter_style_path + '">');
}

});
