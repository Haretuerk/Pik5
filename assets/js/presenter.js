/*
	presenter.js
	Script for the presenter
*/


_PIK5.currentWindow;
_PIK5.nextWindow;


_PIK5.presenterInit = function(){
	_PIK5.location = _PIK5.currentWindow.location.href;
	_PIK5.slides = _PIK5.currentWindow.jQuery('.slide');
	$('#numslides').text(_PIK5.slides.length); // Set the shown number of slides
	_PIK5.setupWorker();
	_PIK5.setupProgress();
	_PIK5.setupControls();
};


_PIK5.presenterReload = function(){
	_PIK5.location = _PIK5.currentWindow.location.href;
	_PIK5.slides = _PIK5.currentWindow.jQuery('.slide');
	$('#numslides').text(_PIK5.slides.length); // Set the shown number of slides
	$('#progress').html('');
	_PIK5.setupProgress();
	$('#slideselect').html('');
	_PIK5.setupControls();
};


_PIK5.setupProgress = function(current){
	var progress = $('#progress');
	var slidewidth = Math.floor(928/_PIK5.slides.length) - 2;
	_PIK5.slides.each(function(index){
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
}


_PIK5.updateProgress = function(current){
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


_PIK5.setupWorker = function(){
	if(_PIK5.hasWorker){
		// Recieve messages from worker
		_PIK5.port.addEventListener('message', function(evt){
			var data = evt.data;
			// Active slides change
			if(data && typeof data.slidenum != 'undefined'){
				data.slidenum = parseInt(data.slidenum);
				_PIK5.current = data.slidenum;
				_PIK5.currentWindow._PIK5.slideTo(data.slidenum, false);
				_PIK5.nextWindow._PIK5.slideTo(data.slidenum + 1, false);
				$('#currentindex').html(data.slidenum + 1); // Current slide display
				_PIK5.updateProgress(data.slidenum);        // Update progress bar
				$('#slideselect').val(data.slidenum);       // Update select field
			}
			// Hidden state changes
			if(data && typeof data.hidden != 'undefined'){
				data.hidden = parseInt(data.hidden);
				_PIK5.hidden = data.hidden;
				_PIK5.currentWindow._PIK5.setHidden(data.hidden, false);
				_PIK5.nextWindow._PIK5.setHidden(data.hidden, false);
			}
			// Active presentation changes
			if(data && typeof data.location != 'undefined'){
				if(data.location !== null && data.location != _PIK5.location){
					_PIK5.location = data.location;
					_PIK5.currentWindow.location = _PIK5.location;
					_PIK5.nextWindow.location = _PIK5.location;
				}
			}
		});
		_PIK5.port.start();
		_PIK5.port.postMessage(null); // Important initial sync request
	}
}


_PIK5.setupTimer = function(){
	var time = $('#time')
	  , now = $('#now')
	  , h = 0
	  , m = 0
	  , s = 0;
	setInterval(function(){
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
};


_PIK5.setupControls = function(){
	// Buttons
	$('#slidenext').click(function(evt){
		$(document).trigger('slidenext');
	});
	$('#slideback').click(function(evt){
		$(document).trigger('slideback');
	});
	// Select menu
	var slideselect = $('#slideselect');
	var slideselecthtml = '';
	_PIK5.slides.each(function(index, slide){
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
};


jQuery(window).load(function(){
	_PIK5.currentWindow = $('#current')[0].contentWindow
	_PIK5.nextWindow = $('#next')[0].contentWindow;
	if(_PIK5.currentWindow && _PIK5.nextWindow){
		_PIK5.presenterInit();
	}
	$(_PIK5.currentWindow).bind('load', function(){
		_PIK5.currentWindow.scrollTo(_PIK5.current, false);
	});
	$(_PIK5.currentWindow).bind('load', function(){
		_PIK5.currentWindow.scrollTo(_PIK5.current + 1, false);
	});
});


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
