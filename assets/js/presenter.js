/*
	presenter.js
	Script for the presenter
*/


jQuery(window).load(function(){


// Get the iframes
var current = $('#current')[0].contentWindow
  , next = $('#next')[0].contentWindow;
_PIK5.location = current.location.href;


// Get the current windows slides
var slides = current.jQuery('.slide');


// Set the number of slides
$('#numslides').text(slides.length);


// Setup the Worker
if(_PIK5.hasWorker){
	// Recieve messages from worker
	_PIK5.port.addEventListener('message', function(evt){
		var data = evt.data;
		// Active slides change
		if(data && typeof data.slidenum != 'undefined'){
			data.slidenum = parseInt(data.slidenum);
			_PIK5.current = data.slidenum;
			current._PIK5.slideTo(data.slidenum, false);
			next._PIK5.slideTo(data.slidenum + 1, false);
			$('#currentindex').html(data.slidenum + 1);  // Current slide display
			updateProgress(data.slidenum);               // Update progress bar
			updateSelect(data.slidenum);                 // Update select field
		}
		// Hidden state changes
		if(data && typeof data.hidden != 'undefined'){
			data.hidden = parseInt(data.hidden);
			_PIK5.hidden = data.hidden;
			current._PIK5.setHidden(data.hidden, false);
			next._PIK5.setHidden(data.hidden, false);
		}
		// Active presentation changes
		if(data && typeof data.location != 'undefined'){
			console.log(data.location);
			if(data.location !== null && data.location != _PIK5.location){
				_PIK5.location = data.location;
				current.location = _PIK5.location;
				next.location = _PIK5.location;
			}
		}
	});
	_PIK5.port.start();
	// Send an initial sync request to the worker
	_PIK5.port.postMessage(null);
}


// Add the slides to the progress bar
var progress = $('#progress');
var slidewidth = Math.floor(928/slides.length) - 2;
slides.each(function(index){
	var slidenum = index;
	var segment = $('<div style="width:' + slidewidth + 'px">' + slidenum + '</div>');
	segment.click(function(){
		if(_PIK5.hasWorker){
			_PIK5.port.postMessage({
				'slidenum': slidenum
			});
		}
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


// Setup control links
$('#slidenext').click(function(evt){
	$(document).trigger('slidenext');
});
$('#slideback').click(function(evt){
	$(document).trigger('slideback');
});


// Setup control menu
var slideselect = $('#slideselect');
var slideselecthtml = '';
current._PIK5.slides.each(function(index, slide){
	slide = $(slide);
	if(slide.attr('id') !== 'end'){
		var headlines = slide.find('h1, h2, h3, h4, h5, h6');
		var optiontitle = (headlines[0]) ? index + 1 + ': ' + $(headlines[0]).text() : index;
		slideselecthtml += '<option value="' + index + '">' + optiontitle + '</option>';
	}
});
slideselect.html(slideselecthtml);
slideselect.change(function(){
	_PIK5.port.postMessage({
		'slidenum': slideselect.val()
	});
})


// Keep the slide select up to date
var updateSelect = function(index){
	slideselect.val(index);
}


// Delegeate control events
$(document).bind({
	'slidenext': function(){
		_PIK5.port.postMessage({
			'slidenum': _PIK5.current + 1
		});
	},
	'slideback': function(){
		_PIK5.port.postMessage({
			'slidenum': _PIK5.current - 1
		});
	},
	'hide': function(){
		_PIK5.hidden = (_PIK5.hidden === 1) ? 0 : 1;
		_PIK5.port.postMessage({
			hidden: _PIK5.hidden
		});
	}
});


// Iframes must re-scroll on load
$(current).bind('load', function(){
	current.scrollTo(_PIK5.current, false);
});
$(next).bind('load', function(){
	next.scrollTo(_PIK5.current + 1, false);
});


});
