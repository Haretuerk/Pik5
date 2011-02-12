// Report an error if window.opener goes missing
var windowError = function(){
	alert("Error: can't find presentation window. Was the presentation window closed or refreshed?");
}


window.onload = function(){


// Do we have a presentation open?
if(!window.opener){
	windowError();
}


// Get the iframes
var current = $('#current')[0].contentWindow
  , next = $('#next')[0].contentWindow;


// Slides
var slides = current.jQuery('.slide');

// Get the number of slides
$('#numslides').text(slides.length);


// Start from where the presenter was launched
var index = parseInt(/#([0-9]+)$/.exec(window.location)[1]);
if(!index){
	index = 0;
}
current.slideTo(index);
next.slideTo(index + 1);
$('#currentindex').html(index + 1);


// Add the slides to the progress bar
var progress = $('#progress');
var slidewidth = Math.floor(928/slides.length) - 2;
slides.each(function(index){
	var slidenum = index + 1;
	var segment = $('<div style="width:' + slidewidth + 'px">' + slidenum + '</div>');
	segment.click(function(){
		window.opener.slideTo(index);
	});
	progress.append(segment);
});


// Update the progress bar
var updateProgress = function(current){
	var segments = jQuery('#progress div');
	segments.each(function(index, segment){
		if(index < current){
			jQuery(segment).addClass('past').removeClass('future').removeClass('current');
		}
		else if(index > current){
			jQuery(segment).addClass('future').removeClass('past').removeClass('current');
		}
		else {
			jQuery(segment).addClass('current').removeClass('past').removeClass('future');
		}
	});
}
updateProgress(index);


// Setup the timer
var time = $('#time')
  , now = $('#now')
  , h = 0
  , m = 0
  , s = 0
  , timer = setInterval(function(){
	s++;
	var t = new Date();
	if(s == 60){
		s = 0; m++;
	}
	if(m == 60){
		m = 0; h++;
	}
	h = h + '';
	if(h.length == 1) { h = '0' + h }
	m = m + '';
	if(m.length == 1) { m = '0' + m }
	s = s + '';
	if(s.length == 1) { s = '0' + s }
	time.html(h + ':' + m + ':' + s);
	now.html(t.toLocaleTimeString());
}, 1000);


// Recieve messages from the presentation
window.addEventListener('message', function(event){
	if(event.data == 'toggleOverlay'){
		current.toggleOverlay();
	}
	else {
		var currentslide = parseInt(event.data);
		var nextslide = parseInt(event.data) + 1;
		current.slideTo(currentslide);
		next.slideTo(nextslide);
		$('#currentindex').text(nextslide);
		updateSelect(currentslide);
		updateProgress(currentslide);
	}
}, false);


// Delegeate control events
$(document).bind({
	'slidenext': function(){
		if(window.opener){
			window.opener.slideNext();
		}
		else{
			windowError();
		}
	},
	'slideback': function(){
		if(window.opener){
			window.opener.slideBack();
		}
		else{
			windowError();
		}
	},
	'overlay': function(){
		if(window.opener){
			window.opener.toggleOverlay();
		}
		else{
			windowError();
		}
	}
});


// Setup control links
$('#slidenext').click(function(evt){
	if(window.opener){
		window.opener.slideNext();
	}
	else{
		windowError();
	}
});
$('#slideback').click(function(evt){
	if(window.opener){
		window.opener.slideBack();
	}
	else{
		windowError();
	}
});


// Setup control menu
var slideselect = $('#slideselect');
var slideselecthtml = '';
if(window.opener && window.opener.slides){
	window.opener.slides.each(function(index, slide){
		slide = $(slide);
		if(slide.attr('id') !== 'end'){
			var headlines = slide.find('h1, h2, h3, h4, h5, h6');
			var optiontitle = (headlines[0]) ? index + 1 + ': ' + $(headlines[0]).text() : index;
			slideselecthtml += '<option value="' + index + '">' + optiontitle + '</option>';
		}
	})
}
slideselect.html(slideselecthtml);
slideselect.change(function(){
	if(window.opener){
		window.opener.slideTo(slideselect.val(), true);
	}
	else{
		windowError();
	}
})


// Keep the slide select up to date
var options = slideselect.find('option');
var updateSelect = function(index){
	options.each(function(i, option){
		if(option.value == index){
			slideselect.val(index);
		}
	});
}


}
